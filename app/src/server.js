const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const Filter = require('bad-words');
const { createMessages } = require('./utils/create-messages');
const { getUserList, addUser, removeUser, findUser } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io =socketio(server);

let count = 1;
const message = "chào mọi người";

//lắng nghe sự kiện kết nối từ client
io.on('connection', (socket) => {



  socket.on("join room from client to server", 
  ({room , username})=>{
    socket.join(room);

    //client vừa kết nối
  socket.emit("send messeages from server to client",createMessages(`Chào mừng bạn đến với phòng ${room}`, "Admin") );
  socket.broadcast.to(room).emit("send messeages from server to client",createMessages( `Client ${username} vừa tham gia vào phòng ${room}`, "Admin"))

    //chat
  socket.on("send messages from client to server", 
  (messagesText, callback)=>{
    const filter = new Filter();
    if(filter.isProfane(messagesText)){
      return callback("messages không hợp lệ vì có từ tục tĩu");
    }

    const id =socket.id;
    const user = findUser(id);


    io.to(room).emit("send messeages from server to client", createMessages(messagesText, user.username));
    callback();
  })

  //gửi vị trí 
  socket.on("send location from client to server",
  ({latitude, longitude})=>{
    const id =socket.id;
    const user = findUser(id);
    const linkPosition = `https://www.google.com/maps?q${latitude},${longitude}`;
    io.to(room).emit("send location from server to client", createMessages(linkPosition, user.username));
  })

  //xử lý userlist
  const newUser = {
    id: socket.id,
    username,
    room
  }

  addUser(newUser);
  io.to(room).emit("send userlist trong server to client", getUserList(room));

  //ngắt kết nối
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.to(room).emit("send userlist trong server to client", getUserList(room));
    console.log("client left server");
  });

  });


  
});


//cài đặt static file
const publicPathDirectory = path.join(__dirname, "../public");
app.use(express.static(publicPathDirectory));



// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })


const port = 3000
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
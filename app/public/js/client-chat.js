//yêu cầu server kết nối với client
var socket = io();

document.getElementById("form-messages").addEventListener("submit", 
(e)=>{
   e.preventDefault();
   const messagesText  = document.getElementById("input-messages").value;
   const acknowledgements = (errors) =>{
        if(errors){
        return alert("tin nhắn không hợp lệ");
        }
        console.log("đã gửi tin nhắn thành công")
   }
   socket.emit("send messages from client to server", messagesText,acknowledgements);
});

socket.on("send messeages from server to client", (messages)=>{
        console.log(messages);
        const {createAt, messagesText, username} = messages;
        const contentHtml = document.getElementById("app__messages").innerHTML;
        const messagesElement = `<div class="message-item">
                                <div class="message__row1">
                                        <p class="message__name">${username}</p>
                                        <p class="message__date">${createAt}</p>
                                </div>
                                <div class="message__row2">
                                        <p class="message__content">
                                        ${messagesText}
                                        </p>
                                </div>
                        </div>`;
        let contentRender = contentHtml + messagesElement;
        document.getElementById("app__messages").innerHTML = contentRender;

        //clear dòng input chat
        document.getElementById("input-messages").value = "";
})

document.getElementById("btn-share-location").addEventListener("click",
()=>{
        if(!navigator.geolocation){
                return alert("trình duyệt không hỗ trợ tìm vị trí")
        }
        navigator.geolocation.getCurrentPosition((position)=>{
         const {latitude, longitude} = position.coords;
         socket.emit("send location from client to server", {latitude, longitude});
        })
})

socket.on("send location from server to client", 
(data)=>{
        const {createAt, messagesText, username} = data;
        const contentHtml = document.getElementById("app__messages").innerHTML;
        const messagesElement = `<div class="message-item">
                                <div class="message__row1">
                                        <p class="message__name">${username}</p>
                                        <p class="message__date">${createAt}</p>
                                </div>
                                <div class="message__row2">
                                        <p class="message__content">
                                        <a href= "${messagesText}" target="_blank">
                                        vị trí của ${username} </a>
                                        </p>
                                </div>
                        </div>`;
        let contentRender = contentHtml + messagesElement;
        document.getElementById("app__messages").innerHTML = contentRender;
        console.log(linkPosition);
})

const queryString = location.search;
const params = Qs.parse(queryString, {
ignoreQueryPrefix: true,
});

const {room , username} = params;

socket.emit("join room from client to server", {room , username});

document.getElementById("app__title").innerHTML = room;

 //xử lý userlist
socket.on("send userlist trong server to client", (userList)=>{
        console.log("userList: "+ userList);
        let contentHtml = "";
        userList.map((user)=>{
                contentHtml += `
                        <li class="app__item-user"> 
                        ${user.username}</li>
                `;
        })
        document.getElementById("app__list-user--content").innerHTML = contentHtml;
})





        
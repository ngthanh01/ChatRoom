let userList = [
    {
        id: "01",
        username : "Trần Thanh Bình",
        room: "it01"
    },
    {
        id: "02",
        username : "Nguyễn Trung Cường",
        room: "it02"
    },
]

const addUser = (newUser) => (userList = [...userList, newUser]);

const getUserList = (room)=> userList.filter((user)=> user.room === room);

const removeUser = (id) => (userList = userList.filter((user)=> user.id !== id));

const findUser = (id) => (user = userList.find((user)=> user.id === id));

module.exports = {
    getUserList,
    addUser,
    removeUser,
    findUser
}
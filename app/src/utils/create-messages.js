const formatTime = require("date-format");

const createMessages = (messagesText, username) =>{
    return {
        username,
        messagesText,
        createAt: formatTime("dd/MM/yyyy hh:mm::ss",new Date())
    }
};

module.exports = {
    createMessages
}
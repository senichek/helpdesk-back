const Chat = require("./Chat");
const Message = require("./Message");

Chat.hasMany(Message, {
  foreignKey: "chat_id",
});

Message.belongsTo(Chat, {
    foreignKey: "chat_id"
});

module.exports = { Chat, Message };
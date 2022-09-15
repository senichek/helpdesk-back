const Chat = require("./Chat");
const Message = require("./Message");
const User = require("./User");

Chat.hasMany(Message, {
  foreignKey: "chat_id",
});

Message.belongsTo(Chat, {
    foreignKey: "chat_id",
});

Chat.belongsToMany(User, { through: 'chat_per_owner' });
User.belongsToMany(Chat, { through: 'chat_per_owner' });


module.exports = { Chat, Message, User };
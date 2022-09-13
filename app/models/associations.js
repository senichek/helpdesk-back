const Chat = require("./Chat");
const Message = require("./Message");

Chat.hasMany(Message, {
  foreignKey: "chat_id",
});

Message.belongsTo(Chat, {
    foreignKey: "chat_id"
});

/* Tag.belongsToMany(Task, { through: 'task_has_tag', foreignKey: "tag_id" });
Task.belongsToMany(Tag, { through: 'task_has_tag', foreignKey: "task_id" }); */

module.exports = { Chat, Message };
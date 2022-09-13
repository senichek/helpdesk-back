const { DataTypes, Model } = require('sequelize');
const sequelize = require("../dbClient");

class Chat extends Model {}

Chat.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Chat', // We need to choose the model name
  tableName: "chat"
});

module.exports = Chat;
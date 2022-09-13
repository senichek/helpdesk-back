const { DataTypes, Model } = require('sequelize');
const sequelize = require("../dbClient");

class Message extends Model {}

Message.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  receiver: {
    type: DataTypes.STRING,
    allowNull: false
  },
  chat_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Message', // We need to choose the model name
  tableName: "message"
});

module.exports = Message;
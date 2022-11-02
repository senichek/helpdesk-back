require("dotenv").config();

const cors = require('cors');
const express = require("express");
const router = require("./app/router");
const chatServer = require('./chatServer/index');

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
  origin: 'https://lush-agreement.surge.sh',
  methods:['GET', 'POST', 'PATCH', 'DELETE']
}));

app.use(router);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const chatServerPort = process.env.CHAT_SERVER_PORT;

chatServer.listen(chatServerPort, () => {
  console.log(`Chat server is listening on port ${chatServerPort}`);
});
require("dotenv").config();

const cors = require('cors');
const express = require("express");
const router = require("./app/router");

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods:['GET', 'POST', 'PATCH', 'DELETE']
}));

app.use(router);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
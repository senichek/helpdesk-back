require("dotenv").config();
const express = require("express");
const router = require("../../app/router");

const app = express();

app.use(express.json());

app.use(router);

// Export to make it available for testing
// It will be imported in userController.test.js file
module.exports = app;
const express = require("express");
const router = express.Router();
const userController = require('./controllers/userController');

router.get("/", userController.login);

router.use((req, res) => {
  res.json("404");
});

module.exports = router;

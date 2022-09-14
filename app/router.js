const express = require("express");
const router = express.Router();
const tryCatcher = require('./middleware/controllerHandler');
const userController = require('./controllers/userController');
const auth = require('./middleware/authentication');

router.post("/login", tryCatcher(userController.login));
router.post("/signup", tryCatcher(userController.signup));
router.get("/protected", auth, tryCatcher(userController.getProtected));

router.use((req, res) => {
  res.json("404");
});

module.exports = router;

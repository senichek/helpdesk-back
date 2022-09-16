const express = require("express");
const router = express.Router();
const tryCatcher = require('./middleware/controllerHandler');
const userController = require('./controllers/userController');
const auth = require('./middleware/authentication');

router.post("/login", tryCatcher(userController.login));
router.post("/signup", tryCatcher(userController.signup));
router.delete("/user", auth, tryCatcher(userController.delete));
router.post("/user", auth, tryCatcher(userController.create));
router.patch("/user", auth, tryCatcher(userController.update));
router.get("/users", auth, tryCatcher(userController.getAllUsers));

router.use((req, res) => {
  res.json("404");
});

module.exports = router;

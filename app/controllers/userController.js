const User = require("../models/User");

const userController = {

    login: async (req, res) => {
        try {
            const result = await User.findAll();
            console.log("Result >>>", result);
        } catch (error) {
          console.log(error);  
        }
    }
};

module.exports = userController;


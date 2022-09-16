const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

const userController = {
  generateJWT: (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    // Make sure all the details were provided.
    if (!email || !password) {
      res.status(400).json({ error: "Invalid input." });
    } else {
      const exists = await User.findAll({
        where: {
          email: email,
        },
      });
      // if user is present in DB, compare the password
      if (
        exists.length > 0 &&
        (await bcrypt.compare(password, exists[0].dataValues.password))
      ) {
        // Remove password and add JWT
        const logged = {
          ...exists[0].dataValues,
          password: "",
          jwt: userController.generateJWT(exists[0].dataValues.id),
        };
        console.log("Logged-in >>>", logged);
        res.status(200).json(logged);
      } else {
        res.status(400).json({ error: "Invalid credentials" });
      }
    }
  },

  signup: async (req, res) => {
    const { name, email, role, password, password2 } = req.body;
    // Make sure all the details were provided.
    if (!name || !email || !role || !password) {
      res.status(400).json({ error: "The details are incomplete." });
      // Make sure the password confirmation was correct.
    } else if (password !== password2) {
      res.status(400).json({ error: "Both passwords must be the same." });
    } else {
      const exists = await User.findAll({
        where: {
          email: email,
        },
      });
      // Check if the user exists already
      if (exists.length > 0) {
        res.status(400).json({ error: "User exists" });
      } else {
        // Hash password
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Persist new user (isAvailable is false by default)
        const toCreate = {
          id: uuidv4(),
          name,
          email,
          role,
          password: hashedPassword,
          isAvailable: false,
        };

        const dbResponse = await User.create(toCreate);
        // Remove password and add JWT
        const created = {
          ...dbResponse.dataValues,
          password: "",
          jwt: userController.generateJWT(dbResponse.dataValues.id),
        };
        console.log("Registered >>>", created);
        res.status(201).json(created);
      }
    }
  },

  delete: async (req, res) => {
    if (req.loggedIn.role !== "admin") {
      res.status(400).json({ error: "Not authorized" });
    } else {
      const { id } = req.body;
      const toDelete = await User.findByPk(id);

      if (toDelete) {
        const result = await toDelete.destroy();
        console.log(`User with id ${id} was deleted`);
        res.status(200).json({ message: `User with id ${id} was deleted` });
      } else {
        res.status(400).json({ message: `User with id ${id} not found` });
      }
    }
  },

  create: async (req, res) => {
    // Only admins can create users
    if (req.loggedIn.role !== "admin") {
      res.status(400).json({ error: "Not authorized" });
    } else {
      const { name, email, role, password, password2 } = req.body;
      // Make sure all the details were provided.
      if (!name || !email || !role || !password) {
        res.status(400).json({ error: "The details are incomplete." });
        // Make sure the password confirmation was correct.
      } else if (password !== password2) {
        res.status(400).json({ error: "Both passwords must be the same." });
      } else {
        const exists = await User.findAll({
          where: {
            email: email,
          },
        });
        // Check if the user exists already
        if (exists.length > 0) {
          res.status(400).json({ error: "User exists" });
        } else {
          // Hash password
          const salt = await bcrypt.genSalt(saltRounds);
          const hashedPassword = await bcrypt.hash(password, salt);

          // Persist new user (isAvailable is false by default)
          const toCreate = {
            id: uuidv4(),
            name,
            email,
            role,
            password: hashedPassword,
            isAvailable: false,
          };

          const dbResponse = await User.create(toCreate);
          // Remove password and add JWT
          const created = {
            ...dbResponse.dataValues,
            password: "",
            jwt: userController.generateJWT(dbResponse.dataValues.id),
          };
          console.log("Created >>>", created);
          res.status(201).json(created);
        }
      }
    }
  },

  update: async (req, res) => {
    const toUpdate = await User.findByPk(req.body.id);
    if (!toUpdate) {
      res.status(400).json({error: `User with id ${req.body.id} not found`});
      return;
    } 
    if (toUpdate.dataValues.id !== req.loggedIn.id) {
    // Update can be done either by the logged-in user (user can 
    // only update himself) or by any admin.
      res.status(400).json({error: 'No permission'});
    }

    // For update we'll need all the fields (we will not update password and role here)
    const {id, name, email, isAvailable} = req.body;
    if (!id || !name || !email || isAvailable === undefined) {
      res.status(400).json({error: 'Provide id, name, email, isAvailable'});
      return;
    }
  
    toUpdate.name = name;
    toUpdate.email = email;
    toUpdate.isAvailable = isAvailable;

    const updated = await toUpdate.save();
    console.log(`User ${req.body.id} has been updated`)
    res.status(200).json(updated);
  },

  getAllUsers: async (req, res) => {
    if (req.loggedIn.role === "admin" || req.loggedIn.role === "helper") {
      const dbResponse = await User.findAll();
      // get all simple users and remove their passwords
      const users = dbResponse.filter(el => el.dataValues.role === 'user').map(el => ({...el.dataValues, password: ""}));
      console.log("Simple users >>>", users);
      res.status(200).json(users);
    } else {
      res.status(400).json({ error: "Not authorized" });
    }
  }
};

//TODO tests for getallusers

module.exports = userController;

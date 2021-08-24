import express from "express";
const userRepository = require("../repositories/userRepository");
const { check, validationResult } = require('express-validator')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
const router = express.Router();

// router.put("/:id", isAuth, async (req, res) => {
//   const userId = req.params.id;
//   const user = await User.findById(userId);
//   if (user) {
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.password = req.body.password || user.password;
//     const updatedUser = await user.save();
//     res.send({
//       _id: updatedUser.id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       isAdmin: updatedUser.isAdmin,
//       token: getToken(updatedUser),
//     });
//   } else {
//     res.status(404).send({ message: "User Not Found" });
//   }
// });

// router.post("/signin", async (req, res) => {
//   const signinUser = await User.findOne({
//     email: req.body.email,
//     password: req.body.password,
//   });
//   if (signinUser) {
//     res.send({
//       _id: signinUser.id,
//       name: signinUser.name,
//       email: signinUser.email,
//       isAdmin: signinUser.isAdmin,
//       token: getToken(signinUser),
//     });
//   } else {
//     res.status(401).send({ message: "Invalid Email or Password." });
//   }
// });

// router.post("/register", async (req, res) => {
//   const user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//   });
//   const newUser = await user.save();
//   if (newUser) {
//     res.send({
//       _id: newUser.id,
//       name: newUser.name,
//       email: newUser.email,
//       isAdmin: newUser.isAdmin,
//       token: getToken(newUser),
//     });
//   } else {
//     res.status(401).send({ message: "Invalid User Data." });
//   }
// });

// router.get("/createadmin", async (req, res) => {
//   try {
//     const user = new User({
//       name: "admin",
//       email: "admin@example.com",
//       password: "admin",
//       isAdmin: true,
//     });
//     const newUser = await user.save();
//     res.send(newUser);
//   } catch (error) {
//     res.send({ message: error.message });
//   }
// });

router.post("/signin", async (req, res) => {
  try {
    userRepository.userSignin(req, res);
  } catch (error) {
    res.status(401).send({ message: "Invalid Email or Password." });
  }
});

router.post("/register", [
  check('phonenumber', 'Phone number is required')
      .not()
      .isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({ errors: errors.array() });
  }
  try {
    await userRepository.registerAccount(req, res);
  } catch (error) {
    res.send({ message: error.message });
  }
});



export default router;

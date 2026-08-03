const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator"); // If data is not valid then we validated it in routes where we set it in errors

async function registerUser(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, lastname, email, password } = req.body;

  const hashPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashPassword,
  });

  const token = user.generateAuthToken();

  return res.status(201).json({ token, user });
}

module.exports = { registerUser };

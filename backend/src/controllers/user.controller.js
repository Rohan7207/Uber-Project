const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator"); // If data is not valid then we validated it in routes where we set it in errors
const blacklistTokenModel = require("../models/blacklistToken");
const cookieOptions = require("../utils/cookieOptions.util");

async function registerUser(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, lastname, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });

  if (isUserAlreadyExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashPassword,
  });

  const token = user.generateAuthToken();

  res.cookie("token", token, cookieOptions);

  user.password = undefined;

  return res.status(201).json({ user });
}

async function loginUser(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // We write select(+password) bcz by default while querying in user schema password is not retrived to retrive that we must use select
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isCorrectPassword = await user.comparePassword(password);

  if (!isCorrectPassword) {
    return res.status(401).json({ message: "Invalid email or passowrd" });
  }

  const token = user.generateAuthToken();

  res.cookie("token", token, cookieOptions);

  res.status(200).json({ user });
}

async function getUserProfile(req, res, next) {
  // In this we should show profile to particular user who is logged in, we need to check whether
  // user is authenticated and show his details if not authenticated we will return unauthorize access. We wiil do this in auth middleware

  return res.status(200).json(req.user);
}

async function logoutUser(req, res, next) {
  // We will add token to blacklisttoken database where token expires in 24hrs
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blacklistTokenModel.create({ token });

  return res.status(200).json({ message: "Logged out" });
}

module.exports = { registerUser, loginUser, getUserProfile, logoutUser };

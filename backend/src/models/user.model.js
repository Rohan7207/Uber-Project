const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"], // If name is less than 3 characters, throw a error message
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters long"],
    },
  },

  email: {
    type: String,
    required: true,
    unique: true, // Ensure that the email is unique in the database
    minlength: [5, "Email must be at least 5 characters long"],
  },

  password: {
    type: String,
    required: true,
    select: false, // Do not return password field when querying database
  },

  // Socket id is live tracking of driver/captain, so that we can send show it to user in real time.
  socketId: {
    type: String,
  },
});

// Generates a JWT token for user authentication. The token contains user's id and is signed with secret key
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

// Compares provided password with hashed password stored in database. Returns true if they match, false otherwise.
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10); // Hash password with salt 10
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

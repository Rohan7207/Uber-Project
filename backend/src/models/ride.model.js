const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  //   Captain is assigned when any captain receives pickup
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Captain",
  },

  pickup: {
    type: String,
    required: true,
  },

  destination: {
    type: String,
    required: true,
  },

  fare: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
    default: "pending",
  },

  duration: {
    type: Number, // In seconds
  },

  distance: {
    type: Number, // In meters
  },

  paymentId: {
    type: String,
  },

  orderId: {
    type: String,
  },

  signature: {
    type: String,
  },

  otp: {
    type: String,
    select: false,
  },
});

const rideModel = mongoose.model("Ride", rideSchema);

module.exports = rideModel;

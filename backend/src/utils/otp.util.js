const crypto = require("crypto");

/**
 * Generate a numeric OTP using Node's `crypto`.
 * Returns a string of exactly `num` digits (leading zeros allowed).
 *
 * @param {number} num - number of digits for the OTP
 * @returns {string}
 */
function generateOtp(num = 6) {
  if (!Number.isInteger(num) || num <= 0) {
    throw new Error("num must be a positive integer");
  }

  let otp = "";
  for (let i = 0; i < num; i++) {
    otp += crypto.randomInt(0, 10).toString();
  }

  return otp;
}

module.exports = {
  generateOtp,
};

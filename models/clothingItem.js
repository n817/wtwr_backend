const mongoose = require("mongoose");
const validator = require("validator");
const user = require("./user");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  weather: {
    type: String,
    required: [true, 'The "weather" field is required'],
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    type: String,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "Please enter a valid URL",
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    default: [],
  },
});

module.exports = mongoose.model("item", clothingItemSchema);

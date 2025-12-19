const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  // user name
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'The "name" field is required'],
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: "Please enter a valid URL",
    },
    required: [true, 'The "avatar" field is required'],
  },
});

module.exports = mongoose.model("user", userSchema);

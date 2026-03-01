const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  // user name
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'The "name" field is required'],
  },
  // user email
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Please enter a valid email",
    },
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
    required: [true, "The avatar field is required"],
  },
  password: {
    type: String,
    required: [true, "The password field is required"],
    select: false,
  },
});

// Method checks the username/password and returns the user object or error.
// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  // try to find user by email
  return this.findOne({ email }) // "this" here is the User model
    .select("+password")
    .then((user) => {
      if (!user) {
        // The throw instruction throws an exception and code processing proceeds to the next catch block.
        throw new Error("incorrect email and/or password");
      }
      // The user is found —> compare password hashes
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new Error("incorrect email and/or password");
        }
        // The hashes match -> returning the user.
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
} = require("../utils/errors");

// Authenticate user by email/password (POST /signin)
const signIn = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((userData) => {
      // authentication successfull, userData variable contains user
      // create and return user
      const token = jwt.sign({ _id: userData._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED_ERROR_CODE)
          .send({ message: "Incorrect email or password" });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE).send({
        message: "An error has occurred on the server",
      });
    });
};

// Create user (POST /signup)
const signUp = (req, res) => {
  const { name, email, avatar, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error(
          "The user with the provided email already exists",
        );
        error.statusCode = CONFLICT_ERROR_CODE;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, email, avatar, password: hash }))
    .then((userData) => {
      res.status(201).send({
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: err.message });
    });
};

// GET /users/me
const getMe = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Invalid user ID" });
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: err.message });
      }
    });
};

// PATCH /users/me
const patchMe = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }, // "then" will receive the updated data + data validation
  )
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((userData) => res.status(200).send(userData))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Invalid user ID" });
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: err.message });
      }
    });
};

module.exports = {
  signIn,
  signUp,
  getMe,
  patchMe,
};

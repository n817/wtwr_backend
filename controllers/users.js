const User = require("../models/user");

const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => {
      console.error(e);
      return res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: e });
    });
};

// GET /users/:id
const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      console.error(e);
      if (e.name === "CastError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Invalid user ID" });
      } else if (e.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: e.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: e.message });
      }
    });
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((e) => {
      console.error(e);
      if (e.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: e.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: e.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};

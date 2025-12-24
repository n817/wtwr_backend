const router = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");

router.get("/", getUsers); // get all users
router.get("/:userId", getUser); // get user by ID
router.post("/", createUser); // create user

module.exports = router;
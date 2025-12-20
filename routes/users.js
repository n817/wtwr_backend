const router = require("express").Router();

router.get("/", () => console.log("Get users")); // get all users
router.get("/:userId", () => console.log("Get user by ID")); // get user by ID
router.post("/", () => console.log("Create user")); // create user

module.exports = router;
const router = require("express").Router();
const { getMe, patchMe } = require("../controllers/users");

router.get("/me", getMe); // return current user data
router.patch("/me", patchMe); // patch current user data (name and avatar)

module.exports = router;
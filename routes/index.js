const router = require("express").Router();
const { signIn, signUp } = require("../controllers/users");
const clothingItemRouter = require("./clothingItems");

const auth = require("../middlewares/auth");
const userRouter = require("./users");

router.post("/signin", signIn); // authenticate user
router.post("/signup", signUp); // create user

router.use("/items", clothingItemRouter);

router.use(auth); // athorization middleware (all routes below will require authorization)
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});

module.exports = router;

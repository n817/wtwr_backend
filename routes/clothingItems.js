const router = require("express").Router();

const {
  getItems,
  createItem,
  deleteItem,
  addLike,
  removeLike,
} = require("../controllers/clothingItems");

const auth = require("../middlewares/auth");

router.get("/", getItems);


router.use(auth); // athorization middleware (all routes below will require authorization)
router.post("/", createItem);
router.delete("/:id", deleteItem);
router.put("/:id/likes", addLike);
router.delete("/:id/likes", removeLike);

module.exports = router;

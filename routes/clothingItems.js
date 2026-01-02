const router = require("express").Router();

const { getItems, createItem, deleteItem, addLike, removeLike } = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:id", deleteItem);
router.put("/:id/likes", addLike);
router.delete("/:id/likes", removeLike);

module.exports = router;

const ClothingItem = require("../models/clothingItem");

const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");

// GET /items (get clothing item)
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((e) => {
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error from getItems", e });
    });
};

// POST /items (create clothing item)
const createItem = (req, res) => {
  const owner = req.user._id;
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: e.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: e.message });
    });
};

// DELETE /items/:id (delete clothing item by ID)
const deleteItem = (req, res) => {
  const { id } = req.params;
  console.log(id);
  ClothingItem.findById(id)
    .orFail(() => {
      const error = new Error("Card ID not found");
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((item) => ClothingItem.deleteOne(item).then(() => res.send(item)))
    .catch((e) => {
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error from deleteItem", e });
    });
};

// Toggle like
const toggleLike = (req, res, method) => {
  const {
    params: { id },
  } = req;
  ClothingItem.findByIdAndUpdate(
    id,
    { [method]: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((item) => {
      res.send(item);
    })
    .catch((e) => {
      if (e.name === "CastError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Invalid item ID" });
      } else if (e.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: e.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "Error from toggleLike", e });
      }
    });
};

// PUT /items/:id/likes (like item)
const addLike = (req, res) => toggleLike(req, res, "$addToSet");

// DELETE /items/:id/likes
const removeLike = (req, res) => toggleLike(req, res, "$pull");

module.exports = {
  getItems,
  createItem,
  deleteItem,
  addLike,
  removeLike,
};

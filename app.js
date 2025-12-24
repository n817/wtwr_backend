const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");


const { PORT = 3001 } = process.env;

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the database.");
  })
  .catch(console.error);

app.use(express.json());

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Express is running on port ${PORT}...`);
});

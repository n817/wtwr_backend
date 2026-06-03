const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to the database.");
  })
  .catch(console.error);

app.use(express.json());

app.use(cors()); // enable the cors browser security mechanism

app.use("/", mainRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Express is running on port ${PORT}...`);
});

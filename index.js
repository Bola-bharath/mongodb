const express = require("express");
const mongoose = require("mongoose");
const Routes = require("./apicodes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/Userdata", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected Successfully");
});
app.use(Routes);
app.listen(3001, () => {
  console.log("server running");
});

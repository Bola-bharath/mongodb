const mongoose = require("mongoose");

const Schema = new mongoose.Schema({});

const Model = mongoose.model("samples", Schema);

module.exports = Model;

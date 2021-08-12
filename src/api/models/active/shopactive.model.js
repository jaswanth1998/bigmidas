//const mongoose = require("mongoose");
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const activeSchema = new Schema({
  vendorid: {
    type: String,
    required: true,
  },
  active: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  shopid: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("shopactive", activeSchema);

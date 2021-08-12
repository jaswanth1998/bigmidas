//const mongoose = require("mongoose");
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
  productid: {
    type: String,
    required: true,
  },
  customerid: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Wishlist", wishlistSchema);

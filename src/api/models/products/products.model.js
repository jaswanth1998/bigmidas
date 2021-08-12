//const mongoose = require("mongoose");
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  productname: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  prodctcost: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  discountedprodprice: {
    type: Number,
    required: true,
  },
  prodphoto: {
    type: Array,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  vendorid: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Product", vendorSchema);

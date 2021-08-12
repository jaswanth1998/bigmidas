const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartSchema = new Schema({
  quantity: {
    type: Number,
    required: true,
  },
  productid: {
    type: String,
    required: true,
    //unique: true,
  },
  delivery_charges:{
    type:Number,
    required:true,
  },
  free_delivery_above:{
    type:String,
    required:true,
  },
  shopid:{
    type:String,
    required: true,
  },
  shopname:{
    type:String,
    required:true, 
  },
  customerid: {
    type: String,
    required: true,
  },
  vendorid: {
    type: String,
    required: true,
  },
  delivery_type:{
    type: String
  }
});

module.exports = mongoose.model("Cart", cartSchema);

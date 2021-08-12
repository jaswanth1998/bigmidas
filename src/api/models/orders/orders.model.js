import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema({
  orederid: {
    type: String,
    required:false,
  },
  customerid: {
    type: String,
    required: true,
  },
  productid: {
    type: String,
    required: true,
  },
  productids:{
    type: String,
    required: true,
  },
  productname:{
    type: String,
    required: true,
  },
  productimage:{
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  vendorid: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  totalamount:{
    type: String,
  },
  order_note: {
    type: String,
    required: true,
  },
  delivery_charges: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("orders", orderSchema);

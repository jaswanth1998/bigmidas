import mongoose from "mongoose";
const { Schema } = mongoose;

const serviceorderSchema = new Schema({
  serviceid: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  location:{
    type: String,
    required: true
  },
  jobaddress:{
    type:String,
  },
  price:{
    type: String,
    required: true
  },
  bookinglocation: {
    type: String,
    required: false,
  },
  orederid: {
    type: Number,
    required: true,
  },
  customerid: {
    type: String,
    required: true,
  },
  vendorid: {
    type:String,
    required: true,

  },
  price: {
    type: Number,
    required: false,
  },
  bookingfrom: {
    type: String,
    required: false,
  },
  bookingto: {
    type: String,
    required: false,
  },
  status: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("serviceorders", serviceorderSchema);

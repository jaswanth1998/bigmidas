import mongoose from "mongoose";
const { Schema } = mongoose;

const vehicleorderSchema = new Schema({
  vehicleserviceid: {
    type: String,
    required: true,
  },
  orederid: {
    type: Number,
    required: true,
  },
  customerid: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  vendorid:{
    type: String,
    required: true,
  },
  bookingfrom: {
    type: String,
    required: true,
  },
  bookingto: {
    type: String,
    required: true,
  },
  from:{
    type: String,
  },
  to:{
    type: String,
  },
  date: {
    type:String,
    required: true,
  },
  time:{
    type: String,
    required:true, 
  },
  status: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("vehicleorders", vehicleorderSchema);

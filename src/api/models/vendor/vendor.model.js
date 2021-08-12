import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const { Schema } = mongoose;
const InvoiceSchema = new Schema({
  mail: {
    type: String,
    required: true,
    unique: true,
  },
  aboutus:{
    type:String,
    required:false,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
    unique: true,
  },
  createddate: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now,
  },
  km_charges: {
    type:Number
  },
  delivery_type: {
    type:String
  },
  delivery_charges: {
    type: Number,
  },
  delivery_pickup: {
    type: String,
  },
  free_delivery: {
    type: String,
  },
  store_km_serving: {
    type: Number,
  },
  vehicle_km_serving: {
    type: Number,
  },
  service_km_serving: {
    type: Number,
  },
  active_inactive: {
    type: String,
  },
  image: {
    type: String,
    default:"uploads/1624272025030.jpg",
  },
});
InvoiceSchema.pre("save", async function () {
  //if user is modified or user is new
  if (this.isModified("password") || this.isNew) {
    const salt = await bcryptjs.genSalt();
    const hash = await bcryptjs.hash(this.password, salt);
    this.password = hash;
  }
});
export default mongoose.model("vendor-details", InvoiceSchema);

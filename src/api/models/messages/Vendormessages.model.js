import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const { Schema } = mongoose;
const InvoiceSchema = new Schema({
  vendorid: {
    type: String,
  },
  message: {
    type: String
  },
  createddate: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now,
  },
});

export default mongoose.model("vendornotifications", InvoiceSchema);

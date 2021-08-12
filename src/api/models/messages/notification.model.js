import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const { Schema } = mongoose;
const InvoiceSchema = new Schema({
  firebase_token: {
    type: String,
    required: true,
  },
  device_id: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
  },

  createddate: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now,
  },
});

export default mongoose.model("notifications", InvoiceSchema);

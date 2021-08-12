import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const { Schema } = mongoose;
const InvoiceSchema1 = new Schema({
  token: {
    type: String,
    required: true,
  },
  id: {
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

export default mongoose.model("notificationtests", InvoiceSchema1);

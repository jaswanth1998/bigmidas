import mongoose from "mongoose";

const { Schema } = mongoose;
const InvoiceSchema = new Schema({
  customerid: {
    type: String,
    required: true,
  },
  issue: {
    type: String,
    required: true,
    unique: true,
  },
  createddate: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now,
  },
});

export default mongoose.model("customer-issue", InvoiceSchema);

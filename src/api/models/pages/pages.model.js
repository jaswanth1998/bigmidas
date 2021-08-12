import mongoose from "mongoose";

const { Schema } = mongoose;
const InvoiceSchema = new Schema({
  page_name: {
    type: String,
    required: true,
  },
  page_description: {
    type: String,
    required: true,
  },
});

export default mongoose.model("vendorpages", InvoiceSchema);

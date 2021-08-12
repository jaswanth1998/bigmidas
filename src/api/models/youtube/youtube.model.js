import mongoose from "mongoose";

const { Schema } = mongoose;
const InvoiceSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
  },
  display_option: {
    type: String,
    required: true,
  },
});

export default mongoose.model("youtube", InvoiceSchema);

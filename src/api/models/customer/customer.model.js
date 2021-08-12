import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const { Schema } = mongoose;
const InvoiceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
    unique: true,
  },

  phoneno: {
    type: Number,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createddate: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now,
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
export default mongoose.model("customer-details", InvoiceSchema);

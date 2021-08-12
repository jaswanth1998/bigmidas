import mongoose from "mongoose";

const { Schema } = mongoose;
const InvoiceSchema = new Schema({
  shop_name: {
    type: String,
    required: true,
    unique: true,
  },
  location_map: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type:String
  },
  area: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  sub_cat: {
    type: String,
    required: false,
  },
  pan_adhaar: {
    type: String,
    required: true,
  },
  trade_licence: {
    type: String,
    required: true,
  },
  fssai_licence: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
  active: {
    type: String,
    required:true
  },
  vendorid: {
    type: String,
    required: false,
  },
  createddate: {
    type: Date,
    default: Date.now,
  },
  // subscription: {
  //   type: String,
  //   required: true,
  // },
});

export default mongoose.model("shop-details", InvoiceSchema);

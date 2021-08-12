import mongoose from "mongoose";

const { Schema } = mongoose;
const InvoiceSchema = new Schema({
  service_category: {
    type: String,
    required: true,
  },

  service_price:{
    type:Number,
    required:true
  },
  location_map: {
    type: String,
    required: true,
  },
  state: {
    type:String
  },
  city: {
    type: String,
    required: true,
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
  pan_adhaar: {
    type: String,
    //required: true,
  },
  images:{
    type:Array,
    required: true
  },
  active:{
    type:String,
  },
  vendorid: {
    type: String,
    required: true,
  },
  createddate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("service-details", InvoiceSchema);

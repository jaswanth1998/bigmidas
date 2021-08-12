import mongoose from "mongoose";

const { Schema } = mongoose;
const addressSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  customerid: {
    type: String,
    required: true,
  },
  phoneno: {
    type: Number,
    required: true,
  },
  houseno: {
    type: String,
    // required: true,
  },
  landmark: {
    type: String,
    // required: true,
  },
  address: {
    type: String,
    // required: true,
  },
  addresstype: {
    type: String,
    required: true,
  }
  // positions:{
  //   type:String,
  // }
  // country: {
  //   type: String,
  //   required: true,
  // },
  // state: {
  //   type: String,
  //   required: true,
  // },
});

export default mongoose.model("customer-address", addressSchema);

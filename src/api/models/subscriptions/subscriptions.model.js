import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const { Schema } = mongoose;
const InvoiceSchema = new Schema({
  plan_id: {
    type: String,
    required: true,
  }, 
  vendor_id: {
    type: String, 
    required: true,
  },
  payment_status: {
    type: String, 
    required: true,
  },
  shop_id:{
    type:String,
    required:false,
  },
  createdat: {
    type: Date,
    default: Date.now
  },

});

export default mongoose.model('subscribed-venodrs', InvoiceSchema);

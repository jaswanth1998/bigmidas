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
  service_id: {
    type: String, 
    required: false,
  },
  payment_status: {
    type: String, 
    required: true,
  },
  createdat: {
    type: Date,
    default: Date.now
  },

});

export default mongoose.model('subscribed-service-venodrs', InvoiceSchema);

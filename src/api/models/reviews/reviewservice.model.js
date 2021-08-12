import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const { Schema } = mongoose;
const InvoiceSchema = new Schema({
  service_id: {
    type: String,
    required: true,
  }, 
  review: {
    type: String, 
    required: true,
  },
  customer_id: {
    type: String, 
    required: true,
  },
  createdat: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number, 
    required: true,
  },
});

export default mongoose.model('service-reviews', InvoiceSchema);

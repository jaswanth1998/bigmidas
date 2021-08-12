import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const { Schema } = mongoose;
const InvoiceSchema = new Schema({
  days: {
    type: Number,
    required: true,
  }, 
  cost: {
    type: Number, 
    required: true,
  },


});

export default mongoose.model('subscriptions', InvoiceSchema);

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const { Schema } = mongoose;
const InvoiceSchema = new Schema({
  sub_cat_name: {
    type: String,
    required: true,
   
  }, 
  cat_id: {
    type: String,
  },
  createddate: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now
  }
});

export default mongoose.model('shoplisting-sub-cat', InvoiceSchema);

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
    required: true,
  },
});

export default mongoose.model('vehiclelisting-sub-cat', InvoiceSchema);

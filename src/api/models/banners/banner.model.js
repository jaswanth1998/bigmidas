import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const { Schema } = mongoose;
const InvoiceSchema = new Schema({
  banner_content: {
    type: String,
    required: true,
  },
  banner_type: {
    type: String,
    required: true,
  }, 
  banner_image: {
    type: String,
    required: true,
  }, 
});

export default mongoose.model('home-banners', InvoiceSchema);

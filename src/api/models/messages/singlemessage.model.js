import mongoose from 'mongoose';
import bycryptjs from 'bcryptjs'

const { Schema } = mongoose;
const singleMessageSchema = new Schema ( {
    cust_id: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    }
});

export default mongoose.model('customer-single-message', singleMessageSchema)
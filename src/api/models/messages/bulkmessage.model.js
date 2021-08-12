import mongoose from 'mongoose';
import bycryptjs from 'bcryptjs'

const { Schema } = mongoose;
const bulkMessageSchema = new Schema ( {
   message: {
        type: String,
        required: true
    },
    cust_id: {
        type: String,
    },
    name: {
        type:String,
    },
    type: {
        type: String,
    }
});

export default mongoose.model('customer-bulk-message', bulkMessageSchema)
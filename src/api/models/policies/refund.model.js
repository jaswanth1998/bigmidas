import mongoose from"mongoose";

const Schema = mongoose.Schema;

const refund = new Schema({
    data: {
        type:String,
        required: true
    }
});

module.exports = mongoose.model("refunds",refund)
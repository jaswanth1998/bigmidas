import mongoose from "mongoose";

const Schema = mongoose.Schema;

const policySchema = new Schema({

    data:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("policy",policySchema);



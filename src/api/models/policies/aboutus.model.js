import mongoose from "mongoose";

const Schema = mongoose.Schema;

const aboutusSchema = new Schema({
    data:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("aboutus",aboutusSchema);
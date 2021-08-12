import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tandcSchema = new Schema({
    data:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("termsandcontions",tandcSchema);
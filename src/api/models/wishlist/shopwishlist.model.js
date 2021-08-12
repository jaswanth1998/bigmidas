import mongoose from "mongoose";

const Schema = mongoose.Schema;

const shopwishlistschema =new  Schema({
    vendorid:{
        type:String,
        required: true
    },
    customerid:{
        type:String,
        required:true
    },
    shopid:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("shopwishlist", shopwishlistschema)

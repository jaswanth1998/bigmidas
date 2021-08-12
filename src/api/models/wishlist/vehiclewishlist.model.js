import mongoose from "mongoose";

const Schema = mongoose.Schema;

const VehicleWishlist = new Schema({
    customerid:{
        type:String,
        required:true
    }, 
    vehicleid: {
        type:String,
        required:true
    }, vendorid:{
        type:String,
        required:true
    }

});

module.exports = mongoose.model("vehiclewishlist", VehicleWishlist);
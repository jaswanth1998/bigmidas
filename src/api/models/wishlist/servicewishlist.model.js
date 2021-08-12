import mongoose from "mongoose";

const Schema = mongoose.Schema;


const ServiceWishlist = new Schema({
    customerid:{
        type: String,
        required:true
    }, 
    serviceid:{
        type:String,
        required:true
    }, 
    vendorid: {
        type:String,
        required: true
    }
});

export default mongoose.model("servicewishlist", ServiceWishlist)


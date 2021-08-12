import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const { Schema } = mongoose;
const InvoiceSchema = new Schema({
  vechicle_catgory: {
    type: String,
    required: true,
  }, 
  vechicle_type: {
    type: String,
    required: true,
  },
  vechicle_price: {
    type: Number,
    required: true
  },
  vehiclenumber:{
    type:String
  },
  city: {
    type: String, 
    required: true,
  },
  area: {
    type: String, 
    required: true,
  },
  address: {
    type: String, 
    required: true,
  },
  active:{
    type:String,
  },
  category: {
    type: String, 
    required: true,
  },
  pan_adhaar: {
    type: String, 
    required: true,
  },
  driving_license: {
    type: String, 
    required: true,
  },
  state: {
    type:String
  },
  insurance:{
    type:String,
    required:true,
  },
  rc: {
    type: String, 
    required: true,
  },
  fc: {
    type: String, 
//required: true,
  },
  current_location:{
    type:String,
  },
  // photo: {
  //   type: String, 
  //   required: true,
  // },
  vendorid: {
    type: String, 
    required: true,
  },
  images:{
    type:Array,
    required: true
  },
  seq: { type: Number, default: 0 },
  createddate: {
    type: Date,
    default: Date.now
  }
});
var counter = mongoose.model('Vechicle-details', InvoiceSchema);

var entitySchema = mongoose.Schema({
  testvalue: {type: String}
});

entitySchema.pre('save', function(next) {
  var doc = this;
  counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, function(error, counter)   {
      if(error)
          return next(error);
      doc.testvalue = counter.seq;
      next();
  });
});
export default  mongoose.model('Vechicle-details', InvoiceSchema);

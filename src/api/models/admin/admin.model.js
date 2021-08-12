import mongoose from "mongoose";
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");
const dataSchema = new Schema({
  adminname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  adminemail: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 50,
    unique: true,
  },
  adminpassword: {
    type: String,
    minlength: 5,
    maxlength: 100,
  },
  userType: {
    type: String,
  
  },
});

dataSchema.methods.generateHash = (adminpassword) => {
  return bcrypt.hashSync(adminpassword, bcrypt.genSaltSync(8), null);
};

module.exports = mongoose.model("Admin", dataSchema);

import Joi from "joi";
import HttpStatus from "http-status-codes";
import Customer from "../../models/customer/customer.model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { devConfig } from "../../../config/env/development";
import bcrypt from "bcrypt-nodejs";

export default {
  async signup(req, res) {
    //Validate the Request

    const schema = new Customer({
      name: req.body.name,
      mail: req.body.mail,
     // customerpic: req.file.path,
      phoneno: req.body.phoneno,
      password: req.body.password,
    });


    
    Customer.find({ phoneno: req.body.phoneno }, function (err, user) {
      if (user.length != 0) {
        console.log("User already exists");
        return res.json({ message: "Phone Number exists " });
      } else {
        Customer.create(schema)
          .then((Users) => res.json(Users))
          .catch((err) => res.status(500).json(err));
      }
    });
  },
  async login(req, res) {
    let user = await Customer.findOne({
      phoneno: req.body.phoneno,
    }).exec();
    if (!user) {
      res.send({ msg: "You are not registered" });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      res.send({ msg: "Login Fail" });
    }
    const token = jwt.sign({ id: user._id }, devConfig.secret, {
      expiresIn: "1d",
    });
    return res.json({ success: true, token,  _id: user._id });
  },

  // async loginbyemail(req, res) {
  //   let user = await Customer.findOne({
  //     mail: req.body.,
  //   }).exec();
  //   if (!user) {
  //     res.send({ msg: "You are not registered" });
  //   }
  //   if (!bcrypt.compareSync(req.body.password, user.password)) {
  //     res.send({ msg: "Login Fail" });
  //   }
  //   const token = jwt.sign({ id: user._id }, devConfig.secret, {
  //     expiresIn: "1d",
  //   });
  //   return res.json({ success: true, token,  _id: user._id });
  // },


  async changepassword(req, res){
    const salt = await bcryptjs.genSalt();
    const hash = await bcryptjs.hash(req.body.password, salt);
    let newpassword= hash
    Customer.findOneAndUpdate(
      {phoneno: req.body.phone},
      {
        password: newpassword
      }
    ).then(()=>{
      res.send({data: "modified"});
    }).catch((err)=>{
      res.send({data:"err",err})
    })
  },

  async changepasswordemail(req, res){
    const salt = await bcryptjs.genSalt();
    const hash = await bcryptjs.hash(req.body.password, salt);
    let newpassword= hash
    Customer.findOneAndUpdate(
      {mail: req.body.email},
      {
        password: newpassword
      }
    ).then(()=>{
      res.send({data: "modified"});
    }).catch((err)=>{
      res.send({data:"err",err})
    })
  },




  // async forgotpassword(req, res){
  //   const salt = await bcryptjs.genSalt();
  //   const hash = await bcryptjs.hash(req.body.password, salt);
  //   let newpassword= hash
  //   Customer.findOneAndUpdate(
  //     {phoneno: req.body.phone},
  //     {
  //       password: newpassword
  //     }
  //   ).then(()=>{
  //     res.send({data: "modified"});
  //   }).catch((err)=>{
  //     res.send({data:"err",err})
  //   })


  // },


  async loginbyemail(req, res) {
    let user = await Customer.findOne({
      mail: req.body.email,
    }).exec();
    if (!user) {
      res.send({ msg: "You are not registered" });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      res.send({ msg: "Login Fail" });
    }
    const token = jwt.sign({ id: user._id }, devConfig.secret, {
      expiresIn: "1d",
    });
    return res.json({ success: true, token,  _id: user._id });
  },

  // async googlelogin(req,res){


  // }


  async editcustomer(req, res) {
    let { id } = req.params;
    Customer.findByIdAndUpdate(
      { _id: id },
      {
        name: req.body.name,
        mail: req.body.mail,
        phoneno: req.body.phoneno,
        //customerpic: req.file.path,
      },
      { new: true }
    )
      .then(() => {
        res.send({ msg: "Updated Successfully" });
      })
      .catch((err) => {
        res.send({ msg: "Update Failed" });
      });
  },

  async getallcustomers(req, res) {
    var s = req.protocol + "://" + req.get("host");
    Customer.aggregate([
      {
        $project: {
          name:"$name",
          mail:"$mail",
          customerpic:"$customerpic",
          phoneno:"$phoneno",
          },
      }
    ])
      .then((result) => {
        result.reverse();
        res.send(result);
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },

  async getcustbyid(req, res) {
    var s = req.protocol + '://' + req.get('host') ;
    let { id } = req.params;
    Customer.aggregate([
      {
        $addFields: {
          conver: { $toString : "$_id" },
          photo: {
            $concat: [s,'/',"$customerpic"],
          },
        },
      },
      {
        $match: { conver: { $eq: id } },
      },
      {
        $project:{
          name:'$name',
          mail:"$mail",
          customerpic:"$photo",
          phoneno:"$phoneno",
          
        }
      }
    
    ])
      .then((result) => {
        res.send({ products: result });
      })
      .catch((err) => {
        res.send({ msg: "User Not Found" });
      });
  },

  async deleteCustomer(req,res){
    let { id } = req.params;
    Customer.findByIdAndRemove(id)
    .then(client =>{
       if(!client){
           return res.status(HttpStatus.NOT_FOUND).json({err:'Could not delete any Invoice '});
       }
       return res.json(client);
    })
    .catch(err=> res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    
  }


};

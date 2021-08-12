import Customer from "../../models/customer/customer.model";
import Vendor from "../../models/vendor/vendor.model";
import bulkMessage from "../../models/messages/notification.model";
import customernotification from "../../models/messages/customernotification";
import SaveMessage from "../../models/messages/bulkmessage.model";
import Vendordetails from"../../models/vendor/vendor.model";
import Customerdetails from "../../models/customer/customer.model";
import Vendornotifications from "../../models/messages/Vendormessages.model";
import Customernotifications from "../../models/messages/Customermessages.model";
import { request } from "express";
// const https = require('https');
const axios = require("axios");

var ObjectId = require("mongoose").Types.ObjectId;

// function addmessages(vendid,msg){

//   const notification = new Vendornotifications({
//     vendorid: vendid,
//     message: msg,
//   });
//   Vendornotifications.create(notification)
//   .then((res) => { console.log(res)})
//   .catch((err) =>{ console.log(err)});
// }

export default {
  // sending to specific customers 
  async notification(req,res){
    //Validate the Request 
    console.log(req.body)
  
    let schema =new bulkMessage({
        firebase_token: req.body.firebase_token,
        device_id: req.body.device_id,
        uid:req.body.uid,
    })
        bulkMessage.create(schema)
            .then(Users=> res.json(Users)) 
            .catch(err=>res.status(500).json(err));    
    },

  async usernotification(req,res){
      //Validate the Request 
    
      let schema =new customernotification({
          firebase_token: req.body.firebase_token,
          device_id: req.body.device_id,
          uid:req.body.uid,
      })
          // if(req.file){
          //   schema.avatar = req.file.path;
          // }
          customernotification.create(schema)
              .then(Users=> res.json(Users)) 
              .catch(err=>{console.log(err); res.status(500).json(err)});    
      },

  async deletenotification(req,res){
    let { id } = req.params;
    bulkMessage.findByIdAndRemove(id)
    .then(client =>{
       if(!client){
           return res.status(HttpStatus.NOT_FOUND).json({err:'Could not delete any Invoice '});
       }
       return res.json(client);
    })
    .catch(err=> res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    
  },

  async addmessages(req,res){
    let {id} = req.params;
    Vendornotifications.find({vendorid:id}).then((result)=>{
      console.log(result);
      res.send({result});
    });
  },

  async addcustmessages(req,res){
    let {id} = req.params;
    Customernotifications.find({custid:id}).then((result)=>{
      console.log(result);
      res.send({result});
    });
  },


  async sendnotification(req, res){
    let requid = req.body.cust;
    let msg = req.body.message;
    let tok = req.body.token;
    console.log(req.body);
    console.log(requid);
    console.log(msg);
    bulkMessage.find({ uid: requid}, function (err, docs) {
      if (err){
          console.log(err);
      }
      else{
        // console.log(docs);
        try{  
          console.log("this is length ",docs.length)
        console.log("Second function call : ", docs[0].firebase_token);
          axios({
                method: 'post',
                headers:{
                  "Content-Type":"application/json",
                  // "Authorization":"key=AAAAxIkn9nY:APA91bHo0OdhbBNNCy8_GN7DsUwGpGFNiu2B0hzIVWKa5G2UJxiJQRiG7FX0VR8JBDYT0ydbmBYWhWx9JuGjPURvcQlzItXhVf-coJ5F3mwLXKq8sWOFRTnvI1Xm3xE_GxD97tFiEXX4",
                  "Authorization":"key=AAAAZAr6u2A:APA91bFv992Wos4HwN0-dyQlMPSHDOJ7BnAeFRfsFLS8FjDs8gwy7Om-cx6ZG9dgG1sI09cqo4ATQlG5lhXXdInxkZLB6zp1dtJeSCv8aNT1BZoBn6CHQQ--Qsh8i4zLXOIAlEwlfyMU",
                },
                url: 'https://fcm.googleapis.com/fcm/send',
                data: {
                        "to" : docs[0].firebase_token,
                        "notification" : {
                            "body" : msg,
                            "title": "Big Midas"
                        },
                        "data": {
                          "click_action": "FLUTTER_NOTIFICATION_CLICK",
                          "sound": "default", 
                          "status": "done",
                          "screen": "/vehicleHistory"
                        },
                      }
              }).then(response =>{
                if(tok != "1"){
                Vendordetails.find({_id:requid}).then((result)=>{
                  console.log(result[0].name);
                  const schema2 = new SaveMessage({
                    cust_id: requid,
                    type: "vendor",
                    message: msg,
                    name: result[0].name
                  });
                  SaveMessage.create(schema2)
                  .then((response)=>{
                    console.log(response);
                  })
                  .catch((err) => {
                    console.log("Adding sent notifications to db failed ",err);
                  });
                });
              }
                console.log(response.data);
                res.send(response.data)
              })
              .catch((err) => {
                res.send({ msg: "Invalid vendorid" });
              });
            } catch(er){
              console.log(er);
              res.send({msg: "Vendor Id not found",er})
            }
        
      }
  });
    
  },

  async sendnotificationtoall(req, res){
    let { msg } = req.params;
    bulkMessage.find({ }, function (err, docs)  {
      if (err){
          console.log(err);
      }
      else{
        console.log("this is docs ",docs);
        try{  
        console.log("Second function call : ", docs[0].firebase_token);
        for (let i=0;i<docs.length;i++){
          console.log("this is uid",docs[i].uid);
          axios({
                method: 'POST',
                headers:{
                  "Content-Type":"application/json",
                  // "Authorization":"key=AAAAxIkn9nY:APA91bHo0OdhbBNNCy8_GN7DsUwGpGFNiu2B0hzIVWKa5G2UJxiJQRiG7FX0VR8JBDYT0ydbmBYWhWx9JuGjPURvcQlzItXhVf-coJ5F3mwLXKq8sWOFRTnvI1Xm3xE_GxD97tFiEXX4",
                  "Authorization":"key=AAAAZAr6u2A:APA91bFv992Wos4HwN0-dyQlMPSHDOJ7BnAeFRfsFLS8FjDs8gwy7Om-cx6ZG9dgG1sI09cqo4ATQlG5lhXXdInxkZLB6zp1dtJeSCv8aNT1BZoBn6CHQQ--Qsh8i4zLXOIAlEwlfyMU",
                },
                url: 'https://fcm.googleapis.com/fcm/send',
                data: {
                        "to" : docs[i].firebase_token,
                        "notification" : {
                            "body" : msg,
                            "title": "Big Midas"
                        },
                      }
              }).then(response =>{
                console.log("this is response data",response.data);
                if(i<1){
                const schema2 = new SaveMessage({
                  cust_id: "",
                  name:"All",
                  type: "vendor",
                  message: msg,
                });
                SaveMessage.create(schema2)
                .then((response)=>{
                  console.log("this is response",response);
                })
                .catch((err) => {
                  console.log("Adding sent notifications to db failed ");
                });
                }
                res.send({status:"done"})
              })
              .catch((err) => {
                // res.send({ msg: "Invalid vendorid" });
                console.log("Invalid VendorId",err);
              });
            }
            } catch(er){
              console.log(er);
              res.send({msg: "Vendor Id not found"})
            }
        
      }
  });
},


async sendnotificationtocustomer(req, res){
  let requid = req.body.cust;
  let msg = req.body.message;

  console.log("requid",requid);
  console.log(msg);
  customernotification.find({ uid: requid}, function (err, docs) {
    if (err){
        console.log(err);
    }
    else{
      try{  
      console.log("Second function call : ", docs[0].firebase_token);
        axios({
              method: 'post',
              headers:{
                "Content-Type":"application/json",
                "Authorization":"key=AAAAxIkn9nY:APA91bHo0OdhbBNNCy8_GN7DsUwGpGFNiu2B0hzIVWKa5G2UJxiJQRiG7FX0VR8JBDYT0ydbmBYWhWx9JuGjPURvcQlzItXhVf-coJ5F3mwLXKq8sWOFRTnvI1Xm3xE_GxD97tFiEXX4",
                // "Authorization":"key=AAAAZAr6u2A:APA91bFv992Wos4HwN0-dyQlMPSHDOJ7BnAeFRfsFLS8FjDs8gwy7Om-cx6ZG9dgG1sI09cqo4ATQlG5lhXXdInxkZLB6zp1dtJeSCv8aNT1BZoBn6CHQQ--Qsh8i4zLXOIAlEwlfyMU",

              },
              url: 'https://fcm.googleapis.com/fcm/send',
              data: {
                      "to" : docs[0].firebase_token,
                      "notification" : {
                          "body" : msg,
                          "title": "Big Midas"
                      },
                    }
            }).then(response =>{
              console.log(result);
              Customerdetails.find({_id:requid}).then((result)=>{
                console.log(result);
                const schema2 = new SaveMessage({
                  cust_id: requid,
                  type: "customer",
                  message: msg,
                  name: result[0].name
                });
                SaveMessage.create(schema2)
                .then((response)=>{
                  console.log(response);
                })
                .catch((err) => {
                  console.log("Adding sent notifications to db failed ");
                });
              });
              console.log(response.data);
              res.send(response.data)
            })
            .catch((err) => {
              res.send({ msg: "Invalid customerid"+err });
            });
          } catch(er){
            console.log(er);
            res.send({msg: "Customer Id not found",er})
          }
      
    }
});
  
},


async sendnotificationtoallcustomers(req, res){
  let { msg } = req.params;

  customernotification.find({ }, function (err, docs) {
    if (err){
        console.log(err);
    }
    else{
      console.log(docs);
      try{  
      console.log("Second function call : ", docs[0].firebase_token);
      for (let i=0;i<docs.length;i++){
        console.log(docs[i].uid);
        axios({
              method: 'post',
              headers:{
                "Content-Type":"application/json",
                // "Authorization":"key=AAAAxIkn9nY:APA91bHo0OdhbBNNCy8_GN7DsUwGpGFNiu2B0hzIVWKa5G2UJxiJQRiG7FX0VR8JBDYT0ydbmBYWhWx9JuGjPURvcQlzItXhVf-coJ5F3mwLXKq8sWOFRTnvI1Xm3xE_GxD97tFiEXX4",
                "Authorization":"key=AAAAZAr6u2A:APA91bFv992Wos4HwN0-dyQlMPSHDOJ7BnAeFRfsFLS8FjDs8gwy7Om-cx6ZG9dgG1sI09cqo4ATQlG5lhXXdInxkZLB6zp1dtJeSCv8aNT1BZoBn6CHQQ--Qsh8i4zLXOIAlEwlfyMU",
              },
              url: 'https://fcm.googleapis.com/fcm/send',
              data: {
                      "to" : docs[i].firebase_token,
                      "notification" : {
                          "body" : msg,
                          "title": "Big Midas"
                      },
                    }
            }).then(response =>{
              if(i<1){
              const schema2 = new SaveMessage({
                cust_id: "",
                name:"All",
                type: "customer",
                message: msg,
              });
              SaveMessage.create(schema2)
              .then((response)=>{
                console.log(response);
              })
              .catch((err) => {
                console.log("Adding sent notifications to db failed ");
              });
            }
              console.log(response.data);
              res.send({status:"done"})
            })
            .catch((err) => {
              // res.send({ msg: "Invalid vendorid" });
              console.log("Invalid CustomerId");
            });
          }
          console.log("done")
          } catch(er){
            console.log(er);
            res.send({msg: "Customer Id not found"})
          }
      
    }
});
},




};

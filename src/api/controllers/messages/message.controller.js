import Customer from "../../models/customer/customer.model";
import Vendor from "../../models/vendor/vendor.model";

import bulkMessage from "../../models/messages/bulkmessage.model";
// const https = require('https');
const axios = require("axios");

var ObjectId = require("mongoose").Types.ObjectId;

export default {
  // sending to specific customers
  async sendtoSpecificVend(req, res) {
    var s = req.protocol + "://" + req.get("host");
    const schema2 = new bulkMessage({
      cust_id: req.body.cust,
      type: "vendor",
      message: req.body.message,
    });

    Vendor.findOne({ _id: ObjectId(req.body.cust) }).then((result) => {
      // console.log(result.phoneno)
      // let apilink2 = "http://sms.smsinsta.in/vb/apikey.php?apikey=36116418143121313336&senderid=SMSINS&route=3&number=" + result.phoneno + "&message=" + req.body.msg;
      // axios.get(apilink2)
      // .then(response => {
      // console.log(response);
      // //   console.log(response.data.explanation);
      // })
      // .catch(error => {
      // console.log(error);
      // });
      // res.send(result);
    });
    bulkMessage.create(schema2).catch((err) => {
      console.log(err);
      res.send({ msg: "sending failed" });
    });
  },
  async sendtoAllVend(req, res) {
    var s = req.protocol + "://" + req.get("host");
    console.log(s);
    const schema1 = new bulkMessage({
      type: "vendor",
      message: req.body.message,
    });
    Vendor.find({}, { phoneno: 1 }).then((result) => {
      // for(let i = 0;i < result.length; i++){
      //    console.log(i)
      // sendapicall((result[0]).phoneno, body)
      // let apilink = "http://sms.smsinsta.in/vb/apikey.php?apikey=36116418143121313336&senderid=SMSINS&route=3&number=" + (result[i]).phoneno + "&message=" + encodeURIComponent(body);
      // axios.get(apilink)
      // .then(response => {
      // console.log(response);
      // //   console.log(response.data.explanation);
      // })
      // .catch(error => {
      // console.log(error);
      // });
      // }
    });
    bulkMessage
      .create(schema1)
      .then((Users) => res.json(Users))
      .catch((err) => res.status(500).json(err));
  },
  // sending to specific customers
  async sendtoSpecific(req, res) {
    const schema2 = new bulkMessage({
      cust_id: req.body.cust,
      type: "customer",
      message: req.body.message,
    });
    console.log(req.body);
    Customer.findOne({ _id: ObjectId(req.body.cust) })
      .then((result) => {
        // console.log(result.phoneno)
        // let apilink2 = "http://sms.smsinsta.in/vb/apikey.php?apikey=36116418143121313336&senderid=SMSINS&route=3&number=" + result.phoneno + "&message=" + req.body.msg;
        // axios.get(apilink2)
        // .then(response => {
        // console.log(response);
        // //   console.log(response.data.explanation);
        // })
        // .catch(error => {
        // console.log(error);
        // });
        // res.send(result);
        bulkMessage.create(schema2);
      })
      .catch((err) => {
        console.log(err);
        res.send({ msg: "sending failed" });
      });
  },

  // sending to all customers
  async sendtoAll(req, res) {
    var s = req.protocol + "://" + req.get("host");
    // console.log(s);
    const schema1 = new bulkMessage({
      type: "customer",
      message: req.body.message,
    });

    //var body = req.body.msg;
    //   console.log(body)
    //console.log(s)
    Customer.find({}, { phoneno: 1 })
      .then((result) => {
        // for(let i = 0;i < result.length; i++){
        //                 console.log(i)
        //                 // sendapicall((result[0]).phoneno, body)
        //                 let apilink = "http://sms.smsinsta.in/vb/apikey.php?apikey=36116418143121313336&senderid=SMSINS&route=3&number=" + (result[i]).phoneno + "&message=" + encodeURIComponent(body);
        //                 axios.get(apilink)
        //                 .then(response => {
        //                 console.log(response);
        //                 //   console.log(response.data.explanation);
        //                 })
        //                 .catch(error => {
        //                 console.log(error);
        //                 });
        // }
        // res.send(result);
        bulkMessage.create(schema1);
      })
      .catch((err) => {
        console.log(err);
        res.send({ msg: "sending failed" });
      });
  },

  async allNotifications(req, res) {
    // bulkMessage.aggregate([
    //     {
    //       $project: {
    //         type: "$type",
    //         message: "$message",
    //         id: "$cust_id",
    //       },
    //     },
    //   ])
    bulkMessage.find({})
      .sort({ _id: -1})
      .then((result) => {
        res.send({ result });
      })
      .catch((err) => {
        res.send(err);
      });
  },
};

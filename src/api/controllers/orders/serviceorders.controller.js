import ServiceOrders from "../../models/orders/serviceorders.model";
import bulkMessage from "../../models/messages/notification.model";
const axios = require("axios");
import customernotification from "../../models/messages/customernotification";
import Vendornotifications from "../../models/messages/Vendormessages.model";
// import Vendornotifications from "../../models/messages/Vendormessages.model";
import Customernotifications from "../../models/messages/Customermessages.model";


function sendnotificationonbooking(vendid) {

  console.log(vendid);
  bulkMessage.find({ uid: vendid}, function (err, docs) {
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
                "Authorization":"key=AAAAZAr6u2A:APA91bFv992Wos4HwN0-dyQlMPSHDOJ7BnAeFRfsFLS8FjDs8gwy7Om-cx6ZG9dgG1sI09cqo4ATQlG5lhXXdInxkZLB6zp1dtJeSCv8aNT1BZoBn6CHQQ--Qsh8i4zLXOIAlEwlfyMU",
              },
              url: 'https://fcm.googleapis.com/fcm/send',
              data: {
                      "to" : docs[0].firebase_token,
                      "notification" : {
                          "body" : "You have a new job booking",
                          "title": "Big Midas"
                      },
                    }
            }).then(response =>{
              addmessages(vendid,"You have a new job booking");
              console.log(response);
            });  
    }
    catch(err){
      console.log(err);
    }
  }
});

// function addmessages(vendid,msg){

//   const notification = new Vendornotifications({
//     vendorid: vendid,
//     message: msg,
//   });
//   Vendornotifications.create(notification)
//   .then((res) => { console.log(res)})
//   .catch((err) =>{ console.log(err)});
// }
  
}

function addmessages(vendid,msg){

  const notification = new Vendornotifications({
    vendorid: vendid,
    message: msg,
  });
  Vendornotifications.create(notification)
  .then((res) => { console.log(res)})
  .catch((err) =>{ console.log(err)});
}

function addcustmessages(vendid,msg){

  const notification = new Customernotifications({
    custid: vendid,
    message: msg,
  });
  Customernotifications.create(notification)
  .then((res) => { console.log(res)})
  .catch((err) =>{ console.log(err)});
}


function sendnotificationtocustomer(requid,msg){
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
              addcustmessages(requid,msg)
              console.log(result);
              // res.send(response.data)
            })
            .catch((err) => {
              // res.send({ msg: "Invalid customerid" });
            });
          } catch(er){
            console.log(er);
            // res.send({msg: "Customer Id not found",er})
          }
      
    }
});
  
}



export default {

  
  async createorder(req, res) {
    const serviceorder = new ServiceOrders({
      //  orderid: req.body.orderid,
      // orderid: getNextSequenceValue("orderid"),
      serviceid: req.body.serviceid,
      customerid: req.body.customerid,
      title: req.body.title,
      date: req.body.date,
      time: req.body.time,
      description: req.body.description,
      location: req.body.location,
      jobaddress: req.body.jobaddress,
      price: req.body.price,
      vendorid: req.body.vendorid,
      // bookinglocation: req.body.bookinglocation,
      // bookingfrom: req.body.bookingfrom,
      // bookingto: req.body.bookingto,
      // distance: req.body.distance,
      status: req.body.status,
      orederid: 1000,
    });
    ServiceOrders.find({})
      .sort({ _id: -1 })
      .limit(1)
      .then((products) => {
        // Notification.sendnotification("")
        sendnotificationonbooking(req.body.vendorid);
        console.log(products)
          serviceorder.orederid = products[0].orederid + 1;
          ServiceOrders.create(serviceorder)
            .then((Users) => res.json(Users))
            .catch((err) => res.status(500).json(err));
      });
  },


  async orderbycustomer(req, res) {
    let { customerid } = req.params;

    ServiceOrders.aggregate([
      {
        
        $match: { customerid: { $eq: customerid } },
      },
      {
        $addFields: {
          vend_id: { $toObjectId: "$vendorid" },
        },
      },
      {
        $lookup: {
          from: "vendor-details",
          localField: "vend_id",
          foreignField: "_id",
          as: "get_vendor",
        },
      },
      {
        $project: {
          price: "$price",
          date: "$date",
          time: "$time",
          description: "$description",
          location: "$location",
          jobaddress:"$jobaddress",
          title: "$title",
          vendorphone:"$get_vendor.phonenumber",
          status:"$status",
          // bookingfrom: "$bookingfrom",
          // bookingto: "$bookingto",
          // distance: "$distance",
          orederid: "$orederid",
          ordertime: "$createdAt",
        },
      },
    ]).then((result) => {
      console.log(result);
        res.send({ products: result });
      })
      .catch((err) => {
        res.send({ msg: "Invalid vendorid" });
      });
  },

  async updatestatus(req,res){
    let vend = req.body.orderid;
    let stat = req.body.stat;
    let custid = req.body.cust;
    let msg = req.body.message;
    ServiceOrders.aggregate([
    {
      $addFields:{
       convertedId: {$toObject: vend}
      }
    }
  ]);
    ServiceOrders.updateOne({_id: vend}, 
      {status: stat}
      ).then((result)=>{
        sendnotificationtocustomer(custid,msg);
        console.log(result);
      }).catch((err) => {
        console.log(err);
      });
  },

  async Serviceorderbyid1(req,res){
    let { vendorid } = req.params;
    let splitted = vendorid.split("&&");
    let vend = splitted[0];
    // let vend = "60b48f8ce0b64515be20efd3"
    let stat = splitted[1];
    if(stat == "0" || stat == undefined ){
    ServiceOrders.aggregate([
      {
        $addFields: {
          getvendorid: { $toString: vend },
        },
      },
      {
        $match: {
          $expr: {
              $and: [{ $eq: ["$vendorid", "$getvendorid"] },
            ],
          },
        },
      },
      {
        $project: {
          title: "$title",
          description: "$description",
          customerid: "$customerid",
          status: "$status",
          date: "$date",
          time: "$time",
          location: "$location",
          jobaddress:"$jobaddress",
          price: "$price",
          orderid: "$orederid",
        },
      },
      {
        $addFields: {
          // convertedId1: { $toObjectId: "$productid" },
          cus_id: { $toObjectId: "$customerid" },
          // note: {$toString: "$ordernote"},
          // addr: {$toString: "$address"},
        },
      },
      {
        $lookup: {
          from: "customer-details",
          localField: "cus_id",
          foreignField: "_id",
          as: "get_customer_details",
        },
      },
      {
        $project: {
          customername: "$get_customer_details.name",
          customerid: "$get_customer_details._id",
          customerphone: "$get_customer_details.phoneno",
          title: "$title",
          jobdescription: "$description",
          location:"$location",
          jobaddress:"$jobaddress",
          date:"$date",
          time:"$time",
          status: "$status",
          price:"$price",
          // quantity: "$quantity",
          // ordernote: "$note",
          // address: "$addr",
          // status: "$status",
          orderid: "$orderid",
          // ordertime: "$timeoforder",
          // customfield: {
          //   $switch: {
          //     branches: [
          //       { case: { $eq: ["$status", 1] }, then: "pending" },
          //       { case: { $eq: ["$status", 2] }, then: "confirm" },
          //     ],
          //     default: "delivered",
          //   },
          // },
        },
      },
      { $unwind: "$customername" },
      { $unwind: "$customerphone" },
      // { $unwind: "$productname" },
      { $unwind: "$customerid" },
      // { $unwind: "$ordernote" },
      // { $unwind: "$prodctcost" },
      // { $unwind: "$discountedprodprice" },
    ]).then((result)=>{
      console.log({result});
      res.send({products : result});
    }).catch((err)=>{
      console.log(err);
    })
  }else{
    ServiceOrders.aggregate([
      {
        $addFields: {
          getvendorid: { $toString: vend },
          getstatus: { $toInt: stat },
        },
      },
      {
        $match: {
          $expr: {
              $and: [{ $eq: ["$vendorid", "$getvendorid"] },
                     { $eq: ["$status", "$getstatus"] },

            ],
          },
        },
      },
      {
        $project: {
          title: "$title",
          description: "$description",
          customerid: "$customerid",
          status: "$status",
          date: "$date",
          time: "$time",
          location: "$location",
          jobaddress:"$jobaddress",
          price: "$price",
          orderid: "$orederid",
        },
      },
      {
        $addFields: {
          // convertedId1: { $toObjectId: "$productid" },
          cus_id: { $toObjectId: "$customerid" },
          // note: {$toString: "$ordernote"},
          // addr: {$toString: "$address"},
        },
      },
      {
        $lookup: {
          from: "customer-details",
          localField: "cus_id",
          foreignField: "_id",
          as: "get_customer_details",
        },
      },
      {
        $project: {
          customername: "$get_customer_details.name",
          customerid: "$get_customer_details._id",
          customerphone: "$get_customer_details.phoneno",
          title: "$title",
          jobdescription: "$description",
          location:"$location",
          jobaddress:"$jobaddress",
          date:"$date",
          time:"$time",
          status: "$status",
          price:"$price",
          // quantity: "$quantity",
          // ordernote: "$note",
          // address: "$addr",
          // status: "$status",
          orderid: "$orderid",
          // ordertime: "$timeoforder",
          // customfield: {
          //   $switch: {
          //     branches: [
          //       { case: { $eq: ["$status", 1] }, then: "pending" },
          //       { case: { $eq: ["$status", 2] }, then: "confirm" },
          //     ],
          //     default: "delivered",
          //   },
          // },
        },
      },
      { $unwind: "$customername" },
      { $unwind: "$customerphone" },
      // { $unwind: "$productname" },
      { $unwind: "$customerid" },
      // // { $unwind: "$ordernote" },
      // { $unwind: "$prodctcost" },
      // { $unwind: "$discountedprodprice" },
    ]).then((result)=>{
      console.log({result});
      res.send({products : result});
    }).catch((err)=>{
      console.log(err);
    })

  }



  },



  async getServiceOrderbyId(req, res) {
    let { id } = req.params;
    ServiceOrders.aggregate([
      // {
      //   $addFields:{
      //     convertedId1:{$toObjectId:id}
      //   }
      // },
      // {
      //   $match: { _id: { $eq: "convertedId1" } },
      // },
      {
        $addFields: {
          conver: { $toString: "$_id" },
        },
      },
      {
        $match: { conver: { $eq: id } },
      },

      {
        $project: {
          price: "$price",
          bookingfrom: "$bookingfrom",
          bookingto: "$bookingto",
          distance: "$distance",
          orederid: "$orederid",
          ordertime: "$createdAt",
        },
      },
    ])

      .then((result) => {
        res.send({ products: result });
      })
      .catch((err) => {
        res.send({ msg: "Invalid vendorid" });
      });
  },

  async getSericeOrders(req, res) {
  //   ServiceOrders.aggregate([
  //   {
  //     $addFields: {
  //       // convertedId1: { $toObjectId: "$vendorid" },
  //       convertedId2: { $toObjectId: "$customerid" },
  //       convertedId3: { $toObjectId: "$serviceid" },
  //       // datecreated: {$toString: "$createdAt"},
  //     },
  //   },

  //   // {
  //   //   $lookup: {
  //   //     from: "vendor-details",
  //   //     localField: "convertedId1",
  //   //     foreignField: "_id",
  //   //     as: "get_vendors",
  //   //   },
  //   // },
  //   {
  //     $lookup: {
  //       from: "customer-details",
  //       localField: "convertedId2",
  //       foreignField: "_id",
  //       as: "get_customers",
  //     },
  //   },
  //   // {
  //   //   $lookup: {
  //   //     from: "service-details",
  //   //     localField: "convertedId3",
  //   //     foreignField: "_id",
  //   //     as: "get_products",
  //   //   },
  //   // },

  //   {
  //     $project: {
  //       // vendors: "$get_vendors.name",
  //       customers: "$get_customers.name",
  //       // productname: "$get_products.productname",
  //       // price: "$price",

  //       // address: "$address",

  //       // quantity: "$quantity",

  //       // distance: "$distance",

  //       // status: "$status",

  //       // orederid: "$orederid",

  //       // date: "$datecreated",
  //     },
  //   }
  // ])
    ServiceOrders.aggregate([
      {
        $addFields: {
          convertedId1: { $toObjectId: "$serviceid" },
          convertedId2: { $toObjectId: "$customerid" },
        },
      },
      {
        $lookup: {
          from: "service-details",
          localField: "convertedId1",
          foreignField: "_id",
          as: "get_service",
        },
      },
      {
        $lookup: {
          from: "customer-details",
          localField: "convertedId2",
          foreignField: "_id",
          as: "get_customers",
        },
      },

      {
        $project: {
          customers: "$get_customers.name",
          services: "$get_service.service_category",
          vendor: "$get_service.vendorid",
          price: "$price",
          title: "$title",
          bookingfrom: "$bookingfrom",
          bookingto: "$bookingto",
          location:"$location",
          jobaddress:"$jobaddress",
          date:"$date",
          time: "$time",
          distance: "$distance",

          status: "$status",

          orederid: "$orederid",
        },
      },
      { $unwind: "$services" },
      { $unwind: "$vendor" },
      { $unwind: "$customers" },

      {
        $addFields: {
          convertedId8: { $toObjectId: "$services" },
          convertedId55: { $toObjectId: "$vendor" },
        },
      },

      {
        $lookup: {
          from: "service-cats",
          localField: "convertedId8",
          foreignField: "_id",
          as: "get_servicecat",
        },
      },

      {
        $lookup: {
          from: "vendor-details",
          localField: "convertedId55",
          foreignField: "_id",
          as: "get_vendosr",
        },
      },
      {
        $project: {
          customers: "$customers",
          provider: "$get_vendosr.name",
          //services: "$convertedId8",
          category: "$get_servicecat.cat_name",
          price: "$price",
          date:"$date",
          time: "$time",
          title:"$title",
          // distances: "$distance",
          status: "$status",
          location: "$location",
          jobaddress:"$jobaddress",
          orederid: "$orederid",
        },
      },
      {$unwind: "$provider"},
      { $unwind: "$category" },
      { $unwind: "$customers" },
    ])
    // ServiceOrders.find().sort([['createdAt', -1]])
      .then((result) => {
        console.log(result)
        res.send({ products: result.reverse() });
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },

  





};

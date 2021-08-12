import VehicleOrders from "../../models/orders/vehicleorders.model";
import bulkMessage from "../../models/messages/notification.model";
const axios = require("axios");
import customernotification from "../../models/messages/customernotification";
import Vendornotifications from "../../models/messages/Vendormessages.model";
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
                          "body" : "You have a new booking for your Vehicle",
                          "title": "Big Midas"
                      },
                    }
            }).then(response =>{
              addmessages(vendid,"You have a new booking for your Vehicle");
              console.log(response);
            });  
    }
    catch(err){
      console.log(err);
    }
  }
});
  
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
              addcustmessages(requid,msg);
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
    const vehicleorder = new VehicleOrders({
      //  orderid: req.body.orderid,
      // orderid: getNextSequenceValue("orderid"),
      vehicleserviceid: req.body.vehicleserviceid,
      customerid: req.body.customerid,
      price: req.body.price,
      vendorid: req.body.vendorid,
      bookingfrom: req.body.bookingfrom,
      bookingto: req.body.bookingto,
      from: req.body.from,
      to: req.body.to,
      date: req.body.date,
      time: req.body.time,
      distance: req.body.distance,
      status: req.body.status,
      orederid: 1000,
    });
    VehicleOrders.find({})
      .sort({ _id: -1 })
      .limit(1)
      .then((products) => {
        sendnotificationonbooking(req.body.vendorid);
          vehicleorder.orederid = products[0].orederid + 1;
          VehicleOrders.create(vehicleorder)
            .then((Users) => res.json(Users))
            .catch((err) => res.status(500).json(err));
      });
  },

  async updatestatus(req,res){
    let vend = req.body.orderid;
    let stat = req.body.stat;
    let custid = req.body.cust;
    let msg = req.body.message;
    VehicleOrders.aggregate([
    {
      $addFields:{
       convertedId: {$toObject: vend}
      }
    }
  ]);
    VehicleOrders.updateOne({_id: vend}, 
      {status: stat}
      ).then((result)=>{
        sendnotificationtocustomer(custid,msg);
        console.log(result);
      }).catch((err) => {
        console.log(err);
      });
  },


  async getVehicleOrders(req, res) {
    VehicleOrders.aggregate([
      {
        $addFields: {
          convertedId1: { $toObjectId: "$vehicleserviceid" },
          convertedId2: { $toObjectId: "$customerid" },
        },
      },

      {
        $lookup: {
          from: "vechicle-details",
          localField: "convertedId1",
          foreignField: "_id",
          as: "get_vehicle",
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
          vehicles: "$get_vehicle.vechicle_catgory",
          vendor: "$get_vehicle.vendorid",
          price: "$price",
          bookingfrom: "$bookingfrom",
          bookingto: "$bookingto",
          date:"$date",
          time:"$time",
          from:"$from",

          distance: "$distance",

          status: "$status",

          orederid: "$orederid",
        },
      },
      { $unwind: "$vehicles" },
      { $unwind: "$vendor" },
      {
        $addFields: {
          convertedId8: { $toObjectId: "$vehicles" },
          convertedId55: { $toObjectId: "$vendor" },
        },
      },

      {
        $lookup: {
          from: "vehiclelisting-cats",
          localField: "convertedId8",
          foreignField: "_id",
          as: "get_vehiclecat",
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
          //vehicles: "$convertedId8",
          vendor: "$get_vendosr.name",
          vehicles: "$get_vehiclecat.cat_name",
          price: "$price",
          bookingfrom: "$bookingfrom",
          bookingto: "$bookingto",
          from: "$from",
          to: "$to",
          date:"$date",
          time:"$time",
          distance: "$distance",

          status: "$status",

          orederid: "$orederid",
        },
      },

      //{ $unwind: "vehicles" },
      { $unwind: "$customers" },
      //{ $unwind: "productname" },
    ])
    // VehicleOrders.find().sort([['createdAt', -1]])
      .then((result) => {
        console.log(result);
        res.send({ products: result.reverse() });
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },


  async OrderbyCustomer(req, res) {
    let { customerid } = req.params;

    VehicleOrders.aggregate([
      {
        
        $match: { customerid: { $eq: customerid } },
      },
      // {
      //   $project: {
      //     vendor:"$vendorid",
      //   },
      // },
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
          // description: "$description",
          // location: "$location",
          // title: "$title",
          vendorphone:"$get_vendor.phonenumber",
          bookingfrom: "$bookingfrom",
          bookingto: "$bookingto",
          from: "$from",
          to: "$to",
          distance: "$distance",
          orederid: "$orederid",
          status: "$status",
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

  async VehicleOrderbyid1(req,res){
    let { vendorid } = req.params;
    let splitted = vendorid.split("&&");
    let vend = splitted[0];
    // let vend = "61014522eeaacb23eab81b8f"
    // let stat = splitted[1];
    let stat = splitted[1];

    if(stat == "0"){
      VehicleOrders.aggregate([
        {
          $addFields: {
            getvendorid: { $toString: vend },
  
          },
        },
        {
          $match: {
            $expr: {
                $and: [{ $eq: ["$vendorid", "$getvendorid"] }],
            },
          },
        },
        {
          $project: {
            orderid: "$orederid",
            customerid: "$customerid",
            status: "$status",
            bookingto: "$bookingto",
            bookingfrom: "$bookingfrom",
            from: "$from",
            to: "$to",
            distance: "$distance",
            vehicleserviceid: "$vehicleserviceid",
            date: "$date",
            time: "$time",
            price: "$price",
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
            orederid: "$orderid",
            status: "$status",
            bookingto: "$bookingto",
            bookingfrom: "$bookingfrom",
            from: "$from",
            to: "$to",
            distance: "$distance",
            vehicleserviceid: "$vehicleserviceid",
            date: "$date",
            time: "$time",
            price: "$price",
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
        console.log(result);
        res.send({products : result});
      })
    }
    else {
    VehicleOrders.aggregate([
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
          orderid: "$orederid",
          customerid: "$customerid",
          status: "$status",
          bookingto: "$bookingto",
          bookingfrom: "$bookingfrom",
          from: "$from",
          to: "$to",
          distance: "$distance",
          vehicleserviceid: "$vehicleserviceid",
          date: "$date",
          time: "$time",
          price: "$price",
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
          orederid: "$orderid",
          status: "$status",
          bookingto: "$bookingto",
          bookingfrom: "$bookingfrom",
          from: "$from",
          to: "$to",
          distance: "$distance",
          vehicleserviceid: "$vehicleserviceid",
          date: "$date",
          time: "$time",
          price: "$price",
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
      console.log(result);
      res.send({products : result});
    })
  }

  },

  async getDistance(req,res){
    console.log(req.body);
    let origin=req.body.origin;
    let destination=req.body.destination;
    // let origin=buf[1]+","+buf[0];
    // let destination=buf1[1]+","+buf1[0];
    axios({
      method: 'get',
      headers:{
        "Content-Type":"application/json",
      },
      url:'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+origin+'&destinations='+destination+'&mode=driving&language=en-EN&sensor=false&key=AIzaSyBJ7XP4D6qnzuxDXNomz4JYtNsaMW89M7k',
      // url: 'https://apis.mapmyindia.com/advancedmaps/v1/rz79it6b2in4dlwijsz93f5htsphbk63/distance_matrix_eta/biking/'+origin+';'+destination,
    }).then(response =>{
      console.log(response.data.rows[0].elements[0].distance.text);
      var dist = response.data.rows[0].elements[0].distance.text.split(" "); 
      if(dist[1]=="km"){
        dist[0]=dist[0].replace(",","");
        dist=parseInt(dist[0])*1000;
      }
      else{
        dist[0]=dist[0].replace(",","");
        var dist = parseInt(dist[0])
      }
      
      res.send({distance:dist});
    });

  }

};

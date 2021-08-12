import Orders from "../../models/orders/orders.model";
import bulkMessage from "../../models/messages/notification.model";
const axios = require("axios");
import customernotification from "../../models/messages/customernotification";
import Vendornotifications from "../../models/messages/Vendormessages.model";
import Customernotifications from "../../models/messages/Customermessages.model";
import Product from "../../models/products/products.model";


function sendnotificationonbooking(vendid,msg) {
  console.log("notification",vendid);
  bulkMessage.find({ uid: vendid}, function (err, docs) {
    if (err){
        console.log(err);
    }
    else{
      console.log(docs);
      try{  
      console.log("Second function call : ", docs[0].firebase_token);
        axios({
              method: 'post',
              headers:{
                "Content-Type":"application/json",
                "Authorization":"key=AAAAZAr6u2A:APA91bFv992Wos4HwN0-dyQlMPSHDOJ7BnAeFRfsFLS8FjDs8gwy7Om-cx6ZG9dgG1sI09cqo4ATQlG5lhXXdInxkZLB6zp1dtJeSCv8aNT1BZoBn6CHQQ--Qsh8i4zLXOIAlEwlfyMU",
                // "Authorization":"key=AAAAxIkn9nY:APA91bHo0OdhbBNNCy8_GN7DsUwGpGFNiu2B0hzIVWKa5G2UJxiJQRiG7FX0VR8JBDYT0ydbmBYWhWx9JuGjPURvcQlzItXhVf-coJ5F3mwLXKq8sWOFRTnvI1Xm3xE_GxD97tFiEXX4",
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
              addmessages(vendid,msg);
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
            }).then((response) =>{
              addcustmessages(requid,msg);
              console.log(response);
              // res.send(response.data)
            })
            .catch((err) => {
              console.log(err);
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
  async addorder(req, res) {
    const order = new Orders({
      productid: req.body.productid,
      productids: req.body.productid,
      productname: req.body.productname,
      productimage: req.body.productimage,
      customerid: req.body.customerid,
      quantity: req.body.quantity,
      address: req.body.address,
      vendorid: req.body.vendorid,
      status: req.body.status,
      totalamount: req.body.totalamount,
      amount:req.body.amount,
      order_note:req.body.order_note,
      delivery_charges: req.body.delivery_charges,
      orederid:1000
    });
    Orders.find({})
    .sort({ _id: -1})
    .limit(1)
    .then((result)=>{
      sendnotificationonbooking(req.body.vendorid,"You have a new order for your store");
      var value = parseInt(result[0].orederid)+1
      order.orederid = value.toString();
      Orders.create(order)
            .then((Users) => {res.json({result: Users});})
            .catch((err) => res.status(500).json(err));
    }) 
  },



  async addmultipleorder(req, res) {
    var productids="",quantities="",amounts="",prodname="",prodimage="";
    productids=req.body.productid[0];
    quantities=req.body.quantity[0];
    prodimage=req.body.productimage[0];
    prodname=req.body.productname[0];
    amounts=req.body.amount[0];
    console.log(req.body);
    for(var i=1;i<req.body.productid.length;i++){
      productids = productids + "&&" + req.body.productid[i],
      prodname = prodname + "&&" + req.body.productname[i],
      prodimage = prodimage + "&&" + req.body.productimage[i],
      quantities = quantities + "&&" + req.body.quantity[i],
      amounts = amounts + "&&" + req.body.amount[i]
    }
    console.log("array data",productids, quantities, amounts)
    const order = new Orders({
      productid: req.body.productid[0],
      productids: productids,
      productimage: prodimage,
      productname: prodname,
      customerid: req.body.customerid,
      quantity: quantities,
      address: req.body.address,
      vendorid: req.body.vendorid,
      status: req.body.status,
      amount: amounts,
      totalamount: req.body.totalamount,
      order_note:req.body.order_note,
      delivery_charges: req.body.delivery_charges,
      orederid:1000
    });
    Orders.find({})
    .sort({ _id: -1})
    .limit(1)
    .then((result)=>{
      sendnotificationonbooking(req.body.vendorid,"You have a new order for your store");
      var value = parseInt(result[0].orederid)+1
      order.orederid = value.toString();
      Orders.create(order)
            .then((Users) => {res.json({result: Users});})
            .catch((err) => res.status(500).json(err));
    }) 
  },


  // async addmultipleorder(req, res) {
  //   var resp = [];
  //   var value = 0;
  //   var counter=1;
  //   var productids="",quantities="",amounts="";
  //   console.log(req.body);
  //   for(var i=1;i<req.body.productid.length;i++){
  //   const order = new Orders({
  //     productid: req.body.productid[i],
  //     customerid: req.body.customerid,
  //     quantity: req.body.quantity[i],
  //     address: req.body.address,
  //     vendorid: req.body.vendorid,
  //     status: req.body.status,
  //     amount:req.body.amount[i],
  //     delivery_charges: req.body.delivery_charges,
  //     order_note:req.body.order_note,
  //     orederid:1000
  //   });
  //   Orders.find({})
  //   .sort({ _id: -1})
  //   .limit(1)
  //   .then((result)=>{
  //     if(value<1){
  //       console.log(value);
  //       value = parseInt(result[0].orederid)+1
  //     }
  //     console.log("this is i",i);
  //     console.log("this is value",value);
  //     order.orederid = value.toString();
  //     order.orederid = order.orederid+"-"+counter;
  //     counter=counter+1;
  //     Orders.create(order)
  //     .then((users)=>{
  //       sendnotificationonbooking(req.body.vendorid,"You have a new order for your store");
  //       console.log(users);
  //     })
  //     .catch((err)=>{console.log(err); resp.push(err)});
  //   });
  // }
  //   res.json({result: counter}); 
  // },


  async updateqty(req,res){
    // var prods="60e84c0cd2c42c514b851bec&&604b7f344458c448579ce161"
    // var quantity = "5&&3";
    // var count =0;
    
    let qty = req.body.quantity.split("&&");
    let productids = req.body.productids.split("&&");
    // let qty = quantity.split("&&");
    // let productids = prods.split("&&");
    console.log(productids);
    console.log("this is length",productids.length);
    for(let i=0;i<productids.length;i++){
      // console.log("this is count",count);
      // count=count+1;
      console.log("this is prods",productids[i]);
      Product.findById(productids[i]).then((res)=>{
        console.log(res); 
        console.log(res.stock);
        console.log("this is quantity",qty[i])
        let updateqty = parseInt(res.stock) - parseInt(qty[i])
        console.log("this is updated qty",updateqty);

        Product.findByIdAndUpdate(
          { _id: productids[i] },
          {
            stock : updateqty
          },
          {new:true}).then((result)=>{
            console.log(result)
          })
      });
    }
    res.send("done");
  },





  async ordersByVendor(req, res) {
    let { vendorid } = req.params;
    let splitted = vendorid.split("&&");
    let vend = splitted[0];
    // let vend = "60cc4c7b149c5c74c34594fe";
    let stat = splitted[1];
    console.log(vend , stat);
    if (stat == undefined || stat == "0") {
      Orders.aggregate([
        {
          $addFields: {
            getvendorid: { $toString: vend },
            convertedvendorid: { $toObjectId: vend },
          },
        },
        {
          $lookup: {
            from: "vendor-details",
            localField: "convertedvendorid",
            foreignField: "_id",
            as: "get_vendor",
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
            productid: "$productid",
            productids: "$productids",
            productname: "$productname",
            productimage:"$productimage",
            discountedprodprice:"$amount",
            quantity: "$quantity",
            totalamount: "$totalamount",
            status: "$status",
            orederid: "$orederid",
            address: "$address",
            deliverycharges:"$delivery_charges",
            ordernote: "$order_note",
            timeoforder: "$createdAt",
            customerid: "$customerid",
          },
        },

        {
          $addFields: {
            // convertedId1: { $toObjectId: "$productid" },
            cus_id: { $toObjectId: "$customerid" },
            note: {$toString: "$ordernote"},
            addr: {$toString: "$address"},
          },
        },
        // {
        //   $lookup: {
        //     from: "products",
        //     localField: "convertedId1",
        //     foreignField: "_id",
        //     as: "get_products",
        //   },
        // },
        // {
        //   $project: {
        //     deliverycharges: "$get_vendor.delivery_charges",
        //     freedeliveryabove: "$get_vendor.free_delivery",
        //   },
        // },
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
            productname: "$productname",
            productids:"$productids",
            // prodctcost:  "$get_products.prodctcost",
            productimage: "$productimage",
            customername: "$get_customer_details.name",
            customerid: "$get_customer_details._id",
            customerphone: "$get_customer_details.phoneno",
            discountedprodprice: "$discountedprodprice",
            quantity: "$quantity",
            deliverycharges:"$deliverycharges",
            // freedeliveryabove:"$get_vendor.free_delivery",
            ordernote: "$note",
            address: "$addr",
            status: "$status",
            orederid: "$orederid",
            ordertime: "$timeoforder",
            totalprice: "$totalamount",
            customfield: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", 1] }, then: "pending" },
                  { case: { $eq: ["$status", 2] }, then: "confirm" },
                ],
                default: "delivered",
              },
            },
          },
        },
        { $unwind: "$customername" },
        { $unwind: "$customerphone" },
        // { $unwind: "$productids" },
        { $unwind: "$customerid" },
        // { $unwind: "$productimage"},
        // // { $unwind: "$ordernote" },
        // { $unwind: "$prodctcost" },
        { $unwind: "$discountedprodprice" },
      ])
        .then((result) => {
          console.log(result);
          res.send({ products: result });
        })
        // .catch((err) => {
        //   res.send({ msg: "Invalid vendorid",err });
        // });

    } else {
      Orders.aggregate([
        {
          $addFields: {
            getvendorid: { $toString: vend },
            getstatus: { $toInt: stat },
          },
        },

        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$vendorid", "$getvendorid"] },
                { $eq: ["$status", "$getstatus"] },
              ],
            },
          },
        },

        {
          $project: {
            productid: "$productid",
            productids: "$productids",
            productname: "$productname",
            productimage:"$productimage",
            discountedprodprice:"$amount",
            quantity: "$quantity",
            totalamount: "$totalamount",
            quantity: "$quantity",
            deliverycharges:"$delivery_charges",
            status: "$status",
            address: "$address",
            orederid: "$orederid",
            timeoforder: "$createdAt",
            customerid: "$customerid",
          },
        },

        {
          $addFields: {
            // convertedId1: { $toObjectId: "$productid" },
            cus_id: { $toObjectId: "$customerid" },
          },
        },
        // {
        //   $lookup: {
        //     from: "products",
        //     localField: "convertedId1",
        //     foreignField: "_id",
        //     as: "get_products",
        //   },
        // },
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
            productname: "$productname",
            productids:"$productids",
            // prodctcost:  "$get_products.prodctcost",
            productimage: "$productimage",
            customername: "$get_customer_details.name",
            customerid: "$get_customer_details._id",
            customerphone: "$get_customer_details.phoneno",
            discountedprodprice: "$discountedprodprice",
            quantity: "$quantity",
            address: "$address",
            deliverycharges:"$deliverycharges",
            status: "$status",
            orederid: "$orederid",
            ordertime: "$timeoforder",
            customfield: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", 1] }, then: "pending" },
                  { case: { $eq: ["$status", 2] }, then: "confirm" },
                ],
                default: "delivered",
              },
            },
          },
        },
        { $unwind: "$customername" },
        // { $unwind: "$productids" },
        { $unwind: "$customerid" },
        { $unwind: "$customerphone"},
        // { $unwind: "$prodctcost" },
        { $unwind: "$discountedprodprice" },
      ])
        .then((result) => {
          console.log(result)
          res.send({ products: result });
        })
        .catch((err) => {
          console.log(err)
          res.send({ msg: "Invalid vendorid" });
        });
    }
  },

  async updatestatus(req,res){
    // console.log(req.params);
    // let { vendorid } = req.params;
    // let splitted = vendorid.split("&&");
    let vend = req.body.orderid;
    let stat = req.body.stat;
    let custid = req.body.cust;
    let msg = req.body.message;
    Orders
    .aggregate([
    {
      $addFields:{
       convertedId: {$toObject: vend}
      }
    }
  ]);
    Orders.updateOne({_id: vend}, 
      {status: stat}
      ).then((result)=>{
        sendnotificationtocustomer(custid,msg);
        console.log(result);
      }).catch((err) => {
        console.log(err);
      });
  },

  async ordersByCustomer(req, res) {
    let { id } = req.params;
    console.log(id);
    let splitted = id.split("&&");
    let vend = splitted[0];
    let stat = splitted[1];
    console.log(vend, stat);
    if (stat == undefined || stat == "0") {
      Orders.aggregate([
        {
          $addFields: {
            getvendorid: { $toString: vend },
            // vendorid: { $toObjectId: vend},
          },
        },

        {
          $match: {
            $expr: {
              $and: [{ $eq: ["$customerid", "$getvendorid"] }],
            },
          },
        },

        {
          $project: {
            productid: "$productid",
            productname:"$productname",
            productimage:"$productimage",
            discountedprodprice:"$amount",
            totalprice:"$totalamount",
            quantity: "$quantity",
            status: "$status",
            orederid: "$orederid",
            timeoforder: "$createdAt",
            customerid: "$customerid",
            vendor:"$vendorid",
          },
        },

        {
          $addFields: {
            // convertedId1: { $toObjectId: "$productid" },
            cus_id: { $toObjectId: "$customerid" },
            vend_id: { $toObjectId: "$vendor" },
          },
        },
        // {
        //   $lookup: {
        //     from: "products",
        //     localField: "convertedId1",
        //     foreignField: "_id",
        //     as: "get_products",
        //   },
        // },
        {
          $lookup: {
            from: "vendor-details",
            localField: "vend_id",
            foreignField: "_id",
            as: "get_vendor",
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
            productname: "$productname",
            // prodctcost: "$get_products.prodctcost",
            customername: "$get_customer_details.name",
            discountedprodprice: "$discountedprodprice",
            prodphotos:"$productimage",
            quantity: "$quantity",
            vendorphone: "$get_vendor.phonenumber",
            totalprice:"$totalprice",
            // delivery_charges: "$get_customer_details.delivery_charges",
            // free_delivery_above: "$get_customer_details.free_delivery_above",
            //status: "$status",
            orederid: "$orederid",
            ordertime: "$timeoforder",
            customfield: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", 1] }, then: "pending" },
                  { case: { $eq: ["$status", 2] }, then: "confirm" },
                ],
                default: "delivered",
              },
            },
          },
        },
        { $unwind: "$customername" },
        { $unwind: "$productname" },
        {$unwind: "$prodphotos"},
        // { $unwind: "$delivery_charges" },
        // { $unwind: "$free_delivery_above"},
        // { $unwind: "$prodctcost" },
        { $unwind: "$discountedprodprice" },
      ])
        .then((result) => {
          console.log(result);
          res.send({ products: result });
        })
        .catch((err) => {
          console.log(err)
          res.send({ msg: "Invalid vendorid" });
        });
    } else {
      Orders.aggregate([
        {
          $addFields: {
            getvendorid: { $toString: vend },
            getstatus: { $toInt: stat },
          },
        },

        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$customerid", "$getvendorid"] },
                { $eq: ["$status", "$getstatus"] },
              ],
            },
          },
        },

        {
          $project: {
            productid: "$productid",
            productname:"$productname",
            productimage:"$productimage",
            discountedprodprice:"$amount",
            totalprice:"$totalamount",
            quantity: "$quantity",
            status: "$status",
            orederid: "$orederid",
            timeoforder: "$createdAt",
            customerid: "$customerid",
            vendor:"$vendorid",
          },
        },

        {
          $addFields: {
            // convertedId1: { $toObjectId: "$productid" },
            cus_id: { $toObjectId: "$customerid" },
            vend_id: { $toObjectId: "$vendor" },
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
        // {
        //   $lookup: {
        //     from: "products",
        //     localField: "convertedId1",
        //     foreignField: "_id",
        //     as: "get_products",
        //   },
        // },
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
            
            productname:"$productname",
            productimage:"$productimage",
            discountedprodprice:"$amount",
            totalprice:"$totalamount",
            customername: "$get_customer_details.name",
            discountedprodprice: "$discountedprodprice",
            quantity: "$quantity",
            vendorphone: "$get_vendor.phonenumber",
            //status: "$status",
            orederid: "$orederid",
            ordertime: "$timeoforder",
            customfield: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", 1] }, then: "pending" },
                  { case: { $eq: ["$status", 2] }, then: "confirm" },
                ],
                default: "delivered",
              },
            },
          },
        },
        { $unwind: "$customername" },
        { $unwind: "$productname" },
        // { $unwind: "$prodctcost" },
        { $unwind: "$discountedprodprice" },
      ])
        .then((result) => {
          res.send({ products: result });
        })
        .catch((err) => {
          console.log(err)
          res.send({ msg: "Invalid vendorid" });
        });
    }
  },
//changed $toObject to $toString in lines 381,382,383

  async allOrders(req, res) {
    Orders.aggregate([
      {
        $addFields: {
          convertedId1: { $toObjectId: "$vendorid" },
          convertedId2: { $toObjectId: "$customerid" },
          convertedId3: { $toObjectId: "$productid" },
          datecreated: {$toString: "$createdAt"},
        },
      },

      {
        $lookup: {
          from: "vendor-details",
          localField: "convertedId1",
          foreignField: "_id",
          as: "get_vendors",
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
        $lookup: {
          from: "products",
          localField: "convertedId3",
          foreignField: "_id",
          as: "get_products",
        },
      },

      {
        $project: {
          vendors: "$get_vendors.name",
          customers: "$get_customers.name",
          productname: "$get_products.productname",
          price: "$price",

          address: "$address",

          quantity: "$quantity",

          distance: "$distance",

          status: "$status",

          orederid: "$orederid",

          date: "$datecreated",
        },
      },
      //{ $unwind: "vendors" },
      //{ $unwind: "customers" },
      //{ $unwind: "productname" },
    ])
      .then((result) => {
        result.reverse();
        console.log(result)
        res.send({ products: result });
      })
      .catch((err) => {
        console.log(err)
        res.send({ msg: err });
      });
  },
};

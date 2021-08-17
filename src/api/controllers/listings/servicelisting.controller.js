import Joi from "joi";
import Servicelisting from "../../models/listings/servicelisting.model";
import HttpStatus from "http-status-codes";
import ServiceReviews from "../../models/reviews/reviewservice.model";
import Subscription from "../../models/subscriptions/subscriptions.model";
import ServiceSubscription from "../../models/subscriptions/subscriptions-service.model";
import multer from "multer";

export default {
  async createshopcat(req, res) {

    let imgarr = [];
    //Validate the Request
    console.log(req);

    let schema = new Servicelisting({
      service_category: req.body.service_category,
      service_price: req.body.service_price,
      location_map: req.body.location_map,
      area: req.body.area,
      city: req.body.city,
      images: "",
      state: req.body.state,
      active: "true",
      pan_adhaar: req.files["pan_adhaar"][0].path,

      // pan_adhaar: req.files["pan_adhaar"][0].path,
      // images:req.files['images'],
      address: req.body.address,
      category: req.body.category,
      vendorid: req.body.vendorid,
    });
    for (let i = 0; i < req.files['images'].length; i++) {
      console.log("hello");
      imgarr.push(req.files['images'][i].path);
    }
    schema.images = imgarr;


    Servicelisting.create(schema)
      .then((Users) => res.json(Users))
      .catch((err) => { res.status(500).json(err), console.log(err) });
  },

  findAll1(req, res, next) {
    var s = req.protocol + "://" + req.get("host");
    let { id } = req.params;
    Servicelisting.aggregate([
      {
        $addFields: {
          convertedId1: { $toObjectId: "$category" },
          convertedId3: { $toObjectId: "$service_category" },
          convertedId2: { $toObjectId: "$vendorid" },
          // nameFilter: {
          //   $concat: [s,'/',"$doc"],
          // },
        },
      },
      {
        $match: { vendorid: { $eq: id } },
      },
      {
        $lookup: {
          from: "shoplisting-cats",
          localField: "convertedId1",
          foreignField: "_id",
          as: "get_cateogires",
        },
      },
      {
        $lookup: {
          from: "service-cats",
          localField: "convertedId3",
          foreignField: "_id",
          as: "get_cateogires1",
        },
      },
      {
        $lookup: {
          from: "vendor-details",
          localField: "convertedId2",
          foreignField: "_id",
          as: "vendor_details",
        },
      },
      {
        $project: {
          service_category: "$get_cateogires1.cat_name",
          city: "$city",
          area: "$area",
          address: "$address",
          // images: "$images",
          cat_name: "$get_cateogires.cat_name",
          createddate: "$createddate",
          pan_adhaar: "$pan_adhaar",
          trade_licence: "$trade_licence",
          fssai_licence: "$fssai_licence",
          vendor: "$vendor_details.name",
        },
      },
      {
        $unwind: "$cat_name",
      },
      {
        $unwind: "$service_category",
      },
      {
        $unwind: "$vendor",
      },
    ]).then((vechicle) => { console.log(vechicle); res.json(vechicle) });
  },
  findAll(req, res, next) {
    var s = req.protocol + "://" + req.get("host");

    Servicelisting.aggregate([
      {
        $addFields: {
          convertedId1: { $toObjectId: "$category" },
          convertedId3: { $toObjectId: "$service_category" },
          convertedId2: { $toObjectId: "$vendorid" },
          convertedId5: { $toString: "$_id" },
          // nameFilter: {
          //   $concat: [s,'/',"$doc"],
          // },
        },
      },
      {
        $lookup: {
          from: "shoplisting-cats",
          localField: "convertedId1",
          foreignField: "_id",
          as: "get_cateogires",
        },
      },
      {
        $lookup: {
          from: "service-cats",
          localField: "convertedId3",
          foreignField: "_id",
          as: "get_cateogires1",
        },
      },
      {
        $lookup: {
          from: "vendor-details",
          localField: "convertedId2",
          foreignField: "_id",
          as: "vendor_details",
        },
      },
      {
        $lookup: {
          from: "service-reviews",
          localField: "convertedId5",
          foreignField: "service_id",
          as: "get_reviews",
        },
      },
      {
        $project: {
          service_category: "$get_cateogires1.cat_name",
          city: "$city",
          area: "$area",
          address: "$address",
          cat_name: "$get_cateogires.cat_name",
          createddate: "$createddate",
          pan_adhaar: "$pan_adhaar",
          trade_licence: "$trade_licence",
          fssai_licence: "$fssai_licence",
          vendor: "$vendor_details.name",
          reviews: "$get_reviews.review",
        },
      },
      //   {
      //     $unwind: "$cat_name",
      //   },
      //   {
      //     $unwind: "$service_category",
      //   },
      //   {
      //     $unwind: "$vendor",
      //   },
      //   {
      //     $unwind: "$reviews",
      //   },
    ]).then((vechicle) => res.json(vechicle.reverse()));
  },
  Updatecat(req, res) {
    let { id } = req.params;
    Servicelisting.findByIdAndUpdate(
      { _id: id },
      {
        service_category: req.body.service_category,
        location_map: req.body.location_map,
        area: req.body.area,
        city: req.body.city,
        pan_adhaar: req.file.path,
        address: req.body.address,
        category: req.body.category,
        vendorid: req.body.vendorid,
      },
      { new: true }
    )
      .then((updated) => {
        res.send({ msg: updated });
      })
      .catch((err) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));

  },
  Delete(req, res) {
    let { id } = req.params;
    Servicelisting.findByIdAndRemove(id)
      .then((client) => {
        if (!client) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ err: "Could not delete any Invoice " });
        }
        return res.json(client);
      })
      .catch((err) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  findreviews(req, res, next) {
    let { id } = req.params;

    var s = req.protocol + "://" + req.get("host");

    // Servicelisting.aggregate([
    //   {
    //     $addFields: {
    //       convertedId1: { $toString: "$_id" },
    //       convertedId3: { $toString: id },
    //     },
    //   },
    //   {
    //     $match: { $expr: { $and: [{ $eq: ["$vendorid", "$convertedId3"] }] } },
    //   },
    //   {
    //     $lookup: {
    //       from: "service-reviews",
    //       localField: "convertedId1",
    //       foreignField: "service_id",
    //       as: "get_reviews",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       customerid: "$get_reviews.customer_id",
    //     },
    //   },
    //   {
    //     $unwind: "$customerid",
    //   },
    //   {
    //     $addFields: {
    //       customerid: { $toObjectId: "$customerid" },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "customer-details",
    //       localField: "customerid",
    //       foreignField: "_id",
    //       as: "get_customer",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       customerpic: "$get_customer.customerpic",
    //     },
    //   },
    //   { $unwind: "$customerpic" },
    //   {
    //     $addFields: {
    //       customerpic: {
    //         $concat: [s, "/", "$customerpic"],
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       rating: "$get_reviews.rating",
    //       review: "$get_reviews.review",
    //       createdat: "$get_reviews.createdat",
    //       customer: "$get_customer.name",
    //       customerpic: "$customerpic",
    //     },
    //   },
    //   // { $unwind: "$rating" },
    //   // { $unwind: "$review" },
    //   // { $unwind: "$createdat" },
    //   // { $unwind: "$customer" },
    //   // { $unwind: "$customerpic" },
    // ])
    ServiceReviews.aggregate([
      {
        $addFields: {
          conver1: { $toString: id },
        }
      },
      {
        $match: { $expr: { $and: [{ $eq: ["$service_id", "$conver1"] }] } },
      },
      {
        $addFields: {
          conver2: { $toObjectId: "$customer_id" }
        }
      },
      {
        $lookup: {
          from: "customer-details",
          localField: "conver2",
          foreignField: "_id",
          as: "getcustomerdetails"
        }
      },
      {
        $project: {
          review: "$review",
          rating: "$rating",
          customer: "$customer_id",
          customername: "$getcustomerdetails.name",
          customerimage: "$getcustomerdetails.customerpic",
          createdat: "$createdat"
        }
      }
    ])
      .then((vechicle) => { console.log(vechicle); res.json(vechicle) });
  },

  async getservicedetails(req, res) {
    let { id } = req.params;

    Servicelisting.find({ _id: id }).then(async (resp) => {
      console.log(resp);
      res.send(resp)
    });

  },


  async getactive(req, res) {
    let { id } = req.params;
    Servicelisting.find({ vendorid: id }).then((result) => {
      console.log(result);
      res.send({ status: result[0].active });
    });
  },

  async editactive(req, res) {
    let { id } = req.params;
    let vid = id.split("&&")[0];
    let val = id.split("&&")[1];

    Servicelisting.findOneAndUpdate(
      { vendorid: vid },
      {
        active: val,
      },
      { new: true }
    )
      .then((result) => {
        res.send({ msg: result });
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },

  async findOrders(req, res) {
    let { vendorid } = req.params;
    let splitted = vendorid.split("&&");
    let vend = splitted[0];
    let stat = splitted[1];
    Servicelisting.aggregate([
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
          productid: "$productid",
          quantity: "$quantity",
          status: "$status",
          orederid: "$orederid",
          address: "$address",
          ordernote: "$order_note",
          timeoforder: "$createdAt",
          customerid: "$customerid",
        },
      },
      {
        $addFields: {
          convertedId1: { $toObjectId: "$productid" },
          cus_id: { $toObjectId: "$customerid" },
          note: { $toString: "$ordernote" },
          addr: { $toString: "$address" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "convertedId1",
          foreignField: "_id",
          as: "get_products",
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
          productname: "$get_products.productname",
          prodctcost: "$get_products.prodctcost",
          customername: "$get_customer_details.name",
          customerid: "$get_customer_details._id",
          customerphone: "$get_customer_details.phoneno",
          discountedprodprice: "$get_products.discountedprodprice",
          quantity: "$quantity",
          ordernote: "$note",
          address: "$addr",
          status: "$status",
          orederid: "$orederid",
          ordertime: "$timeoforder",
          customfield: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", 0] }, then: "rejected" },
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
      { $unwind: "$productname" },
      { $unwind: "$customerid" },
      // { $unwind: "$ordernote" },
      { $unwind: "$prodctcost" },
      { $unwind: "$discountedprodprice" },
    ])
      .then((result) => {
        console.log(result);
        res.send({ products: result });
      })
      .catch((err) => {
        res.send({ msg: "Invalid vendorid" });
      });

    // if (stat == "0") {
    //   Servicelisting.aggregate([
    //     {
    //       $addFields: {
    //         convertedId8: { $toString: vend },
    //         getstatus: { $toInt: stat },
    //       },
    //     },
    //     {
    //       $match: {
    //         $expr: {
    //           $and: [{ $eq: ["$vendorid", "$convertedId8"] }],
    //         },
    //       },
    //     },

    //     {
    //       $addFields: {
    //         convertedId3: { $toString: "$_id" },
    //       },
    //     },

    //     {
    //       $lookup: {
    //         from: "serviceorders",
    //         let: { servicesid: "$convertedId3", stat: "$getstatus" },
    //         pipeline: [
    //           {
    //             $match: {
    //               $expr: {
    //                 $and: [
    //                   { $eq: ["$serviceid", "$$servicesid"] },
    //                   { $eq: ["$status", "$$stat"] },
    //                 ],
    //               },
    //             },
    //           },

    //           {
    //             $project: {
    //               orderid: "$_id",
    //               bookingfrom: "$location",
    //               bookingto: "$bookingto",
    //               price: "$price",
    //               distance: "$distance",
    //               customer: "$customerid",
    //               orederid: "$orederid",
    //               createdAt: "createdAt",
    //             },
    //           },
    //         ],
    //         as: "servorder",
    //       },
    //     },

    //     {
    //       $project: {
    //         serviceid: "$vendorid",
    //         price: "$servorder.price",
    //         orderid: "$servorder._id",
    //         bookingfrom: "$servorder.location",
    //         bookingto: "$servorder.bookingto",
    //         distance: "$servorder.distance",
    //         orederid: "$servorder.orederid",
    //         createdAt: "$servorder.createdAt",
    //       },
    //     },
    //     { $unwind: "$price" },
    //     { $unwind: "$bookingfrom" },
    //     { $unwind: "$bookingto" },
    //     { $unwind: "$distance" },
    //     { $unwind: "$orderid" },
    //     { $unwind: "$orederid" },
    //     { $unwind: "$createdAt" },
    //     {
    //       $group: {
    //         _id: "$orderid",
    //         serviceid: { $addToSet: "$serviceid" },
    //         price: { $addToSet: "$price" },
    //         bookingfrom: { $addToSet: "$bookingfrom" },
    //         distance: { $addToSet: "$distance" },
    //         bookingto: { $addToSet: "$bookingto" },
    //         createdAt: { $addToSet: "$createdAt" },
    //         // projectcount: { $sum: 1 },
    //       },
    //     },
    //     {
    //       $addFields: {
    //         orderid: { $toObjectId: "$_id" },
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "serviceorders",
    //         localField: "orderid",
    //         foreignField: "_id",
    //         as: "get_serviceorders",
    //       },
    //     },
    //     {
    //       $project: {
    //         serviceid: "$orderid",
    //         price: "$get_serviceorders.price",

    //         bookingfrom: "$get_serviceorders.bookingfrom",
    //         bookingto: "$get_serviceorders.bookingto",
    //         distance: "$get_serviceorders.distance",
    //         orederid: "$get_serviceorders.orederid",
    //         createdAt: "$get_serviceorders.createdAt",
    //       },
    //     },
    //     { $unwind: "$price" },
    //     { $unwind: "$bookingfrom" },
    //     { $unwind: "$bookingto" },
    //     { $unwind: "$distance" },

    //     { $unwind: "$orederid" },
    //     { $unwind: "$createdAt" },
    //   ])
    //     .then((result) => {
    //       res.send({ products: result });
    //     })
    //     .catch((err) => {
    //       res.send({ msg: "Invalid " });
    //     });
    // }
    //  else {
    // Servicelisting.aggregate([
    //   {
    //     $addFields: {
    //       convertedId8: { $toString: vend },
    //       getstatus: { $toInt: "2" },
    //     },
    //   },
    //   {
    //     $match: {
    //       $expr: {
    //         $and: [{ $eq: ["$vendorid", "$convertedId8"] }],
    //       },
    //     },
    //   },

    //   {
    //     $addFields: {
    //       convertedId3: { $toString: ["$_id"] },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "serviceorders",
    //       let: { servicesid: "$convertedId3", stat: "$getstatus" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $eq: ["$serviceid", "$$servicesid"] },
    //                 { $eq: ["$status", "$$stat"] },
    //               ],
    //             },
    //           },
    //         },

    //         {
    //           $project: {
    //             orderid: "$_id",
    //             bookingfrom: "$location",
    //             bookingto: "$bookingto",
    //             price: "$price",
    //             distance: "$distance",
    //             customer: "$customerid",
    //             orederid: "$orederid",
    //             createdAt: "$createdAt",
    //           },
    //         },
    //       ],
    //       as: "servorder",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       convertedId4: { $toString: ["$service_price"] },
    //       // convertedId5: { $toString: [{$arrayElemAt:["$servorder.orederid",0]}] },
    //     },
    //   },
    //   {
    //     $project: {
    //       serviceid: "$vendorid",
    //       price: "$convertedId4",
    //       orderid: /*{$arrayElemAt:[*/"$servorder._id"/*,0]}*/,
    //       bookingfrom: /*{$arrayElemAt:[*/"$servorder.bookingfrom",/*0]},*/
    //       // bookingto: "$servorder.bookingto",
    //       distance: "80",
    //       orederid: "$servorder.orederid",
    //       ordertime: /*{$arrayElemAt:[*/"$servorder.createdAt",/*0]},*/
    //     },
    //   },
    //   { $unwind: "$orderid" },
    //   { $unwind: "$bookingfrom" },
    //   // // { $unwind: "$bookingto" },
    //   // // { $unwind: "$distance" },
    //   { $unwind: "$orederid" },
    //   { $unwind: "$ordertime" },
    //   // // { $unwind: "$createdAt" },
    //   {
    //     $group: {
    //       _id: "$orderid",
    //       orderid: { $addToSet: "$orderid"},
    //       // serviceid: { $addToSet: "$serviceid" },
    //       // price: { $addToSet: "$price" },
    //       bookingfrom: { $addToSet: "$bookingfrom" },
    //       distance: { $addToSet: "$orederid" },
    //       // bookingto: { $addToSet: "$bookingto" },
    //       createdAt: { $addToSet: "$ordertime" },
    //       // projectcount: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $addFields: {
    //       orderid: { $toObjectId: "$_id" },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "serviceorders",
    //       localField: "orderid",
    //       foreignField: "_id",
    //       as: "get_serviceorders",
    //     },
    //   },
    //   {
    //     $project: {
    //       orderid:  "$orderid",
    //       price: {$arrayElemAt:["$get_serviceorders.price",0]},
    //       bookingfrom: {$arrayElemAt:["$get_serviceorders.location",0]},
    //       // bookingto: "$get_serviceorders.bookingto",
    //       // distance: "$get_serviceorders.distance",
    //       status: {$arrayElemAt:["$get_serviceorders.status",0]},
    //       orederid: {$arrayElemAt:["$get_serviceorders.orederid",0]},
    //       ordertime: {$arrayElemAt:["$get_serviceorders.createdAt",0]},
    //     },
    //   },
    //   { $unwind: "$price" },
    //   // { $unwind: "$bookingfrom" },
    //   // // { $unwind: "$bookingto" },
    //   // // { $unwind: "$distance" },

    //   // { $unwind: "$orederid" },
    //   // { $unwind: "$createdAt" },
    // ])
    //     .then((result) => {
    //       console.log(result);
    //       // if(result[0].orederid == undefined){
    //       //   res.send({products: []});  
    //       // }
    //       // else{
    //       res.send({products: result});
    //       // }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       res.send({ msg: "Invalid " });
    //     });
    // // }
  },


  async getserviceimage(req, res) {
    let { id } = req.params;
    let { path } = req.params;
    console.log(id, path);
    Servicelisting.findOneAndUpdate(
      { vendorid: id },
      { $pull: { images: "uploads/" + path } },
    ).then((result) => { console.log(result); res.send(result) })

  },

  async addserviceimages(req, res) {
    let imgpath = [];
    console.log(req);
    for (let i = 0; i < req.files['images'].length; i++) {
      imgpath.push(req.files['images'][i].path);
    }
    Servicelisting.findOneAndUpdate(
      { vendorid: req.body.vendorid },
      { $push: { images: imgpath } },
    ).then((result) => { console.log(result); res.send({ msg: "done" }) })
  },


  async getlocationdetails(req, res) {
    let { id } = req.params;

    Servicelisting.find({ vendorid: id }, function (err, docs) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("Result : ", docs);
        // var result=docs;
        // console.log("Result : ", result);
        // res.send(docs[0]); 
        res.send(docs[0]._id);
      }
    });

  },

  async servicelocation(req, res) {
    let { id } = req.params;

    Servicelisting.find({ vendorid: id }, function (err, docs) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("Result : ", docs);
        // var result=docs;
        // console.log("Result : ", result);
        // res.send(docs[0]); 
        res.send({result:docs});
      }
    });
  }
,
  

  async updatelocationdetails(req, res) {
    let { id } = req.params;
    console.log(id);
    console.log(req.body.city);
    console.log(req.body.state);

    Servicelisting.findByIdAndUpdate(
      { _id: id },
      {
        state: req.body.state,
        city: req.body.city,
        address: req.body.address,
        location_map: req.body.location_map,
        area: req.body.area,
      },
    )
      .then((rest) => {
        console.log(rest)
        res.send({ msg: "Updated Successfully" });
      })
      .catch((err) => {
        res.send({ msg: "Update Failed" });
      });

  },


  findvendordetails(req, res, next) {
    let { id } = req.params;

    Servicelisting.aggregate([
      {
        $addFields: {
          convertedId2: { $toObjectId: "$vendorid" },
          convertedId5: { $toString: "$_id" },
        },
      },
      {
        $match: { convertedId5: { $eq: id } },
      },
      {
        $lookup: {
          from: "vendor-details",
          localField: "convertedId2",
          foreignField: "_id",
          as: "vendor_details",
        },
      },
      {
        $project: {
          vendor_id: "$vendor_details._id",
          serviceprovidername: "$vendor_details.name",
          call: "$vendor_details.phonenumber",
          km_serving: "$vendor_details.km_serving",
        }
      }

    ]).then((vechicle) => res.json(vechicle));
  },
  findvendordbycat(req, res, next) {
    let { id } = req.params;

    Servicelisting.aggregate([
      {
        $addFields: {
          convertedId2: { $toObjectId: "$vendorid" },
          convertedId5: { $toString: "$_id" },
          convertedId6: { $toString: "$service_price" }
        },
      },
      {
        $match: { service_category: { $eq: id } },
      },
      {
        $lookup: {
          from: "vendor-details",
          localField: "convertedId2",
          foreignField: "_id",
          as: "vendor_details",
        },
        //  $lookup: {
        //   from: "service-details",
        //   localField: "convertedId2",
        //   foreignField: "_id",
        //   as: "service_details",
        // },
      },
      {
        $project: {
          vendor_id: "$vendor_details._id",
          price: "$convertedId6",
          active: "$active",
          serviceprovidername: "$vendor_details.name",
          call: "$vendor_details.phonenumber",
          location: "$location_map",
          km_serving: "$vendor_details.km_serving",
          image: "$images"
        }
      }

    ]).then(async (vechicle) => {
      console.log(vechicle);
      for (let i = 0; i < vechicle.length; i++) {
        if (vechicle[i].vendor_id.length == 0) {
          console.log("this is null", vechicle[i].vendor_id);
        }
        else {
          await ServiceSubscription.aggregate([
            {
              $addFields: {
                convertedId1: { $toString: vechicle[i].vendor_id[0] },
                convertedId2: { $toObjectId: "$plan_id" },
              },
            },
            {
              $match: { $expr: { $and: [{ $eq: ["$vendor_id", "$convertedId1"] }] } },
            },
            {
              $lookup: {
                from: "subscriptions-service-plans",
                localField: "convertedId2",
                foreignField: "_id",
                as: "get_subplan",
              },
            },
            {
              $addFields: {
                days: "$get_subplan.days",
                days: "$get_subplan.days",
              },
            },

            { $unwind: "$days" },
            {
              $group: {
                _id: "$vendor_id",
                days: { $sum: "$days" },
                createdat: { $first: "$createdat" },
                //   msid:{ $sum: 1},
              },
            },
            {
              $project: {
                days: "$days",
                daysremaining: {
                  $divide: [
                    { $subtract: [new Date(), "$createdat"] },
                    1000 * 60 * 60 * 24,
                  ],
                },
              },
            },
            {
              $addFields: {
                conver: { $subtract: ["$days", "$daysremaining"] }
              }
            },
            {
              $project: {
                totaldayssubscribed: "$days",
                daysremaining: { $round: ["$conver", 0] },
              },
            },
          ]).then((resp) => {
            if (resp.length == 0) { vechicle[i].daysremaining = -10 } else { vechicle[i].daysremaining = resp[0].daysremaining }
          }).catch(err => {
            console.log(err);
          });
          console.log("this is response", i, vechicle[i]);
        }


      }

      res.json(vechicle)
    });
  },
};

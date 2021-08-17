import Joi from "joi";
import Vechiclelisting from "../../models/listings/vehiclelisting.model";
import HttpStatus from "http-status-codes";
import Vendor from "../../models/vendor/vendor.model";
import VehicleReviews from "../../models/reviews/vehiclereview.model";
import Subscription from "../../models/subscriptions/subscriptions.model";
// subscriptions-vehicle.model.js
import vechicleSubscriber from "../../models/subscriptions/subscriptions-vehicle.model";
import Shoplisitng2 from "../../models/categories/shop-listing-cat.model";
import Shoplisitng1 from "../../models/categories/shop-listing-sub-cat.model";
// import Vendor from "../../models/vendor/vendor.model";
import moment from "moment";

import multer from "multer";

export default {
  async createshopcat(req, res) {
    //Validate the Request
    let imgarr = [];

    let schema = new Vechiclelisting({
      vechicle_catgory: req.body.vechicle_catgory,
      vechicle_type: req.body.vechicle_type,
      vechicle_price: 500,
      city: req.body.city,
      area: req.body.area,
      vehiclenumber: req.body.vehiclenumber,
      address: req.body.address,
      category: req.body.category,
      active: "true",
      state: req.body.state,
      pan_adhaar: req.files["pan_adhaar"][0].path,
      driving_license: req.files["driving_license"][0].path,
      insurance: req.files["insurance"][0].path,
      images: req.files['images'][0].path,
      rc: req.files["rc"][0].path,

      // photo : req.file.path,
      vendorid: req.body.vendorid,
    });
    if (req.files["fc"] != undefined) {
      // console.log('entered')
      // console.log('entered',req.files['fc'])
      schema.fc = req.files["fc"][0].path;
    }
    else {
    }

    for (let i = 0; i < req.files['images'].length; i++) {
      console.log("hello");
      imgarr.push(req.files['images'][i].path);
    }
    schema.images = imgarr;

    console.log(req.files);
    Vechiclelisting.create(schema)
      .then((Users) => {
        Vendor.findByIdAndUpdate(
          { _id: req.body.vendorid },
          {
            km_charges: req.body.vehicle_price,
          }).then((res) => { console.log(res) }); res.json(Users)
      })
      .catch((err) => res.status(500).json(err));
  },

  async getactive(req, res) {
    let { id } = req.params;
    Vechiclelisting.find({ vendorid: id }).then((result) => {
      console.log(result);
      res.send({ status: result[0].active });
    });
  },

  async getlocationdetails(req, res) {
    let { id } = req.params;

    Vechiclelisting.find({ vendorid: id }, function (err, docs) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("Result : ", docs);
        // var result=docs;
        // console.log("Result : ", result);
        res.send(docs[0]._id);
      }
    });

  },
  async editactive(req, res) {
    let { id } = req.params;
    let vid = id.split("&&")[0];
    let val = id.split("&&")[1];

    Vechiclelisting.findOneAndUpdate(
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

  async getvehicledetails(req, res) {
    let { id } = req.params;

    Vechiclelisting.find({ _id: id }).then(async (resp) => {
      console.log(resp);

      // await Shoplisitng2.findById(resp[0].category).then(result=>{
      //   console.log(result);
      //   resp[0].category = result.cat_name;
      // });

      // await Shoplisitng1.findById(resp[0].sub_cat).then(result1=>{
      //   console.log(result1);
      //   if(result1==null){
      //   }
      //   else{
      //     console.log(result1);
      //     resp[0].sub_cat = result1.sub_cat_name;

      //   }
      //   console.log(result1);
      //   // resp[0].subcategory = result1.cat_name;
      // });

      // await Vendor.findById(resp[0].vendorid).then(result2=>{
      //   if(result2==null){

      //   }
      //   else{
      //     console.log(result2);
      //     resp[0].vendorid = result2.name;

      //   }
      //   console.log(result2);
      //   // resp[0].subcategory = result1.cat_name;
      // });

      res.send(resp)
    })
  },

  findAll(req, res, next) {
    var s = req.protocol + "://" + req.get("host");

    Vechiclelisting.aggregate([
      {
        $addFields: {
          convertedId2: s,
          convertedId1: { $toObjectId: "$vechicle_catgory" },
          convertedId3: { $toObjectId: "$vechicle_type" },
          // convertedId4: { $toObjectId: "$category" },
          convertedId5: { $toObjectId: "$vendorid" },
          convertedId6: { $toString: "$_id" },
        },
      },
      {
        $lookup: {
          from: "vehiclelisting-cats",
          localField: "convertedId1",
          foreignField: "_id",
          as: "get_cateogires",
        },
      },

      {
        $lookup: {
          from: "vehiclelisting-sub-cats",
          localField: "convertedId3",
          foreignField: "_id",
          as: "get_cateogires1",
        },
      },
      {
        $lookup: {
          from: "vendor-details",
          localField: "convertedId5",
          foreignField: "_id",
          as: "get_vendor",
        },
      },
      {
        $lookup: {
          from: "vehicle-reviews",
          localField: "convertedId6",
          foreignField: "vehicle_id",
          as: "get_review",
        },
      },
      {
        $project: {
          city: "$city",
          area: "$area",
          address: "$address",
          pan_adhaar: "$pan_adhaar",
          driving_license: "$driving_license",
          rc: "$rc",
          fc: "$fc",
          vehicle_category: "$get_cateogires.cat_name",
          vehicle_type: "$get_cateogires1.sub_cat_name",
          //  category: "$get_cateogires2.cat_name",
          category: "$category",
          vendor: "$get_vendor.name",
          review: "$get_review.review",
          createddate: "$createddate",
        },
      },
      //   { $unwind: "$vehicle_category" },
      //   { $unwind: "$vehicle_type" },
      //   { $unwind: "$vendor" },
      //   // { $unwind: "$category" },
      //   { $unwind: "$review" },
    ]).then((vechicle) => res.json(vechicle.reverse()));
  },
  findAll1(req, res, next) {
    var s = req.protocol + "://" + req.get("host");
    let { id } = req.params;
    Vechiclelisting.aggregate([
      {
        $addFields: {
          convertedId2: s,
          convertedId1: { $toObjectId: "$vechicle_catgory" },
          convertedId3: { $toObjectId: "$vechicle_type" },
          convertedId4: { $toObjectId: "$category" },
          convertedId5: { $toObjectId: "$vendorid" },
          convertedId6: { $toString: "$_id" },
        },
      },
      {
        $match: { vendorid: { $eq: id } },
      },
      {
        $lookup: {
          from: "vehiclelisting-cats",
          localField: "convertedId1",
          foreignField: "_id",
          as: "get_cateogires",
        },
      },
      {
        $lookup: {
          from: "shoplisting-cats",
          localField: "convertedId4",
          foreignField: "_id",
          as: "get_cateogires2",
        },
      },
      {
        $lookup: {
          from: "vehiclelisting-sub-cats",
          localField: "convertedId3",
          foreignField: "_id",
          as: "get_cateogires1",
        },
      },
      {
        $lookup: {
          from: "vendor-details",
          localField: "convertedId5",
          foreignField: "_id",
          as: "get_vendor",
        },
      },
      {
        $lookup: {
          from: "vehicle-reviews",
          localField: "convertedId6",
          foreignField: "vehicle_id",
          as: "get_review",
        },
      },
      {
        $project: {
          images: "$images",
          city: "$city",
          area: "$area",
          address: "$address",
          pan_adhaar: "$pan_adhaar",
          driving_license: "$driving_license",
          images: "$images",
          rc: "$rc",
          fc: "$fc",
          vehicle_category: "$get_cateogires.cat_name",
          vehicle_type: "$get_cateogires1.sub_cat_name",
          category: "$get_cateogires2.cat_name",
          vendor: "$get_vendor.name",
          review: "$get_review.review",
          createddate: "$createddate",
        },
      },
      // { $unwind: "$vehicle_category" },
      // { $unwind: "$vehicle_type" },
      // { $unwind: "$vendor" },
      // { $unwind: "$category" },
      // { $unwind: "$review" },
    ]).then((vechicle) => { console.log(vechicle); res.json(vechicle) });
  },
  Updatecat(req, res) {
    let { id } = req.params;

    Vechiclelisting.findByIdAndUpdate(
      { _id: id },
      {
        vechicle_catgory: req.body.vechicle_catgory,
        vechicle_type: req.body.vechicle_type,
        city: req.body.city,
        area: req.body.area,
        address: req.body.address,
        category: req.body.category,
        pan_adhaar: req.body.pan_adhaar,
        driving_license: req.body.driving_license,
        rc: req.body.rc,
        // fc: req.body.fc,
        vendorid: req.body.vendorid,
      },
      { new: true }
    )
      .then((updated) => {
        res.send({ msg: updated });
      })
      .catch((err) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));

    // let schema = new Vechiclelisting({
    //   vechicle_catgory: req.body.vechicle_catgory,
    //   vechicle_type: req.body.vechicle_type,
    //   city: req.body.city,
    //   area: req.body.area,
    //   address: req.body.address,
    //   category: req.body.category,
    //   pan_adhaar: req.body.pan_adhaar,
    //   driving_license: req.body.driving_license,
    //   rc: req.body.rc,
    //   fc: req.body.fc,
    //   // photo : req.file.path,
    //   vendorid: req.body.vendorid,
    //   //  doc : req.file.path,
    // });

    // Vechiclelisting.update({ _id: id }, schema, { multi: true })

    //   .then((client) => res.json(client))

    //   .catch((err) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  Delete(req, res) {
    let { id } = req.params;
    Vechiclelisting.findByIdAndRemove(id)
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


  async getvehicleimage(req, res) {
    let { id } = req.params;
    let { path } = req.params;
    console.log(id, path);
    Vechiclelisting.findOneAndUpdate(
      { vendorid: id },
      { $pull: { images: "uploads/" + path } },
    ).then((result) => { console.log(result); res.send(result) })

  },

  async addvehicleimages(req, res) {
    let imgpath = [];
    console.log(req);
    for (let i = 0; i < req.files['images'].length; i++) {
      imgpath.push(req.files['images'][i].path);
    }
    Vechiclelisting.findOneAndUpdate(
      { vendorid: req.body.vendorid },
      { $push: { images: imgpath } },
    ).then((result) => { console.log(result); res.send({ msg: "done" }) })
  },

  async findOrders(req, res) {
    let { vendorid } = req.params;
    let splitted = vendorid.split("&&");
    let vend = splitted[0];
    let stat = splitted[1];
    if (stat == "1") {
      Vechiclelisting.aggregate([
        {
          $addFields: {
            convertedId8: { $toString: vend },
            getstatus: { $toInt: stat },
          },
        },
        {
          $match: {
            $expr: {
              $and: [{ $eq: ["$vendorid", "$convertedId8"] }],
            },
          },
        },

        {
          $addFields: {
            convertedId3: { $toString: "$_id" },
          },
        },

        {
          $lookup: {
            from: "vehicleorders",
            let: { vechicleid: "$convertedId3", stat: "$getstatus" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$vehicleserviceid", "$$vechicleid"] },
                      { $eq: ["$status", "$$stat"] },
                    ],
                  },
                },
              },

              {
                $project: {
                  orderid: "$_id",
                  bookingfrom: "$bookingfrom",
                  bookingto: "$bookingto",
                  price: "$price",
                  distance: "$distance",
                  customer: "$customerid",
                  orederid: "$orederid",
                  createdAt: "createdAt",
                },
              },
            ],
            as: "vechorders",
          },
        },

        {
          $project: {
            vehicleserviceid: "$vendorid",
            price: "$vechorders.price",
            orderid: "$vechorders._id",
            bookingfrom: "$vechorders.bookingfrom",
            bookingto: "$vechorders.bookingto",
            distance: "$vechorders.distance",
            orederid: "$vechorders.orederid",
            createdAt: "$vechorders.createdAt",
            //  status: "$status",
          },
        },
        { $unwind: "$price" },
        { $unwind: "$bookingfrom" },
        { $unwind: "$bookingto" },
        { $unwind: "$distance" },
        { $unwind: "$orderid" },
        { $unwind: "$orederid" },
        { $unwind: "$createdAt" },
        {
          $group: {
            _id: "$orderid",
            vehicleserviceid: { $addToSet: "$vehicleserviceid" },
            price: { $addToSet: "$price" },
            bookingfrom: { $addToSet: "$bookingfrom" },
            distance: { $addToSet: "$distance" },
            bookingto: { $addToSet: "$bookingto" },
            createdAt: { $addToSet: "$createdAt" },
            // projectcount: { $sum: 1 },
          },
        },
        {
          $addFields: {
            orderid: { $toObjectId: "$_id" },
          },
        },
        {
          $lookup: {
            from: "vehicleorders",
            localField: "orderid",
            foreignField: "_id",
            as: "get_vehicleorders",
          },
        },
        {
          $project: {
            vehicleserviceid: "$orderid",
            price: "$get_vehicleorders.price",
            status: "$get_vehicleorders.status",
            bookingfrom: "$get_vehicleorders.bookingfrom",
            bookingto: "$get_vehicleorders.bookingto",
            distance: "$get_vehicleorders.distance",
            orederid: "$get_vehicleorders.orederid",
            createdAt: "$get_vehicleorders.createdAt",
            //  status: "$status",
          },
        },
        { $unwind: "$price" },
        { $unwind: "$bookingfrom" },
        { $unwind: "$bookingto" },
        { $unwind: "$distance" },
        { $unwind: "$status" },
        { $unwind: "$orederid" },
        { $unwind: "$createdAt" },
      ])
        .then((result) => {
          res.send({ products: result });
        })
        .catch((err) => {
          res.send({ msg: "Invalid " });
        });
    } else {
      Vechiclelisting.aggregate([
        {
          $addFields: {
            convertedId8: { $toString: vend },
            getstatus: { $toInt: stat },
          },
        },
        {
          $match: {
            $expr: {
              $and: [{ $eq: ["$vendorid", "$convertedId8"] }],
            },
          },
        },

        {
          $addFields: {
            convertedId3: { $toString: "$_id" },
          },
        },

        {
          $lookup: {
            from: "vehicleorders",
            let: { vechicleid: "$convertedId3", stat: "$getstatus" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$vehicleserviceid", "$$vechicleid"] },
                      { $eq: ["$status", "$$stat"] },
                    ],
                  },
                },
              },
              {
                $project: {
                  orderid: "$_id",
                  bookingfrom: "$bookingfrom",
                  bookingto: "$bookingto",
                  price: "$price",
                  distance: "$distance",
                  customer: "$customerid",
                  orederid: "$orederid",
                  createdAt: "createdAt",
                },
              },
            ],
            as: "vechorders",
          },
        },

        {
          $project: {
            vehicleserviceid: "$vendorid",
            price: "$vechorders.price",
            orderid: "$vechorders._id",
            bookingfrom: "$vechorders.bookingfrom",
            bookingto: "$vechorders.bookingto",
            distance: "$vechorders.distance",
            orederid: "$vechorders.orederid",
            createdAt: "$vechorders.createdAt",
            //  status: "$status",
          },
        },
        { $unwind: "$price" },
        { $unwind: "$bookingfrom" },
        { $unwind: "$bookingto" },
        { $unwind: "$distance" },
        { $unwind: "$orderid" },
        { $unwind: "$orederid" },
        { $unwind: "$createdAt" },
        {
          $group: {
            _id: "$orderid",
            vehicleserviceid: { $addToSet: "$vehicleserviceid" },
            price: { $addToSet: "$price" },
            bookingfrom: { $addToSet: "$bookingfrom" },
            distance: { $addToSet: "$distance" },
            bookingto: { $addToSet: "$bookingto" },
            createdAt: { $addToSet: "$createdAt" },
            // projectcount: { $sum: 1 },
          },
        },
        {
          $addFields: {
            orderid: { $toObjectId: "$_id" },
          },
        },
        {
          $lookup: {
            from: "vehicleorders",
            localField: "orderid",
            foreignField: "_id",
            as: "get_vehicleorders",
          },
        },
        {
          $project: {
            vehicleserviceid: "$orderid",
            price: "$get_vehicleorders.price",
            bookingfrom: "$get_vehicleorders.bookingfrom",
            bookingto: "$get_vehicleorders.bookingto",
            distance: "$get_vehicleorders.distance",
            status: "$get_vehicleorders.status",
            orederid: "$get_vehicleorders.orederid",
            createdAt: "$get_vehicleorders.createdAt",
            //  status: "$status",
          },
        },
        { $unwind: "$price" },
        { $unwind: "$bookingfrom" },
        { $unwind: "$bookingto" },
        { $unwind: "$distance" },
        { $unwind: "$status" },
        { $unwind: "$orederid" },
        { $unwind: "$createdAt" },
      ])
        .then((result) => {
          console.log(result);
          res.send({ products: result });
        })
        .catch((err) => {
          res.send({ msg: "Invalid " });
        });
    }
  },

  findreviews(req, res, next) {
    let { id } = req.params;

    var s = req.protocol + "://" + req.get("host");

    // Vechiclelisting.aggregate([
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
    //       from: "vehicle-reviews",
    //       localField: "convertedId1",
    //       foreignField: "vehicle_id",
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
    //   { $unwind: "$rating" },
    //   { $unwind: "$review" },
    //   { $unwind: "$createdat" },
    //   { $unwind: "$customer" },
    //   { $unwind: "$customerpic" },
    // ])
    VehicleReviews.aggregate([
      {
        $addFields: {
          conver1: { $toString: id },
        }
      },
      {
        $match: { $expr: { $and: [{ $eq: ["$vehicle_id", "$conver1"] }] } },
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
          customerid: "$customer_id",
          customername: "$getcustomerdetails.name",
          customerimage: "$getcustomerdetails.customerpic",
          createdat: "$createdat"
        }
      }
    ])
      .then((vechicle) => res.json(vechicle));
  },
  findvendordetails(req, res, next) {
    let { id } = req.params;

    Vechiclelisting.aggregate([
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

    Vechiclelisting.aggregate([
      {
        $addFields: {
          convertedId2: { $toObjectId: "$vendorid" },
          convertedvehicletype: { $toObjectId: "$vechicle_type" },
          convertedId5: { $toString: "$_id" },
          convertedId7: { $toString: "$vechicle_price" }
        },
      },
      {
        $match: { vechicle_catgory: { $eq: id } },
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
          from: "vehiclelisting-sub-cats",
          localField: "convertedvehicletype",
          foreignField: "_id",
          as: "subcat"
        }
      },
      {
        $project: {
          vendor_id: "$vendor_details._id",
          serviceprovidername: "$vendor_details.name",
          vehicle_subcategory: "$subcat.sub_cat_name",
          price: "$convertedId7",
          active: "$active",
          call: "$vendor_details.phonenumber",
          km_serving: "$vendor_details.vehicle_km_serving",
          km_charges: "$vendor_details.km_charges",
          image: '$images',
          current_location: "$current_location"
        }
      }

    ]).then(async (vechicle) => {

      for (let i = 0; i < vechicle.length; i++) {
        if (vechicle[i].vendor_id.length == 0) {
          // console.log("this is null", vechicle[i].vendor_id);
        }
        else {

          await vechicleSubscriber.aggregate([
            {
              $addFields: {
                convertedId1: { $toString: vechicle[i].vendor_id },
                convertedId2: { $toObjectId: "$plan_id" },
              },
            },
            {
              $match: { $expr: { $and: [{ $eq: ["$vendor_id", "$convertedId1"] }] } },
            },
            {
              $lookup: {
                from: "subscriptions-vehicle-plans",
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
        
            // {
            //   $addFields: {
            //     days: "$get_subplan.days",
            //     days: "$get_subplan.days",
            //   },
            // },

            // { $unwind: "$days" },
            // {
            //   $group: {
            //     _id: "$vendor_id",
            //     days: { $sum: "$days" },
            //     createdat: { $first: "$createdat" },
            //     //   msid:{ $sum: 1},
            //   },
            // },
            // {
            //   $project: {
            //     days: "$days",
            //     daysremaining: {
            //       $divide: [
            //         { $subtract: [new Date(), "$createdat"] },
            //         1000 * 60 * 60 * 24,
            //       ],
            //     },
            //   },
            // },
            // {
            //   $addFields:{
            //     conver: { $subtract: [ "$days", "$daysremaining"] }
            //   }
            // },
            // {
            //   $project: {
            //     totaldayssubscribed: "$days",
            //     dateSubscribed: "$createdat",
            //     daysremaining:"$get_subplan.days",
            //   },
            // },
          ]).then((resp) => {
            console.log("resp123", resp);
            if (resp.length == 0) { 
              vechicle[i].daysremaining = -10 
            } else {
               vechicle[i].daysremaining = resp[0] .daysremaining
              //  vechicle[i].daysremaining =   moment(resp[0] .createdat).add(resp[0]. get_subplan.days,"days")  .diff(moment(),"days") 
              }
          }).catch(err => {
            console.log(err);
          });
          console.log("this is response", i, vechicle[i]);
        }
      }

      res.json(vechicle);

    });
  },

  async updatedriverlocation(req, res) {

    let { id } = req.params;
    let vid = id.split("&&")[0];
    let val = id.split("&&")[1];

    Vechiclelisting.findOneAndUpdate(
      { vendorid: vid },
      {
        current_location: val,
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
};


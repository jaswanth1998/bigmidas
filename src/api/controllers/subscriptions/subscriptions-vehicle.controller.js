import Joi from "joi";

import moment from "moment";
import Subscription from "../../models/subscriptions/subscriptions-vehicle.model";
import Vechiclelisting from "../../models/listings/vehiclelisting.model";
// var sub = Mongoose.model('subscriptions');
import HttpStatus from "http-status-codes";

import multer from "multer";
import { Mongoose } from "mongoose";

export default {

  async createshopcat(req, res) {
    //Validate the Request
    let vehicleid = ""
    Vechiclelisting.find({ vendorid: req.body.vendor_id })
      .then((result) => { console.log(result._id); vehicleid = result._id });

    let schema = new Subscription({
      plan_id: req.body.plan_id,
      vendor_id: req.body.vendor_id,
      vehicle_id: vehicleid,
      payment_status: req.body.payment_status,
      createdat: req.body.createdat,
    });

    Subscription.create(schema)
      .then((Users) => res.json(Users))
      .catch((err) => res.status(500).json(err));
  },

  findAll(req, res, next) {
    var s = req.protocol + "://" + req.get("host");

    let { id } = req.params;
    Subscription.aggregate([
      {
        $addFields: {
          convertedId1: { $toString: id },
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
    ]).then((vechicle) => { if (vechicle.length == 0) { vechicle = [{ daysremaining: -10 }]; } console.log(vechicle); res.json(vechicle) });
  },

  findallsubs(req, res) {

    Subscription.aggregate([
      {
        $addFields: {
          convertedId1: { $toObjectId: "$vendor_id" },
          convertedId2: { $toObjectId: "$plan_id" },
          convertedId3: { $toString: "$vendor_id" },
          
        },
      },

      {
        $lookup: {
          from: "vechicle-details",
          localField: "convertedId3",
          foreignField: "vendorid",
          as: "get_vehicle",
        },
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
        $unwind: {
          path: "$get_vehicle",
          preserveNullAndEmptyArrays: false
        }
      },
     
      {
        $addFields:{
        catId  : { $toObjectId: "$get_vehicle.vechicle_catgory" },
        }
      },
      {
        $lookup: {
          from: "vehiclelisting-cats",
          localField: "catId",
          foreignField: "_id",
          as: "catgory",
        },
      },
      {
        $lookup: {
          from: "vendor-details",
          localField: "convertedId1",
          foreignField: "_id",
          as: "get_vendor",
        },
      },



      {
        $unwind: {
          path: "$get_subplan",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $unwind: {
          path: "$catgory",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $unwind: {
          path: "$get_vendor",
          preserveNullAndEmptyArrays: false
        }
      },
    

      // { $unwind: "$vehicle_category" },
    ])
      .then((vechicle) => {
        let sendData = []
        vechicle.forEach((item) => {

          sendData.push({
            vendor: item.get_vendor.name,
            vehicle_category: [item.catgory.cat_name],
            totaldayssubscribed:item. get_subplan.days,
            daysremaining: moment(item.createdat).add(item. get_subplan.days,"days")  .diff(moment(),"days")  <0?0 : moment(item.createdat).add(item. get_subplan.days,"days")  .diff(moment(),"days") ,
            date:item.createdat

          });
        })
        console.log(vechicle); res.json({ shops: sendData })
      }

      )
      .catch((err) => {
        res.send(err);
      });
  },



  // findallsubs(req, res) {
  //   Subscription.aggregate([
  //     {
  //       $addFields: {
  //         convertedId1: { $toObjectId: "$vendor_id"},
  //         convertedId2: { $toObjectId: "$plan_id" },
  //         // convertedId3: { $toObjectId: "$shop_id" },
  //         convertedId4: { $toString: "$vendor_id"},
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "shop-details",
  //         localField: "convertedId4",
  //         foreignField: "vendorid",
  //         as: "get_shops",
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "subscriptions",
  //         localField: "convertedId2",
  //         foreignField: "_id",
  //         as: "get_subplan",
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "vendor-details",
  //         localField: "convertedId1",
  //         foreignField: "_id",
  //         as: "get_vendor",
  //       },
  //     },

  //     {
  //       $addFields: {
  //         days: "$get_subplan.days",
  //         //  days: "$get_subplan.days",
  //       },
  //     },

  //     { $unwind: "$days" },
  //     {
  //       $group: {
  //         _id: "$get_shops._id",
  //         days: { $sum: "$days" },
  //         createdat: { $first: "$createdat" },
  //         vendor: { $addToSet: "$get_vendor.name" },
  //         shop_name: { $addToSet: "$get_shops.shop_name" },
  //         //   msid:{ $sum: 1},
  //       },
  //     },
  //     {
  //       $project: {
  //         days: "$days",
  //         shop_name: "$shop_name",
  //         vendor: "$vendor",
  //         status: "$payment_status",
  //         daysremaining: {
  //           $divide: [
  //             { $subtract: [new Date(), "$createdat"] },
  //             1000 * 60 * 60 * 24,
  //           ],
  //         },
  //       },
  //     },
  //     {
  //       $addFields:{
  //         conver: { $subtract: [ "$days", "$daysremaining"] }
  //       }
  //     },
  //     {
  //       $project: {
  //         totaldayssubscribed: "$days",
  //         daysremaining: { $round: ["$conver", 0] },
  //         shop_name: "$shop_name",
  //         vendor: "$vendor",
  //         status: "$status",
  //       },
  //     },
  //     // { $unwind: "$plan_days" },
  //     { $unwind: "$shop_name" },
  //     { $unwind: "$vendor" },

  //     { $unwind: "$shop_name" },
  //     { $unwind: "$vendor" },
  //   ])
  //     .then((vechicle) => {console.log(vechicle); res.json({ shops: vechicle })})
  //     .catch((err) => {
  //       res.send(err);
  //     });
  // },



  Updatecat(req, res) {
    let { id } = req.params;
    Subscription.findByIdAndUpdate(
      { _id: id },
      {
        plan_id: req.body.plan_id,
        vendor_id: req.body.vendor_id,
        vehicle_id: req.body.vehicle_id,
        payment_status: req.body.payment_status,
        createdat: Date.now()
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

  Delete(req, res) {
    let { id } = req.params;
    Subscription.findByIdAndRemove(id)
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

};
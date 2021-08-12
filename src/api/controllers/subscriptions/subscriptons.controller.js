import Joi from "joi";
import Subscription from "../../models/subscriptions/subscriptions.model";
// var sub = Mongoose.model('subscriptions');
import HttpStatus from "http-status-codes";

import multer from "multer";
import { Mongoose } from "mongoose";
import Shoplisting from "../../models/listings/soplisting.model";

export default {
  async createshopcat(req, res) {
    //Validate the Request
    let shopid=""
    Shoplisting.find({vendorid:req.body.vendor_id})
    .then((result)=>{console.log(result._id); shopid=result._id});

    let schema = new Subscription({
      plan_id: req.body.plan_id,
      vendor_id: req.body.vendor_id,
      payment_status: req.body.payment_status,
      shop_id: shopid,
      createdat: req.body.createdat,
    });
    Subscription.create(schema)
      .then((Users) => res.json(Users))
      .catch((err) =>{console.log(err); res.status(500).json(err)});
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
          from: "subscriptions",
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
        $addFields:{
          conver: { $subtract: [ "$days", "$daysremaining"] }
        }
      },
      {
        $project: {
          totaldayssubscribed: "$days",
          daysremaining: { $round: ["$conver", 0] },
        },
      },
    ]).then((vechicle) => {if(vechicle.length==0){vechicle=[{daysremaining:-10}];} console.log(vechicle[0].daysremaining); res.json(vechicle)});
  },

  findallsubs(req, res) {
    Subscription.aggregate([
      {
        $addFields: {
          convertedId1: { $toObjectId: "$vendor_id"},
          convertedId2: { $toObjectId: "$plan_id" },
          // convertedId3: { $toObjectId: "$shop_id" },
          convertedId4: { $toString: "$vendor_id"},
        },
      },
      // {
      //   $project: {
      //     convertedvend: "$convertedId1",
      //     convertedshop: "$convertedId3",
      //     convertedplan: "$convertedId2",
      //   },
      // },
      {
        $lookup: {
          from: "shop-details",
          localField: "convertedId4",
          foreignField: "vendorid",
          as: "get_shops",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "convertedId2",
          foreignField: "_id",
          as: "get_subplan",
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
        $addFields: {
          days: "$get_subplan.days",
          //  days: "$get_subplan.days",
        },
      },

      { $unwind: "$days" },
      {
        $group: {
          _id: "$get_shops._id",
          days: { $sum: "$days" },
          createdat: { $first: "$createdat" },
          vendor: { $addToSet: "$get_vendor.name" },
          shop_name: { $addToSet: "$get_shops.shop_name" },
          //   msid:{ $sum: 1},
        },
      },
      {
        $project: {
          days: "$days",
          shop_name: "$shop_name",
          vendor: "$vendor",
          status: "$payment_status",
          daysremaining: {
            $divide: [
              { $subtract: [new Date(), "$createdat"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $addFields:{
          conver: { $subtract: [ "$days", "$daysremaining"] }
        }
      },
      {
        $project: {
          totaldayssubscribed: "$days",
          daysremaining: { $round: ["$conver", 0] },
          shop_name: "$shop_name",
          vendor: "$vendor",
          status: "$status",
        },
      },
      // { $unwind: "$plan_days" },
      { $unwind: "$shop_name" },
      { $unwind: "$vendor" },

      { $unwind: "$shop_name" },
      { $unwind: "$vendor" },
    ])
      .then((vechicle) => {console.log(vechicle); res.json({ shops: vechicle })})
      .catch((err) => {
        res.send(err);
      });
  },

  // findallsubs(req, res) {
  //   Subscription.aggregate([
  //     {
  //       $addFields: {
  //         convertedId1: { $toObjectId: "$vendor_id" },
  //         convertedId2: { $toObjectId: "$plan_id" },
  //         convertedId3: { $toObjectId: "$shop_id" },
  //       },
  //     },

  //     {
  //       $lookup: {
  //         from: "shop-details",
  //         localField: "convertedId3",
  //         foreignField: "_id",
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
  //       $project: {
  //         shop_name: "$get_shops.shop_name",
  //         vendor: "$get_vendor.name",
  //         status: "$payment_status",
  //         sub_days: "$get_subplan.days",
  //       },
  //     },
  //     { $unwind: "$sub_days" },
  //     { $unwind: "$shop_name" },
  //     { $unwind: "$vendor" },
  //   ])
  //     .then((vechicle) => res.json({ shops: vechicle }))
  //     .catch((err) => {
  //       res.send(err);
  //     });
  // },

  findAllShops(req, res, next) {
    var s = req.protocol + "://" + req.get("host");

    //let {id} = req.params;
    Subscription.aggregate([
      {
        $addFields: {
          //convertedId1: { $toString: id },
          convertedId2: { $toObjectId: "$plan_id" },
          convertedId3: { $toString: "$vendor_id" },
        },
      },
      {
        $lookup: {
          from: "shop-details",
          localField: "convertedId3",
          foreignField: "vendorid",
          as: "get_shops",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "convertedId2",
          foreignField: "_id",
          as: "get_subplan",
        },
      },
      {
        $addFields: {
          days: "$get_subplan.days",
          //  days: '$get_subplan.days',
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
          shop_name: "$get_shops.shop_name",
          daysremaining: {
            $divide: [
              { $subtract: [new Date(), "$createdat"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $addFields:{
          conver: { $subtract: [ "$days", "$daysremaining"] }
        }
      },
      {
        $project: {
          days: "$days",
          daysremaining: { $round: ["$conver", 0] },

          shop_name: "$shop_name",
        },
      },
    ])
      .then((vechicle) => res.json(vechicle))
      .catch((err) => {
        res.send(err);
      });
  },

  Updatecat(req, res) {
    let { id } = req.params;
    Subscription.findByIdAndUpdate(
      { _id: id },
      {
        plan_id: req.body.plan_id,
        vendor_id: req.body.vendor_id,
        payment_status: req.body.payment_status,
        shop_id: req.body.shop_id,
        createdat: Date.now()
      },
      { new: true }
    )
      .then(() => {
        res.send({ msg: "Updated Successfully" });
      })
      .catch((err) => {
        res.send({ msg: "Update Failed",err });
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

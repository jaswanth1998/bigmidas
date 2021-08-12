import Joi from "joi";
import Subscription from "../../models/subscriptions/subscriptions-service.model";
import Servicelisting from "../../models/listings/servicelisting.model";
// var sub = Mongoose.model('subscriptions');
import HttpStatus from "http-status-codes";
import moment from "moment";

import multer from "multer";
import { Mongoose } from "mongoose";

export default {
  async createshopcat(req, res) {
    //Validate the Request

    let serviceid=""
    Servicelisting.find({vendorid:req.body.vendor_id})
    .then((result)=>{console.log(result._id); serviceid=result._id});

    let schema = new Subscription({
      plan_id: req.body.plan_id,
      vendor_id: req.body.vendor_id,
      service_id: serviceid,
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
    ]).then((vechicle) => {if(vechicle.length==0){vechicle=[{daysremaining:-10}];}  res.json(vechicle)});
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
          from: "service-details",
          localField: "convertedId3",
          foreignField: "vendorid",
          as: "get_service",
        },
      },

      {
        $unwind: {
          path: "$get_service",
          preserveNullAndEmptyArrays: false
        }
      },
     
      {
        $addFields:{
        catId  : { $toObjectId: "$get_service.category" },
        }
      },

      {
        $lookup: {
          from: "service-cats",
          localField: "catId",
          foreignField: "_id",
          as: "categary",
        },
      },
      {
        $unwind: {
          path: "$categary",
          preserveNullAndEmptyArrays: false
        }
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
        $lookup: {
          from: "vendor-details",
          localField: "convertedId1",
          foreignField: "_id",
          as: "get_vendor",
        },
      },

      {
        $unwind: {
          path: "$get_vendor",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $unwind: {
          path: "$get_subplan",
          preserveNullAndEmptyArrays: false
        }
      },
     
    


      
  

      
     
      // {
      //   $addFields:{
      //   catId  : { $toObjectId: "$get_vehicle.vechicle_catgory" },
      //   }
      // },
      // {
      //   $lookup: {
      //     from: "vehiclelisting-cats",
      //     localField: "catId",
      //     foreignField: "_id",
      //     as: "catgory",
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "vendor-details",
      //     localField: "convertedId1",
      //     foreignField: "_id",
      //     as: "get_vendor",
      //   },
      // },



      // {
      //   $unwind: {
      //     path: "$get_subplan",
      //     preserveNullAndEmptyArrays: false
      //   }
      // },
      // {
      //   $unwind: {
      //     path: "$catgory",
      //     preserveNullAndEmptyArrays: false
      //   }
      // },
      // {
      //   $unwind: {
      //     path: "$get_vendor",
      //     preserveNullAndEmptyArrays: false
      //   }
      // },
    




      // {
      //   $addFields: {
      //     convertedId1: { $toObjectId: "$vendor_id" },
      //     convertedId2: { $toObjectId: "$plan_id" },
      //     convertedId3: { $toString: "$vendor_id" },
      //   },
      // },
    
      // {
      //   $lookup: {
      //     from: "service-details",
      //     localField: "convertedId3",
      //     foreignField: "vendorid",
      //     as: "get_service",
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "subscriptions-service-plans",
      //     localField: "convertedId2",
      //     foreignField: "_id",
      //     as: "get_subplan",
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "vendor-details",
      //     localField: "convertedId1",
      //     foreignField: "_id",
      //     as: "get_vendor",
      //   },
      // },

      // {
      //   $addFields: {
      //     days: "$get_subplan.days",
      //     //  days: "$get_subplan.days",
      //   },
      // },

      // { $unwind: "$days" },
      // {
      //   $group: {
      //     _id: "$service_id",
      //     days: { $sum: "$days" },
      //     createdat: { $first: "$createdat" },
      //     vendor: { $addToSet: "$get_vendor.name" },
      //     service_category: { $addToSet: "$get_service.service_category" },
      //     //   msid:{ $sum: 1},
      //   },
      // },
      // {
      //   $project: {
      //     days: "$days",
      //     service_category: "$service_category",
      //     vendor: "$vendor",
      //     status: "$payment_status",
      //     daysremaining: {
      //       $divide: [
      //         { $subtract: [new Date(), "$createdat"] },
      //         1000 * 60 * 60 * 24,
      //       ],
      //     },
      //   },
      // },
      // {
      //   $project: {
      //     totaldayssubscribed: "$days",
      //     daysremaining: { $round: ["$daysremaining", 0] },
      //     service_category: "$service_category",
      //     vendor: "$vendor",
      //     status: "$status",
      //   },
      // },
      // // { $unwind: "$plan_days" },
      // { $unwind: "$service_category" },
      // { $unwind: "$vendor" },

      // { $unwind: "$service_category" },
      // { $unwind: "$vendor" },

      // {
      //   $addFields: {
      //     convertedId9: { $toObjectId: "$service_category" },
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "service-cats",
      //     localField: "convertedId9",
      //     foreignField: "_id",
      //     as: "get_service_cat",
      //   },
      // },
      // {
      //   $addFields:{
      //     conver: { $subtract: [ "$totaldayssubscribed", "$daysremaining"] }
      //   }
      // },
      // {
      //   $project: {
      //     totaldayssubscribed: "$totaldayssubscribed",
      //     daysremaining: "$conver",
      //     service_category: "$get_service_cat.cat_name",
      //     vendor: "$vendor",
      //     status: "$status",
      //   },
      // },
      // { $unwind: "$service_category" },
    ])
      .then((vechicle) => {
        let sendData = []
        try {
          vechicle.forEach((item) => {

            sendData.push({
              vendor: item.get_vendor.name,
              service_category: item.categary.cat_name,
              totaldayssubscribed:item. get_subplan.days,
              daysremaining: moment(item.createdat).add(item. get_subplan.days,"days")  .diff(moment(),"days")  ,
              date:item.createdat
  
            });
          })
        } catch (error) {
          console.log(error);
        }
        momemt().add('90',"minutes")
     
        
        res.json({ shops: sendData })})
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
        service_id: req.body.service_id,
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

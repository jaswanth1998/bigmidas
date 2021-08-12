import Joi from "joi";
import Subscription from "../../models/subscriptions/subscriptionplans-services.model";
// var sub = Mongoose.model('subscriptions');
import HttpStatus from "http-status-codes";

import multer from "multer";
import { Mongoose } from "mongoose";

export default {
  async createshopcat(req, res) {
    //Validate the Request

    let schema = new Subscription({
      days: req.body.days,
      cost: req.body.cost,
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
        $project: {
          days: "$days",
          cost: "$cost",
        },
      },
    ]).then((vechicle) => res.json(vechicle));
  },

  Updateplan(req, res, next) {
    let { id } = req.params;
    Subscription.findByIdAndUpdate(
      { _id: id },
      {
        days: req.body.days,
        cost: req.body.cost,
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

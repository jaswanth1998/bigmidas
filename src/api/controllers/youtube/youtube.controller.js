import Joi from "joi";
import HttpStatus from "http-status-codes";
import Youtube from "../../models/youtube/youtube.model";

import { devConfig } from "../../../config/env/development";

export default {
  async addvideo(req, res) {
    const schema = new Youtube({
      title: req.body.title,
      url: req.body.url,
      display_option: req.body.display_option,
    });

    Youtube.find({ url: req.body.url }, function (err, video) {
      if (video.length != 0) {
        console.log("Video already exists");
        return res.json({ message: "Video already exists " });
      } else {
        Youtube.create(schema)
          .then((Users) => res.json(Users))
          .catch((err) => res.status(500).json(err));
      }
    });
  },

  async editVideo(req, res) {
    let { id } = req.params;
    Youtube.findByIdAndUpdate(
      { _id: id },
      {
        title: req.body.title,
        url: req.body.url,
        display_option: req.body.display_option,
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

  async getallvideos(req, res) {
    var s = req.protocol + "://" + req.get("host");
    Youtube.aggregate([
      {
        $project: {
          name: "$title",
          url: "$url",
          display_option: "$display_option",
        },
      },
    ])
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },
  async getallvideosbycat(req, res) {
    let { id } = req.params;
    var s = req.protocol + "://" + req.get("host");
    Youtube.aggregate([
        {
            $match: { display_option: { $eq: id } },
          },
      {
        $project: {
          name: "$title",
          url: "$url",
          display_option: "$display_option",
        },
      },
    ])
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },

  async deleteVideo(req, res) {
    let { id } = req.params;
    Youtube.findByIdAndRemove(id)
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

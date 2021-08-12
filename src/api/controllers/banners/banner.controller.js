import Joi from "joi";
import Shoplisitng from "../../models/banners/banner.model";
import multer from "multer";
import Shoplisitng1 from "../../models/categories/shop-listing-cat.model";

const upload = multer({ dest: "./uploads/" });

export default {
  async createshopcat(req, res) {
    //Validate the Request

    let schema = new Shoplisitng({
      banner_content: req.body.banner_content,
      banner_image: req.file.path,
      banner_type: req.body.banner_type,
    });
    if (req.file) { 
      schema.banner_image = req.file.path;
    }

    Shoplisitng.create(schema)
      .then((Users) => res.json(Users))
      .catch((err) => res.status(500).json(err));
  },
  findAll(req, res, next) {
    Shoplisitng.find()
      .then((cli_categories) => res.json(cli_categories))
      .catch((err) => res.status(500).json(err));
  },
  async getbyid(req, res) {
    var s = req.protocol + "://" + req.get("host");
    let { id } = req.params;
    Shoplisitng.aggregate([
      {
        $addFields: {
          conver: { $toString: "$_id" },
        },
      },
      {
        $match: { conver: { $eq: id } },
      },
    ])
      .then((result) => {
        res.send({ products: result });
      })
      .catch((err) => {
        res.send({ msg: "User Not Found" });
      });
  },

  findAll1(req, res, next) {
    Shoplisitng1.find()
      .then((cli_categories) => res.json(cli_categories))
      .catch((err) => res.status(500).json(err));
  },

  async Updatecat(req, res) {
    let { id } = req.params;
    Shoplisitng.findByIdAndUpdate(
      { _id: id },
      {
        banner_content: req.body.banner_content,
        banner_image: req.file.path,
        banner_type: req.body.banner_type,
      },
      { new: true }
    )
      .then(() => {
        res.send({ msg: "Updated Successfully" });
      })
      .catch((err) => {
        res.send(err);
      });
  },

  async Updatecat_name(req, res) {
    let { id } = req.params;
    Shoplisitng.findByIdAndUpdate(
      { _id: id },
      {
        banner_content: req.body.banner_content,
        banner_type: req.body.banner_type,
      },
      { new: true }
    )
      .then(() => {
        res.send({ msg: "Updated Successfully" });
      })
      .catch((err) => {
        res.send(err);
      });
  },

  Delete(req, res) {
    let { id } = req.params;
    Shoplisitng.findByIdAndRemove(id)
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
  async getallbannertype(req, res) {
    let { id } = req.params;
    var s = req.protocol + "://" + req.get("host");
    Shoplisitng.aggregate([
        { 
            $match: { banner_type: { $eq: id } },
          },
      {
        $project: {
            banner_content: "$banner_content",
            banner_image: "$banner_image",
            banner_type: "$banner_type",
        },
      },
    ])
      .then((result) => {
        console.log("entered banners")
        res.send(result);
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },
};

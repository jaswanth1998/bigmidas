import Joi from "joi";
import Shoplisitng from "../../models/categories/shop-listing-sub-cat.model";
import multer from "multer";

const upload = multer({ dest: "./uploads/" });

export default {
  async createshopcat(req, res) {
    //Validate the Request

    const schema = Joi.object().keys({
      sub_cat_name: Joi.string().required(),
      cat_id: Joi.string().required(),
    });
    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(400).json(error);
    }
    Shoplisitng.find(
      { sub_cat_name: req.body.sub_cat_name },
      function (err, user) {
        if (user.length != 0) {
          console.log("Category already exists");
          return res.json({ message: "Category already exists" });
        } else {
          Shoplisitng.create(value)
            .then((Users) => res.json(Users))
            .catch((err) => res.status(500).json(err));
        }
      }
    );
  },

  findAllSubCat(req, res, next) {
    Shoplisitng.aggregate([
      {
        $addFields: {
          convertedId1: { $toObjectId: "$cat_id" },
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
        $project: {
          sub_cat_name: "$sub_cat_name",
          cat_name: "$get_cateogires.cat_name",
          cat_id: "$cat_id",
        },
      },
      { $unwind: "$cat_name" },
    ]).then((clients) => res.json(clients));
  },
  findAllSubCat1(req, res, next) {
    let {id} = req.params;
    Shoplisitng.aggregate([
    //   {
    //     $addFields: {
    //       convertedId1: { $toObjectId: "$cat_id" },
    //     },
    //   },
      {
        $match: { cat_id: { $eq: id } },
      },
    //   {
    //     $lookup: {
    //       from: "vehiclelisting-cats",
    //       localField: "convertedId1",
    //       foreignField: "_id",
    //       as: "get_cateogires",
    //     },
    //   },
      {
        $project: {
          sub_cat_name: "$sub_cat_name",
          //cat_name: "$get_cateogires.cat_name",
         // cat_id:"$cat_id"
        },
      },
    //  { $unwind: "$cat_name" },
    ]).then((clients) => res.json(clients));
  },
  findAll(req, res, next) {
    let { id } = req.params;
    Shoplisitng.aggregate([
      {
        $addFields: {
          //convertedId: { $toString: id },
          convertedId1: { $toObjectId: "$cat_id" },
        },
      },
      {
        $match: { cat_id: { $eq: id } },
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
        $project: {
          sub_cat_name: "$sub_cat_name",
          cat_name: "$get_cateogires.cat_name",
          cat_id: "$cat_id",
        },
      },
      {
        $unwind: "$cat_name",
      },
    ]).then((clients) => res.json(clients));
  },
  Updatecat(req, res) {
    let { id } = req.params;

    const schema = Joi.object().keys({
      sub_cat_name: Joi,
      cat_id: Joi,
    });

    const { error, value } = Joi.validate(req.body, schema);

    if (error && error.details) {
      return res.status(400).json(error);
    }

    Shoplisitng.update({ _id: id }, value, { multi: true })

      .then((client) => res.json(client))

      .catch((err) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
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
};

import Joi from "joi";
import Shoplisitng from "../../models/categories/shop-listing-cat.model";
import multer from "multer";

const upload = multer({ dest: "./uploads/" });

export default {
  async createshopcat(req, res) {
    //Validate the Request


    let schema = new Shoplisitng({
      cat_name: req.body.cat_name,
      avatar: req.file.path,
      priority: req.body.priority
    });
    if (req.file) {
      schema.avatar = req.file.path;
    }
    Shoplisitng.find({ cat_name: req.body.cat_name }, function (err, user) {
      if (user.length != 0) {
        console.log("Category already exists");
        return res.json({
          message: "Category already exists req.body" + req.file.path,
        });
      } else {
        Shoplisitng.create(schema)
          .then((Users) => res.json(Users))
          .catch((err) => res.status(500).json(err));
      }
    });
  },
  findAll(req, res, next) {
    Shoplisitng.find()
      .then((cli_categories) => res.json(cli_categories))
      .catch((err) => res.status(500).json(err));
  },
  // Updatecat(req,res){

  //     let {id} = req.params;

  //     const schema=Joi.object().keys({
  //         cat_name: Joi,
  //     })

  //   const{error, value} = Joi.validate(req.body, schema);

  //   if(error && error.details){

  //       return res.status(400).json(error);

  //   }

  //   Shoplisitng.update({_id:id},value,{multi: true})

  //     .then(client => res.json(client))

  //     .catch(err=> res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));

  // },

  async Updatecat(req, res) {
    let { id } = req.params;
    Shoplisitng.findByIdAndUpdate(
      { _id: id },
      {
        cat_name: req.body.cat_name,
        avatar: req.file.path,
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
  async Updatecat1(req, res) {
    console.log("req.body", req.body);
    let { id } = req.params;
    Shoplisitng.findByIdAndUpdate(
      { _id: id },
      {
        cat_name: req.body.cat_name,
        priority: req.body.priority,

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
};

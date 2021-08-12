import Joi from "joi";
import Vehiclelisitng from "../../models/categories/vehicle-listing-cat.model";
import multer from "multer";

const upload = multer({ dest: "./uploads/" });

export default {
  async createshopcat(req, res) {
    //Validate the Request
    console.log(req.body);

    let schema = new Vehiclelisitng({
      cat_name: req.body.cat_name,
      avatar: req.file.path,
      priority:req.body.priority
    });

    Vehiclelisitng.find({ cat_name: req.body.cat_name }, function (err, user) {
      if (user.length != 0) {
        console.log("Category already exists");
        return res.json({ message: "Category already exists req.body" });
      } else {
        Vehiclelisitng.create(schema)
          .then((Users) => res.json(Users))
          .catch((err) => res.status(500).json(err));
      }
    });
  },
  findAll(req, res, next) {
    Vehiclelisitng.find()
      .then((cli_categories) => res.json(cli_categories))
      .catch((err) => res.status(500).json(err));
  },
  async Updatecat(req, res) {
    let { id } = req.params;
    Vehiclelisitng.findByIdAndUpdate(
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
  Updatecat1(req, res) {
    let { id } = req.params;
console.log(req.body);
    const schema = Joi.object().keys({
      cat_name: Joi,
      priority: Joi.number()
      
    });

    const { error, value } = Joi.validate(req.body, schema);

    if (error && error.details) {
      return res.status(400).json(error);
    }

    Vehiclelisitng.update({ _id: id }, value, { multi: true })

      .then((client) => res.json(client))

      .catch((err) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  Delete(req, res) {
    let { id } = req.params;
    Vehiclelisitng.findByIdAndRemove(id)
      .then((client) => {
        if (!client) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ err: "Could not delete any Vehicle Category " });
        }
        return res.json(client);
      })
      .catch((err) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
};

import CustomerAddress from "../../models/customer/customeraddress.model";

import Joi from "joi";

export default {
  async addAddress(req, res) {
    console.log(req.body);
    // const address = new CustomerAddress({
    //   name: req.body.name,
    //   phoneno: Joi.number()
    //     .integer()
    //     .min(10 ** 9)
    //     .max(10 ** 10 - 1)
    //     .required(),
    //   houseno: req.body.houseno,
    //   landmark: req.body.landmark,
    //   address: req.body.address,
    //   addresstype: req.body.addresstype,
    // });
    // await address
    //   .save()
    //   .then((result) => {
    //     res.send({ msg: result });
    //   })
    //   .catch((err) => {
    //     res.send({ msg: err });
    //   });

    const schema = Joi.object().keys({
      name: Joi.string().required(),
      customerid: Joi.string().required(),
      phoneno: Joi.number()
        .integer()
        .min(10 ** 9)
        .max(10 ** 10 - 1)
        .required(),
      houseno: Joi.string().required(),
      landmark: Joi.string().required(),
      address: Joi.string().required(),
      // state: Joi.string().required(),
      // country: Joi.string().required(),
      addresstype: Joi.string().required(),
    });
    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      console.log(error);
      return res.status(400).json(error);
    } else {
      CustomerAddress.create(value)
        .then((Users) => res.json(Users))
        .catch((err) => res.status(500).json(err));
    }
  },


  async addAddress1(req, res) {
    console.log(req.body);
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      customerid: Joi.string().required(),
      // positions: Joi.string().required(),
      phoneno: Joi.number()
        .integer()
        .min(10 ** 9)
        .max(10 ** 10 - 1)
        .required(),
      address: Joi.string().required(),
      // state: Joi.string().required(),
      // country: Joi.string().required(),
      addresstype: Joi.string().required(),
    });
    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      console.log(error);
      return res.status(400).json(error);
    } else {
      CustomerAddress.create(value)
        .then((Users) => res.json(Users))
        .catch((err) => res.status(500).json(err));
    }
  },

  async editAddress(req, res) {
    let { id } = req.params;
    CustomerAddress.findByIdAndUpdate(
      { _id: id },
      {
        name: req.body.name,
        phoneno: req.body.phoneno,
        // houseno: req.body.houseno,
        // landmark: req.body.landmark,
        address: req.body.address,
        // country: req.body.country,
        // state: req.body.state,
        addresstype: req.body.addresstype,
      },
      { new: true }
    )
      .then(() => {
        res.send({ msg: "Updated Successfully" });
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },

  async getAddress(req, res) {
    let { id } = req.params;
    CustomerAddress.aggregate([
      {
        $match: { customerid: { $eq: id } },
      },
      {
        $project: {
          name: "$name",
          phoneno: "$phoneno",
          houseno: "$houseno",
          landmark: "$landmark",
          address: "$address",
          state: "$state",
          country: "$country",
          addresstype: "$addresstype",
          customerid: "$customerid",
        },
      },
    ])
      .then((result) => {
        res.send({ products: result });
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },

  async delAddress(req, res) {
    let { id } = req.params;
    CustomerAddress.findByIdAndDelete({ _id: id })
      .then((invoice) => {
        if (!invoice) {
          res.send({ msg: "Address Not found" });
        }
        res.send({ msg: "Address deleted" });
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },
};

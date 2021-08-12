import Joi from "joi";
import HttpStatus from "http-status-codes";
import Vendor from "../../models/vendor/vendor.model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { devConfig } from "../../../config/env/development";
import bcrypt from "bcrypt-nodejs";

export default {
  async signup(req, res) {
    //Validate the Request

    const schema = Joi.object().keys({
      mail: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
      phonenumber: Joi.number()
        .integer()
        .min(10 ** 9)
        .max(10 ** 10 - 1)
        .required(),
      delivery_charges: Joi.number().integer(),
      delivery_pickup: Joi.string(),
      free_delivery: "0",
      km_serving: Joi.number().integer(),
      active_inactive: Joi.string(),
      image:"uploads/1624272025030.jpg",
    });
    // schema.image = req.file.path
    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(400).json(error);
    }
    Vendor.find({ mail: req.body.mail }, function (err, user) {
      if (user.length != 0) {
        console.log("EMAIL already exists, email: ");
        return res.json({ message: "EMAIL already exists" });
      } else {
        Vendor.create(value)
          .then((Users) => res.json(Users))
          .catch((err) =>
            res.status(200).json({ message: "Phone number already existed" })
          );
      }
    });
  },

  async login(req, res) {
    let  user= await Vendor.findOne({
      phonenumber: req.body.phonenumber,
    }).exec();
    if (!user) {
      res.send({ msg: "Wrong Mobile Number" });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      res.send({ msg: "Wrong Password" });
    }
    const token = jwt.sign({ id: user._id }, devConfig.secret, {
      expiresIn: "1d",
    });

    Vendor.aggregate([
      {
        $match: { phonenumber: { $eq: req.body.phonenumber } },
      },

      {
        $project: {
          id: user.id,
        },
      },
      {
        $project: {
          conver: "$id",
        },
      },
      {
      $addFields:{
        conver2: {$toString: "$conver"}
      }
    },
      {
        $lookup: {
          from: "shop-details",
          localField: "conver2",
          foreignField: "vendorid",
          as: "get_shoplist",
        },
      },
      {
        $lookup: {
          from: "service-details",
          localField: "conver2",
          foreignField: "vendorid",
          as: "get_servicelist",
        },
      },
      {
        $lookup: {
          from: "vechicle-details",
          localField: "conver2",
          foreignField: "vendorid",
          as: "get_vehiclelist",
        },
      },
      {
        $project: {
         vehiclevendorid:{$arrayElemAt:["$get_vehiclelist.vendorid",0]},
         servicevendorid:{$arrayElemAt:["$get_servicelist.vendorid",0]},
         shopvendorid: {$arrayElemAt:["$get_shoplist.vendorid",0]},
         vehiclecat: {$arrayElemAt:["$get_vehiclelist.vechicle_catgory",0]},
         servicecat: {$arrayElemAt:["$get_servicelist.service_category",0]},
         shopcat: {$arrayElemAt:["$get_shoplist.category",0]},
        },
      },
      {
        $addFields: {
          conver3: {$toObjectId: "$vehiclecat"},
          conver4: {$toObjectId: "$servicecat"},
          conver5: {$toObjectId: "$shopcat"},
          conver6:  {$toString: "$vehiclevendorid"},
          conver7:  {$toString: "$servicevendorid"},
          conver8: {$toString: "$shopvendorid"}
        }
      },
      {
        $lookup: {
          from: "vehiclelisting-cats",
          localField: "conver3",
          foreignField: "_id",
          as: "get_vehiclecat",
        },
      },
      {
        $lookup: {
          from: "shoplisting-cats",
          localField: "conver5",
          foreignField: "_id",
          as: "get_shopcat",
        },
      },
      {
        $lookup: {
          from: "service-cats",
          localField: "conver4",
          foreignField: "_id",
          as: "get_servicecat",
        },
      },
      // // {
      // //   $project:{
      // //     val: {$arrayElemAt:["$get_vehiclecat.cat_name",0]},
      // //   }
      // // },

      {
        $project: {
          isshoplisted: "$conver8",
          isservicelisted: "$conver7",
          isvehiclelisted: "$conver6",
          aboutus: "$aboutus",
          vehiclecategory:  {$arrayElemAt:["$get_vehiclecat.cat_name",0]},
          vehiclecategoryid:  {$arrayElemAt:["$get_vehiclecat._id",0]},
          servicecategory:  {$arrayElemAt:["$get_servicecat.cat_name",0]},
          servicecategoryid:  {$arrayElemAt:["$get_servicecat._id",0]},
          shopcategory:  {$arrayElemAt:["$get_shopcat.cat_name",0]},
          shopcategoryid:  {$arrayElemAt:["$get_shopcat._id",0]},
        },
      },
      {
        $project: {
          //active: "$active_inactive",
          isshoplisted: "$isshoplisted", 
          // {
            // $switch: {
            //   branches: [
            //     { case: { $ne: ["$isshoplisted", []] }, then: "1" },
            //     { case: { $eq: ["$isshoplisted", []] }, then: "0" },
            //   ],
            // },
          // },
          isservicelisted: "$isservicelisted", 
          // {
          //   $switch: {
          //     branches: [
          //       { case: { $ne: ["$isservicelisted", []] }, then: "1" },
          //       { case: { $eq: ["$isservicelisted", []] }, then: "0" },
          //     ],
          //   },
          // },
          isvehiclelisted: "$isvehiclelisted", 
          // {
          //   $switch: {
          //     branches: [
          //       { case: { $ne: ["$isvehiclelisted", []] }, then: "1" },
          //       { case: { $eq: ["$isvehiclelisted", []] }, then: "0" },
          //     ],
          //   },
          // },
          // category: {
          //   $switch: {
          //     branches: [
          //       { case: { $ne: ["$shopcategory", ""] }, then: "$shopcategory" },
          //       { case: { $ne: ["$vehiclecategory", ""] }, then: "$vehiclecategory" },
          //       { case: { $ne: ["$servicecategory", ""] }, then: "$servicecategory" },
          //     ],
          //   },
          // },
          // categoryid: {
          //   $switch: {
          //     branches: [
          //       { case: { $ne: ["$shopcategoryid", ""] }, then: "$shopcategoryid" },
          //       { case: { $ne: ["$vehiclecategoryid", ""] }, then: "$vehiclecategoryid" },
          //       { case: { $ne: ["$servicecategoryid", ""] }, then: "$servicecategoryid" },
          //     ],
          //   },
          // },
          shopcategory:"$shopcategory",
          shopcategoryid:"$shopcategoryid",
          servicecategory:"$servicecategory",
          servicecategoryid:"$servicecategoryid",
          vehiclecategory: "$vehiclecategory",
          vehiclecategoryid: "$vehiclecategoryid",
          aboutus:"$aboutus",

          // token: token,
        },
        
      },
    ])
      .then((result) => {
        //  res.send({ vendor: result });
        if(result[0].isshoplisted !== null && result[0].isshoplisted !== undefined){
          result[0].isshoplisted="1";
          result[0].category=result[0].shopcategory;
          result[0].categoryid=result[0].shopcategoryid;
           result[0].shopcategory=undefined;
          result[0].shopcategoryid=undefined;
        }
        else{
          result[0].isshoplisted="0";
         
        }
        if(result[0].isservicelisted !== null && result[0].isservicelisted !== undefined){
          result[0].isservicelisted="1";
          result[0].category=result[0].servicecategory;
          result[0].categoryid=result[0].servicecategoryid;
          result[0].servicecategory=undefined;
          result[0].servicecategoryid=undefined;
        }
        else{
          result[0].isservicelisted="0";
        }
        if(result[0].isvehiclelisted !== null && result[0].isvehiclelisted !== undefined){
          result[0].isvehiclelisted="1";
          result[0].category=result[0].vehiclecategory;
          result[0].categoryid=result[0].vehiclecategoryid;
          result[0].vehiclecategory=undefined;
          result[0].vehiclecategoryid=undefined;
        
        }
        else{
          result[0].isvehiclelisted="0";
        }
        console.log("testing",result[0])
        res.json({
          success: true,
          token,
          _id: user._id,
          active: user.active_inactive,
          vendor: result,
        });
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },

  
  async getvendorbyid(req, res) {
    var s = req.protocol + "://" + req.get("host");
    let { id } = req.params;
    Vendor.aggregate([
      {
        $addFields: {
          conver: { $toString: "$_id" }, 
        },
      },
      {
        $match: { conver: { $eq: id } },
      },
      {
        $project: {
          name: "$name",
          mail: "$mail",
          phonenumber: "$phonenumber",
          conver: "$conver",
          aboutus:"$aboutus",
          delivery_pickup: "$delivery_pickup",
          store_km_serving: "$store_km_serving",
          service_km_serving: "$service_km_serving",
          vehicle_km_serving: "$vehicle_km_serving",
          delivery_charges: "$delivery_charges",
          free_delivery_above: "$free_delivery",
          active_inactive: "$active_inactive",
          state_country:'$state_country',
          image:"$image",
          delivery_type: "$delivery_type",
          km_charges:"$km_charges"
        },
      },
      {
        $lookup: {
          from: "shop-details",
          localField: "conver",
          foreignField: "vendorid",
          as: "get_shoplist",
        },
      },
      {
        $lookup: {
          from: "service-details",
          localField: "conver",
          foreignField: "vendorid",
          as: "get_servicelist",
        },
      },
      {
        $lookup: {
          from: "vechicle-details",
          localField: "conver",
          foreignField: "vendorid",
          as: "get_vehiclelist",
        },
      },
      {
        $project: {
          name: "$name",
          mail: "$mail",
          phonenumber: "$phonenumber",
          isshoplisted: {$arrayElemAt:["$get_shoplist.vendorid",0]},
          isservicelisted: {$arrayElemAt:["$get_servicelist.vendorid",0]},
          isvehiclelisted: {$arrayElemAt:["$get_vehiclelist.vendorid",0]},
          delivery_pickup: "$delivery_pickup",
          shopimages: "$get_shoplist.images",
          vehicleimages:"$get_vehiclelist.images",
          serviceimages:"$get_servicelist.images",
          store_km_serving: "$store_km_serving",
          service_km_serving: "$service_km_serving",
          vehicle_km_serving: "$vehicle_km_serving",
          km_charges:"$km_charges",
          aboutus: "$aboutus",
          delivery_type:"$delivery_type",
          delivery_charges: "$delivery_charges",
          free_delivery_above: "$free_delivery_above",
          active_inactive: "$active_inactive",
          state_country:'$state_country',
          image:"$image",
        },
      },
      {
        $project: {
          name: "$name",
          mail: "$mail",
          phonenumber: "$phonenumber",
          delivery_pickup: "$delivery_pickup",
          delivery_type: "$delivery_type",
          km_charges:"$km_charges",
          store_km_serving: "$store_km_serving",
          service_km_serving: "$service_km_serving",
          vehicle_km_serving: "$vehicle_km_serving",
          aboutus:"$aboutus",
          shopimages: "$shopimages",
          vehicleimages:"$vehicleimages",
          serviceimages:"$serviceimages",
          delivery_charges: "$delivery_charges",
          free_delivery_above: "$free_delivery_above",
          active_inactive: "$active_inactive",
          state_country:'$state_country',
          image:"$image",
          isshoplisted: "$isshoplisted", 
          isservicelisted: "$isservicelisted", 
          isvehiclelisted: "$isvehiclelisted", 

          // isshoplisted: {
          //   $switch: {
          //     branches: [
          //       { case: { $ne: ["$isshoplisted", []] }, then: "1" },
          //       { case: { $eq: ["$isshoplisted", []] }, then: "0" },
          //     ],
          //   },
          // },
          // isservicelisted: {
          //   $switch: {
          //     branches: [
          //       { case: { $ne: ["$isservicelisted", []] }, then: "1" },
          //       { case: { $eq: ["$isvehiclelisted", []] }, then: "0" },
          //     ],
          //   },
          // },
          // isvehiclelisted: {
          //   $switch: {
          //     branches: [
          //       { case: { $ne: ["$isvehiclelisted", []] }, then: "1" },
          //       { case: { $eq: ["$isvehiclelisted", []] }, then: "0" },
          //     ],
          //   },
          // },
        },
      },
    ])
      .then((result) => {
        console.log(result);
        // console.log(result[0].shopimages[0]);
        if(result[0].isshoplisted !== null && result[0].isshoplisted !== undefined){
          result[0].isshoplisted="1";
          result[0].category=result[0].shopcategory;
          result[0].categoryid=result[0].shopcategoryid;
           result[0].shopcategory=undefined;
          result[0].shopcategoryid=undefined;
        }
        else{
          result[0].isshoplisted="0";
         
        }
        if(result[0].isservicelisted !== null && result[0].isservicelisted !== undefined){
          console.log("serviceID",result[0].isservicelisted);
          result[0].isservicelisted="1";
          result[0].category=result[0].servicecategory;
          result[0].categoryid=result[0].servicecategoryid;
          result[0].servicecategory=undefined;
          result[0].servicecategoryid=undefined;
        }
        else{
          result[0].isservicelisted="0";
        }
        if(result[0].isvehiclelisted !== null && result[0].isvehiclelisted !== undefined){
          result[0].isvehiclelisted="1";
          result[0].category=result[0].vehiclecategory;
          result[0].categoryid=result[0].vehiclecategoryid;
          result[0].vehiclecategory=undefined;
          result[0].vehiclecategoryid=undefined;
        
        }
        else{
          result[0].isvehiclelisted="0";
        }
        console.log(result);
        res.send({ vendors: result });
      })
      .catch((err) => {
        console.log(err)
        res.send({ msg: err });
      });
  },

  async getallvendors(req, res) {
    Vendor.aggregate([
      {
        $addFields: {
          conver: { $toString: "$_id" },
        },
      },
      {
        $project: {
          name: "$name",
          mail: "$mail",
          active_inactive: "$active_inactive",
          phonenumber: "$phonenumber",
          conver: "$conver",
        },
      },
      {
        $lookup: {
          from: "shop-details",
          localField: "conver",
          foreignField: "vendorid",
          as: "get_shoplist",
        },
      },
      {
        $lookup: {
          from: "service-details",
          localField: "conver",
          foreignField: "vendorid",
          as: "get_servicelist",
        },
      },
      {
        $lookup: {
          from: "vechicle-details",
          localField: "conver",
          foreignField: "vendorid",
          as: "get_vehiclelist",
        },
      },
      {
        $project: {
          name: "$name",
          mail: "$mail",
          active_inactive: "$active_inactive",
          phonenumber: "$phonenumber",
          isshoplisted: "$get_shoplist.vendorid",
          isservicelisted: "$get_servicelist.vendorid",
          isvehiclelisted: "$get_vehiclelist.vendorid",
        },
      },
      {
        $project: {
          name: "$name",
          mail: "$mail",
          phonenumber: "$phonenumber",
          active_inactive: "$active_inactive",
          isshoplisted: {
            $switch: {
              branches: [
                { case: { $ne: ["$isshoplisted", []] }, then: "1" },
                { case: { $eq: ["$isshoplisted", []] }, then: "0" },
              ],
            },
          },
          isservicelisted: {
            $switch: {
              branches: [
                { case: { $ne: ["$isservicelisted", []] }, then: "1" },
                { case: { $eq: ["$isservicelisted", []] }, then: "0" },
              ],
            },
          },
          isvehiclelisted: {
            $switch: {
              branches: [
                { case: { $ne: ["$isvehiclelisted", []] }, then: "1" },
                { case: { $eq: ["$isvehiclelisted", []] }, then: "0" },
              ],
            },
          },
        },
      },
    ])
      .then((result) => {
        result.reverse()
        res.send({ vendors: result });
      })
      .catch((err) => {
        res.send(err);
      });
  },
  async deletevendor(req, res) {
    let { id } = req.params;
    Vendor.findByIdAndRemove(id)
      .then((client) => {
        if (!client) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ err: "Could not delete any Vendor " });
        }
        return res.json(client);
      })
      .catch((err) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  async editvendorActive(req, res) {
    let { id } = req.params;
   console.log('fdfd',req.file) 
   if(req.file!=undefined){
    Vendor.findByIdAndUpdate(
        { _id: id },
        {
          active_inactive: req.body.active_inactive, 
          mail: req.body.mail,
          password: req.body.password,
          name: req.body.name,
          phonenumber: req.body.phonenumber,
          aboutus: req.body.aboutus,
          delivery_charges:req.body.delivery_charges,
          delivery_pickup: req.body.delivery_pickup,
          free_delivery: req.body.free_delivery,
          km_serving:req.body.km_serving,
          image: req.file.path,
        },
        { new: true }
      )
        .then(() => {
          res.send({ msg: "Updated Successfully" });
        })
        .catch((err) => {
          res.send({ msg: "Update Failed" });
        });
   } else {
    Vendor.findByIdAndUpdate(
        { _id: id },
        {
          active_inactive: req.body.active_inactive, 
          mail: req.body.mail,
          password: req.body.password,
          name: req.body.name,
          phonenumber: req.body.phonenumber,
          delivery_charges:req.body.delivery_charges,
          delivery_pickup: req.body.delivery_pickup,
          free_delivery: req.body.free_delivery,
          km_serving:req.body.km_serving,
         image: req.file.path,
        },
        { new: true }
      )
        .then(() => {
          res.send({ msg: "Updated Successfully" });
        })
        .catch((err) => {
          res.send({ msg: "Update Failed" });
        });
   }
   
  },

  async updateaboutus(req, res ){
    let { id } = req.params;
    Vendor.findByIdAndUpdate(
      { _id: id },
      {
        aboutus:req.body.aboutus
      },
    )
      .then(() => {
        res.send({ msg: "Updated Successfully" });
      })
      .catch((err) => {
        res.send({ msg: "Update Failed" });
      });

  },
  async storedistance(req, res){
    let { id } = req.params;
    Vendor.findByIdAndUpdate(
      {_id: id},
      {
        store_km_serving:req.body.store_km_serving,
        delivery_charges: req.body.delivery_charges,
        free_delivery: req.body.free_delivery,
      }
    ).then((result)=>{
      res.send({msg: "Updated Successfully"});
    }).catch((err)=>{
      res.status(500).send({msg: err});
    })
  },

  async updateprofilepic(req,res){
    Vendor.findByIdAndUpdate(
      {_id: req.body.id},
      {
        image: req.file.path
      }).then((result)=>{
        res.send({msg: "Updated Successfully"+result});
      }).catch((err)=>{
        res.status(500).send({msg: err});
      })
  },

  async servicedistance(req, res){
    let { id } = req.params;
    Vendor.findByIdAndUpdate(
      {_id: id},
      {
        service_km_serving:req.body.service_km_serving,
      }
    ).then((result)=>{
      res.send({msg: "Updated Successfully"+result});
    }).catch((err)=>{
      res.status(500).send({msg: err});
    })
  },

  async vehicledistance(req, res){
    let { id } = req.params;
    Vendor.findByIdAndUpdate(
      {_id: id},
      {
        vehicle_km_serving:req.body.vehicle_km_serving,
        km_charges:req.body.km_charges,
      }
    ).then((result)=>{
      res.send({msg: "Updated Successfully"});
    }).catch((err)=>{
      res.status(500).send({msg: err});
    })
  },


  async updatedeliverytype(req, res){
    let { id } = req.params;
    Vendor.findByIdAndUpdate(
      {_id: id},
      {
        delivery_type:req.body.delivery_type,
      }
    ).then((result)=>{
      res.send({msg: "Updated Successfully"});
    }).catch((err)=>{
      res.status(500).send({msg: err});
    })
  }


};

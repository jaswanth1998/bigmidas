import Admin from "../../models/admin/admin.model";
import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import { devConfig } from "../../../config/env/development";

export default {
  async adminRegister(req, res) {
    try {
      let admin = await Admin.findOne({ adminemail: req.body.adminemail });
      if (admin) {
        res.send({ user: "Already registered" });
      } else {
        admin = new Admin({
          adminname: req.body.adminname,
          adminemail: req.body.adminemail,
          adminpassword: req.body.adminpassword,
          userType: req.body.userType,
        });
        admin.adminpassword = admin.generateHash(admin.adminpassword);
        await admin.save();
        res.send({ user: "Registered" });
      }  
    } catch (error) {
      res.send({ error: error });
    }
    
  },

  async adminUsers(req,res) {
    try {
      let admin = await Admin.find({});
      admin.forEach(element => {
       element.adminpassword = "";
      });
      res.send(admin);
    } catch (error) {
      res.send({ error: error });
    }
  },

  async deleteadmin(req, res) {
    try {
      let admin = await Admin.findOne({ adminemail: req.body.adminemail });
      if (admin) {
        await admin.remove();
        res.send({ user: "Deleted" });
      } else {
        res.send({ user: "Not found" });
      }
    } catch (error) {
      res.send({ error: error });
    }
  },
  
  async adminLogin(req, res) {
    let user = await Admin.findOne({
      adminemail: req.body.adminemail,
    }).exec();
    if (!user) {
      res.send({ msg: "You are not registered" });
    }
    if (!bcrypt.compareSync(req.body.adminpassword, user.adminpassword)) {
      res.send({ msg: "Login Fail" });
    }
    const token = jwt.sign({ id: user._id ,userType:user.userType}, devConfig.secret, {
      expiresIn: "1d",
    });
    
    return res.json({ success: true, token ,userType:user.userType});
  },
  async getallcount(req, res) {
    var s = req.protocol + "://" + req.get("host");
    Admin.aggregate([
      { "$lookup": {
        "from": "customer-details",
        "pipeline": [
          { $group: { _id: null, myCount: { $sum: 1 } } },
        ],
        "as": "customer"
      }},
      { "$lookup": {
        "from": "service-details",
        "pipeline": [
          { $group: { _id: null, myCount: { $sum: 1 } } },
        ],
        "as": "services"
      }},
      { "$lookup": {
        "from": "shop-details",
        "pipeline": [
          { $group: { _id: null, myCount: { $sum: 1 } } },
        ],
        "as": "shop"
      }},
      { "$lookup": {
        "from": "vechicle-details",
        "pipeline": [
          { $group: { _id: null, myCount: { $sum: 1 } } },
        ],
        "as": "vehicle"
      }},
      { "$lookup": {
        "from": "vehicleorders",
        "pipeline": [
          { $group: { _id: null, myCount: { $sum: 1 } } },
        ],
        "as": "vehiclebookings"
      }},
      { "$lookup": {
        "from": "serviceorders",
        "pipeline": [
          { $group: { _id: null, myCount: { $sum: 1 } } },
        ],
        "as": "servicebookings"
      }},
      { "$lookup": {
        "from": "orders",
        "pipeline": [
          { $group: { _id: null, myCount: { $sum: 1 } } },
        ],
        "as": "storebookings"
      }},
      { "$lookup": {
        "from": "vehicle-reviews",
        "pipeline": [
          { $group: { _id: '$vehicle_id', myCount: { $sum: 1 } } },
          { $sort : { myCount : -1 } },
          { $limit : 20 },
          {
            $addFields : {
                convertedId: { $toObjectId: '$_id' },
           
              }  },
              { 
                $lookup: {
               from: "vechicle-details",
               localField: "convertedId",
               foreignField: "_id",
               as: "vehicles"
            }
            
            },
            {
              $addFields : {
                  vendorid:"$vehicles.vendorid",
             
                }  },
                {$unwind:"$vendorid"},
                {
                  $addFields : {
                      convertedId1: { $toObjectId: '$vendorid' },
                 
                    }  },
                    { 
                      $lookup: {
                     from: "vendor-details",
                     localField: "convertedId1",
                     foreignField: "_id",
                     as: "ven"
                  } },  
            {
              $project:{
                names: '$ven.name'
              }
            }
        ],
        "as": "best-vechiles"
      }},
      { "$lookup": {
        "from": "shop-reviews",
        "pipeline": [
          { $group: { _id: '$shop_id', myCount: { $sum: 1 } } },
          { $sort : { myCount : -1 } },
          { $limit : 20 },
          {
            $addFields : {
                convertedId: { $toObjectId: '$_id' },
           
              }  },
              { 
                $lookup: {
               from: "shop-details",
               localField: "convertedId",
               foreignField: "_id",
               as: "shopss"
            }
            
            },
            {
              $project:{
                names: '$shopss.shop_name'
              }
            }
        ],
        "as": "best-shop"
      }},
      { "$lookup": {
        "from": "service-reviews",
        "pipeline": [
          { $group: { _id: '$service_id', myCount: { $sum: 1 } } },
          { $sort : { myCount : -1 } },
          { $limit : 20 },
          {
            $addFields : {
                convertedId: { $toObjectId: '$_id' },
           
              }  },
              { 
                $lookup: {
               from: "service-details",
               localField: "convertedId",
               foreignField: "_id",
               as: "servicess"
            }
            
            },
            {
              $addFields : {
                  vendorid:"$servicess.vendorid",
             
                }  },
                {$unwind:"$vendorid"},
                {
                  $addFields : {
                      convertedId1: { $toObjectId: '$vendorid' },
                 
                    }  },
                    { 
                      $lookup: {
                     from: "vendor-details",
                     localField: "convertedId1",
                     foreignField: "_id",
                     as: "ven"
                  } },  
            {
              $project:{
                names: '$ven.name'
              }
            }
            
        ],
        "as": "best-services"
      }},
      {
          $project:{
            customer : '$customer.myCount',
            services : '$services.myCount',
            shop : '$shop.myCount',
            shop_bookings:'$storebookings.myCount',
            service_bookings:'$servicebookings.myCount',
            vehicle_bookings:'$vehiclebookings.myCount',
            vehicle : '$vehicle.myCount',
            best_shop: '$best-shop',
            best_service: '$best-services',
            best_vechiles: '$best-vechiles',
          }
      }
    ])
      .then((result) => {
        res.send({ products: result });
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },

};

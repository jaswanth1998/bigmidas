import Wishlist from "../../models/wishlist/wishlist.model";
import ShopWishlist from "../../models/wishlist/shopwishlist.model";
import VehicleWishlist from "../../models/wishlist/vehiclewishlist.model";
import ServiceWishlist from "../../models/wishlist/servicewishlist.model";
import Vendor from "../../models/vendor/vendor.model";
import Notiftest from "../../models/wishlist/test.model";

export default {
  async createWishlist(req, res) {
    const wishlist = await Wishlist.findOne({
      productid: req.body.productid,
      customerid: req.body.customerid,
    });
    if (wishlist) {
      Wishlist.findOneAndDelete({
        productid: req.body.productid,
        customerid: req.body.customerid,
      }).then((result) => res.send({ msg: `Deleted ${result}` }));
      //.catch((err) => res.send({ msg: err }));
    } else {
      let wishlist = new Wishlist({
        productid: req.body.productid,
        customerid: req.body.customerid,
      });
      await wishlist
        .save()
        .then((result) => {
          res.send({ msg: result });
        })
        .catch((err) => {
          res.send({ msg: err });
        });
    }
  },

  async getwishlistbyid(req, res) {
    let { id } = req.params;
    Wishlist.find({customerid: id})
    .then( (result) => {
      res.send(result);
    });
  },

  async setshopwishlist(req, res){
    let prodwishlist = new ShopWishlist({
      vendorid: req.body.vendorid,
      shopid: req.body.shopid,
      customerid: req.body.customerid,
    });
    ShopWishlist.create(prodwishlist)
      .then((result) => {
        res.send({ msg: result });
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },

  async setvehiclewishlist(req, res){
    let vehiclewishlist = new VehicleWishlist({
      vendorid: req.body.vendorid,
      vehicleid: req.body.vehicleid,
      customerid: req.body.customerid,
    });
    VehicleWishlist.create(vehiclewishlist)
      .then((result) => {
        res.send({ msg: result });
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },


  async setservicewishlist(req, res){
    let servicewishlist = new ServiceWishlist({
      vendorid: req.body.vendorid,
      serviceid: req.body.serviceid,
      customerid: req.body.customerid,
    });
    ServiceWishlist.create(servicewishlist)
      .then((result) => {
        res.send({ msg: result });
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },

  async getshopwishlist(req, res){
    let { id } = req.params;

    // ShopWishlist.find({customerid: id})
    // .then((result)=>{
    //   Vendor.find({_id: "60334e60e7250757e7a45062"})
    //   .then((result1) => {
    //   console.log(result);
    //   console.log( "result",result1);
    //   val=result[0]
    // })
    ShopWishlist.aggregate([
      {
        $addFields: {
          conver: { $toString: "$customerid" },
          conver1: {$toObjectId: "$vendorid"}
        },
      },
      {
        $match: { conver: { $eq: id } },
      },
      {
        $lookup: {
          from: "vendor-details",
          localField: "conver1",
          foreignField: "_id",
          as: "get_vendors",
        }
      },
      {
        $project: {
          customerid: "$customerid",
          shopid: "$shopid",
          vendorid: "$vendorid",
          serviceprovidername: {$arrayElemAt:["$get_vendors.name",0]},
          call: {$arrayElemAt:["$get_vendors.phonenumber",0]},
          km_serving: {$arrayElemAt:["$get_vendors.km_serving",0]},
          image: {$arrayElemAt:["$get_vendors.image",0]},
        },
      },
    ])
    .then((result) =>{
      console.log(result)
      res.send(result);
    })
      
  },

  async getvehiclewishlist(req, res){
    let { id } = req.params;

    VehicleWishlist.aggregate([
      {
        $addFields: {
          conver: { $toString: "$customerid" },
          conver1: {$toObjectId: "$vendorid"},
          conver2: {$toObjectId: "$vehicleid"}
        },
      },
      {
        $match: { conver: { $eq: id } },
      },
      {
        $lookup: {
          from: "vendor-details",
          localField: "conver1",
          foreignField: "_id",
          as: "get_vendors",
        }
      },
      {
        $lookup: {
          from: "vehicle-details",
          localField: "conver2",
          foreignField: "_id",
          as: "get_vehicles",
        }
      },
      {
        $project: {
          customerid: "$customerid",
          vehicleid: "$vehicleid",
          vendorid: "$vendorid",
          serviceprovidername: {$arrayElemAt:["$get_vendors.name",0]},
          call: {$arrayElemAt:["$get_vendors.phonenumber",0]},
          km_serving: {$arrayElemAt:["$get_vendors.km_serving",0]},
          price:"$get_vehicles.vechicle_price",
          image: {$arrayElemAt:["$get_vendors.image",0]},
        },
      },
    ]).then((result)=>{
      res.send(result);
    }).catch((err)=>{
      res.status(status).send(err)
    })
  },

  async getservicewishlist(req, res){
    let { id } = req.params;

    ServiceWishlist.aggregate([
      {
        $addFields: {
          conver: { $toString: "$customerid" },
          conver1: {$toObjectId: "$vendorid"},
          conver2: {$toObjectId: "$serviceid"}
        },
      },
      {
        $match: { conver: { $eq: id } },
      },
      {
        $lookup: {
          from: "vendor-details",
          localField: "conver1",
          foreignField: "_id",
          as: "get_vendors",
        }
      },
      {
        $lookup: {
          from: "service-details",
          localField: "conver2",
          foreignField: "_id",
          as: "get_services",
        }
      },
      {
        $project: {
          customerid: "$customerid",
          vehicleid: "$vehicleid",
          vendorid: "$vendorid",
          serviceid:"$get_services._id",
          serviceprovidername: {$arrayElemAt:["$get_vendors.name",0]},
          call: {$arrayElemAt:["$get_vendors.phonenumber",0]},
          km_serving: {$arrayElemAt:["$get_vendors.km_serving",0]},
          price:"$get_services.price",
          image: {$arrayElemAt:["$get_vendors.image",0]},
        },
      },
    ]).then((result)=>{
      res.send(result);
    }).catch((err)=>{
      res.status(500).send(err)
    })
  }
};

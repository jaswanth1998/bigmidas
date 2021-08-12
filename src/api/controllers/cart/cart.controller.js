import Cart from "../../models/cart/cart.model";

export default {
  async addtoCart(req, res) {
    console.log(req.body);
    if (req.body.quantity == 0) {
      Cart.findOneAndDelete({ productid: req.body.productid })
        .then((result) => res.send({ msg: result }))
        .catch((err) => res.send({ err: err }));
    } else {
      Cart.findOneAndUpdate(
        { productid: req.body.productid, customerid: req.body.customerid },
        { quantity: req.body.quantity },
        { new: true }
      )
        .then((cart) => {
          if (!cart) {
            let cart = new Cart({
              quantity: req.body.quantity,
              productid: req.body.productid,
              shopid: req.body.shopid,
              shopname: req.body.shopname,
              customerid: req.body.customerid,
              vendorid: req.body.vendorid,
              delivery_charges: req.body.delivery_charges,
              delivery_type:req.body.delivery_type,
              free_delivery_above: req.body.free_delivery_above,
            });
            cart
              .save()

              .then((success) => res.send({ msg: success }))
              .catch((err) => {
                res.send({ msg: err });
              });
          } else {
            res.send({ msg: "quantity updated" });
          }
        })
        .catch((err) => {
          res.send({ msg: err });
        });
    }
  },

  //   async addtoCart(req, res) {
  //     if (req.body.quantity == 0) {
  //       Cart.findOneAndDelete({ productid: req.body.productid })
  //         .then((result) => res.send({ msg: result }))
  //         .catch((err) => res.send({ err: err }));
  //     } else {

  //             let cart = new Cart({
  //               quantity: req.body.quantity,
  //               productid: req.body.productid,
  //               customerid: req.body.customerid,
  //             });
  //             cart
  //               .save()

  //               .then((success) => res.send({ msg: success }))
  //               .catch((err) => {
  //                 res.send({ msg: err });

  //         })
  //         .catch((err) => {
  //           res.send({ msg: err });
  //         });
  //     }
  //   },
  async getCartProductsbycus(req, res) {
    let { id } = req.params;
    Cart.aggregate([
      {
        $match: { customerid: { $eq: id } },
      },
      {
        $project: {
          customerid: "$customerid",
          productid: "$productid",
          quantitya: "$quantity",
          vendorid: "$vendorid",
          shopname: "$shopname",
          shopid: "$shopid",
          delivery_type:"$delivery_type",
          delivery_charges: "$delivery_charges",
          free_delivery_above: "$free_delivery_above",
        },
      },
      {
        $addFields: {
          convertedId2: { $toObjectId: "$productid" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "convertedId2",
          foreignField: "_id",
          as: "get_products",
        },
      },
      {
        $project: {
          customerid: "$customerid",
          quantity: "$quantitya",
          vendorid: "$vendorid",
          name: "$get_products.productname",
          images: "$get_products.prodphoto.path", 
          product_id: "$get_products._id",
          stock: "$get_products.stock",
          regular_price: "$get_products.prodctcost",
          discount_price: "$get_products.discountedprodprice",
          shopname:"$shopname",
          shopid:"$shopid",
          delivery_charges: "$delivery_charges",
          delivery_type:"$delivery_type",
          free_delivery_above: "$free_delivery_above",
        },
      },
      // { $unwind: "$name" },
      // { $unwind: "$regular_price" },
      // { $unwind: "$discount_price" },
    ])
      .then((result) => {
        res.send({ msg: result });
      })
      .catch((err) => { 
        res.send({ err: err });
      });
  },

  async getCartProducts(req, res) {
    Cart.aggregate([
      {
        $project: {
          customerid: "$customerid",
          productid: "$productid",
          quantity: "$quantity",
          vendorid: "$vendorid",
          shopname: "$shopname",
          shopid: "$shopid",
        },
      },
      {
        $addFields: {
          convertedId2: { $toObjectId: "$productid" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "convertedId2",
          foreignField: "_id",
          as: "get_products",
        },
      },
      {
        $project: {
          customerid: "$customerid",
          quantity: "$qunatity",
          vendorid: "$vendorid",
          name: "$get_products.productname",
          product_id: "$get_products._id",
          regular_price: "$get_products.prodctcost",
          discount_price: "$get_products.discountedprodprice",
          shopid: "$shopid",
          shopname: "$shopname",
        },
      },
      { $unwind: "$name" },
      { $unwind: "$regular_price" },
      { $unwind: "$discount_price" },
    ])
      .then((result) => {
        console.log(result);
        res.send({ msg: result });
      })
      .catch((err) => {
        res.send({ err: err });
      });
  },
   async deleteCart(req,res){
    let { id } = req.params;
    Cart.findByIdAndRemove(id)
    .then(client =>{
       if(!client){
           return res.status(HttpStatus.NOT_FOUND).json({err:'Could not delete any Invoice '});
       }
       return res.json(client);
    })
    .catch(err=> res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    
  }

};

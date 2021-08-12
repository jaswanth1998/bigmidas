import Orders from "../../models/orders/orders.model";

export default {
  async addorder(req, res) {
    const order = new Orders({
      productid: req.body.productid,
      customerid: req.body.customerid,
      quantity: req.body.quantity,
      address: req.body.address,
      vendorid: req.body.vendorid,
      status: req.body.status,
      amount:req.body.amount,
      order_note:req.body.order_note,
    });
    
          Orders.create(order)
            .then((Users) => res.json(Users))
            .catch((err) => res.status(500).json(err));
     
  },

  async ordersByVendor(req, res) {
    let { vendorid } = req.params;
    let splitted = vendorid.split("&&");
    let vend = splitted[0];
    let stat = splitted[1];
    if (stat == "0") {
      Orders.aggregate([
        {
          $addFields: {
            getvendorid: { $toString: vend },
          },
        },

        {
          $match: {
            $expr: {
              $and: [{ $eq: ["$vendorid", "$getvendorid"] }],
            },
          },
        },

        {
          $project: {
            productid: "$productid",
            quantity: "$quantity",
            status: "$status",
            orederid: "$orederid",
            timeoforder: "$createdAt",
            customerid: "$customerid",
          },
        },

        {
          $addFields: {
            convertedId1: { $toObjectId: "$productid" },
            cus_id: { $toObjectId: "$customerid" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "convertedId1",
            foreignField: "_id",
            as: "get_products",
          },
        },
        {
          $lookup: {
            from: "customer-details",
            localField: "cus_id",
            foreignField: "_id",
            as: "get_customer_details",
          },
        },
        {
          $project: {
            productname: "$get_products.productname",
            prodctcost: "$get_products.prodctcost",
            customername: "$get_customer_details.name",
            discountedprodprice: "$get_products.discountedprodprice",
            quantity: "$quantity",
            //status: "$status",
            orederid: "$orederid",
            ordertime: "$timeoforder",
            customfield: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", 1] }, then: "pending" },
                  { case: { $eq: ["$status", 2] }, then: "confirm" },
                ],
                default: "delivered",
              },
            },
          },
        },
        { $unwind: "$customername" },
        { $unwind: "$productname" },
        { $unwind: "$prodctcost" },
        { $unwind: "$discountedprodprice" },
      ])
        .then((result) => {
          res.send({ products: result });
        })
        .catch((err) => {
          res.send({ msg: "Invalid vendorid" });
        });
    } else {
      Orders.aggregate([
        {
          $addFields: {
            getvendorid: { $toString: vend },
            getstatus: { $toInt: stat },
          },
        },

        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$vendorid", "$getvendorid"] },
                { $eq: ["$status", "$getstatus"] },
              ],
            },
          },
        },

        {
          $project: {
            productid: "$productid",
            quantity: "$quantity",
            status: "$status",
            orederid: "$orederid",
            timeoforder: "$createdAt",
            customerid: "$customerid",
          },
        },

        {
          $addFields: {
            convertedId1: { $toObjectId: "$productid" },
            cus_id: { $toObjectId: "$customerid" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "convertedId1",
            foreignField: "_id",
            as: "get_products",
          },
        },
        {
          $lookup: {
            from: "customer-details",
            localField: "cus_id",
            foreignField: "_id",
            as: "get_customer_details",
          },
        },
        {
          $project: {
            productname: "$get_products.productname",
            prodctcost: "$get_products.prodctcost",
            customername: "$get_customer_details.name",
            discountedprodprice: "$get_products.discountedprodprice",
            quantity: "$quantity",
            //status: "$status",
            orederid: "$orederid",
            ordertime: "$timeoforder",
            customfield: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", 1] }, then: "pending" },
                  { case: { $eq: ["$status", 2] }, then: "confirm" },
                ],
                default: "delivered",
              },
            },
          },
        },
        { $unwind: "$customername" },
        { $unwind: "$productname" },
        { $unwind: "$prodctcost" },
        { $unwind: "$discountedprodprice" },
      ])
        .then((result) => {
          res.send({ products: result });
        })
        .catch((err) => {
          res.send({ msg: "Invalid vendorid" });
        });
    }
  },
  async ordersByCustomer(req, res) {
    let { id } = req.params;
    let splitted = id.split("&&");
    let vend = splitted[0];
    let stat = splitted[1];
    if (stat == "0") {
      Orders.aggregate([
        {
          $addFields: {
            getvendorid: { $toString: vend },
          },
        },

        {
          $match: {
            $expr: {
              $and: [{ $eq: ["$customerid", "$getvendorid"] }],
            },
          },
        },

        {
          $project: {
            productid: "$productid",
            quantity: "$quantity",
            status: "$status",
            orederid: "$orederid",
            timeoforder: "$createdAt",
            customerid: "$customerid",
          },
        },

        {
          $addFields: {
            convertedId1: { $toObjectId: "$productid" },
            cus_id: { $toObjectId: "$customerid" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "convertedId1",
            foreignField: "_id",
            as: "get_products",
          },
        },
        {
          $lookup: {
            from: "customer-details",
            localField: "cus_id",
            foreignField: "_id",
            as: "get_customer_details",
          },
        },
        {
          $project: {
            productname: "$get_products.productname",
            prodctcost: "$get_products.prodctcost",
            customername: "$get_customer_details.name",
            discountedprodprice: "$get_products.discountedprodprice",
            quantity: "$quantity",
            //status: "$status",
            orederid: "$orederid",
            ordertime: "$timeoforder",
            customfield: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", 1] }, then: "pending" },
                  { case: { $eq: ["$status", 2] }, then: "confirm" },
                ],
                default: "delivered",
              },
            },
          },
        },
        { $unwind: "$customername" },
        { $unwind: "$productname" },
        { $unwind: "$prodctcost" },
        { $unwind: "$discountedprodprice" },
      ])
        .then((result) => {
          res.send({ products: result });
        })
        .catch((err) => {
          res.send({ msg: "Invalid vendorid" });
        });
    } else {
      Orders.aggregate([
        {
          $addFields: {
            getvendorid: { $toString: vend },
            getstatus: { $toInt: stat },
          },
        },

        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$customerid", "$getvendorid"] },
                { $eq: ["$status", "$getstatus"] },
              ],
            },
          },
        },

        {
          $project: {
            productid: "$productid",
            quantity: "$quantity",
            status: "$status",
            orederid: "$orederid",
            timeoforder: "$createdAt",
            customerid: "$customerid",
          },
        },

        {
          $addFields: {
            convertedId1: { $toObjectId: "$productid" },
            cus_id: { $toObjectId: "$customerid" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "convertedId1",
            foreignField: "_id",
            as: "get_products",
          },
        },
        {
          $lookup: {
            from: "customer-details",
            localField: "cus_id",
            foreignField: "_id",
            as: "get_customer_details",
          },
        },
        {
          $project: {
            productname: "$get_products.productname",
            prodctcost: "$get_products.prodctcost",
            customername: "$get_customer_details.name",
            discountedprodprice: "$get_products.discountedprodprice",
            quantity: "$quantity",
            //status: "$status",
            orederid: "$orederid",
            ordertime: "$timeoforder",
            customfield: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", 1] }, then: "pending" },
                  { case: { $eq: ["$status", 2] }, then: "confirm" },
                ],
                default: "delivered",
              },
            },
          },
        },
        { $unwind: "$customername" },
        { $unwind: "$productname" },
        { $unwind: "$prodctcost" },
        { $unwind: "$discountedprodprice" },
      ])
        .then((result) => {
          res.send({ products: result });
        })
        .catch((err) => {
          res.send({ msg: "Invalid vendorid" });
        });
    }
  },

  async allOrders(req, res) {
    Orders.aggregate([
      {
        $addFields: {
          convertedId1: { $toObjectId: "$vendorid" },
          convertedId2: { $toObjectId: "$customerid" },
          convertedId3: { $toObjectId: "$productid" },
        },
      },

      {
        $lookup: {
          from: "vendor-details",
          localField: "convertedId1",
          foreignField: "_id",
          as: "get_vendors",
        },
      },
      {
        $lookup: {
          from: "customer-details",
          localField: "convertedId2",
          foreignField: "_id",
          as: "get_customers",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "convertedId3",
          foreignField: "_id",
          as: "get_products",
        },
      },

      {
        $project: {
          vendors: "$get_vendors.name",
          customers: "$get_customers.name",
          productname: "$get_products.productname",
          price: "$price",

          address: "$address",

          quantity: "$quantity",

          distance: "$distance",

          status: "$status",

          orederid: "$orederid",
        },
      },
      //{ $unwind: "vendors" },
      //{ $unwind: "customers" },
      //{ $unwind: "productname" },
    ])
      .then((result) => {
        res.send({ products: result });
      })
      .catch((err) => {
        res.send({ msg: err });
      });
  },
};

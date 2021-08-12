import CustomerIssue from "../../models/customer/customerissue.model";

export default {
  async addIssue(req, res) {
    const schema = new CustomerIssue({
      customerid: req.body.customerid,
      issue: req.body.issue,
    });
    CustomerIssue.find(
      { customerid: req.body.customerid },
      function (err, user) {
        if (user.length != 0) {
          console.log("ticket already exists");
          return res.json({ message: "ticket already exists " });
        } else {
          CustomerIssue.create(schema)
            .then((customerissue) => res.json(customerissue))
            .catch((err) => res.status(500).json(err));
        }
      }
    );
  },

  async getIssues(req, res) {
    CustomerIssue.aggregate([
      {
        $addFields: {
          convertedId1: { $toObjectId: "$customerid" },
        },
      },
      {
        $lookup: {
          from: "customer-details",
          localField: "convertedId1",
          foreignField: "_id",
          as: "get_customers",
        },
      },
      {
        $project: {
          customername: "$get_customers.name",
          issue: "$issue",
          createddate: "$createddate",
        },
      },
      { $unwind: "$customername" },
    ])
      .then((issues) => res.json(issues))
      .catch((err) => {
        res.send(err);
      });
  },
  async editIssue(req, res) {
    let { id } = req.params;
    CustomerIssue.findByIdAndUpdate(
      { _id: id },
      {
        customerid: req.body.customerid,
        issue: req.body.issue,
      },
      { new: true }
    )
      .then((updated) => {
        res.send({ msg: updated });
      })
      .catch((err) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  Delete(req, res) {
    let { id } = req.params;
    CustomerIssue.findByIdAndRemove(id)
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

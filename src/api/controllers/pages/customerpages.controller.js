import Pages from "../../models/pages/customerpages.model";
import HttpStatus from "http-status-codes";

export default {
  async createpage(req, res) {
    //Validate the Request

    let schema = new Pages({
      page_name: req.body.page_name,
      page_description: req.body.page_description,
    });

    Pages.create(schema)
      .then((Users) => res.json(Users))
      .catch((err) => res.status(500).json(err));
  },
  findAll(req, res, next) {
    Pages.aggregate([
      {
        $project: {
          page_name: "$page_name",
          description: "$page_description",
        },
      },
    ])
      .then((pages) => {
        res.send(pages);
      })
      .catch((err) => res.status(500).json(err));
  },
  Updatepage(req, res) {
    let { id } = req.params;
    Pages.findByIdAndUpdate(
      { _id: id },
      {
        page_name: req.body.page_name,
        page_description: req.body.page_description,
      },
      { new: true }
    )
      .then(() => {
        res.send({ msg: "Updated Successfully" });
      })
      .catch((err) => {
        res.send({ msg: "Update Failed" });
      });
  },
  Delete(req, res) {
    let { id } = req.params;
    Pages.findByIdAndRemove(id)
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

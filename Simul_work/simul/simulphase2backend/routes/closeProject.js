var router = require("./login");

router.post("/closeproject", function(req, res, next) {
  if (req.body.projectID == null) {
    res
      .status(400)
      .json({
        message: "Project Initialisation failed: Please enter an address"
      });
  }
  req
    .db("project")
    .where({ projectID: req.body.projectID })
    .update(
      {
        projectStatus: "Cancelled"
      },
    )
    .then(rows => {
      return res.status(200).send({message: "Project has been closed."});
    })
    .catch(err => {
      return res.status(400).send({ message: err });
    });
});

module.exports = router;

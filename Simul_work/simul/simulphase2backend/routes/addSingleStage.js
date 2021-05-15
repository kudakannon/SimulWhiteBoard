var router = require("./login");

router.post("/addsinglestage", function (req, res, next) {
  if (req.body.projectID == null) {
    return res.status(400).send({
        message: "Project Initialisation failed: Please enter an address.",
      });
  }
  var currentdate = new Date();
  var currentdate = new Date();
      var date =
        currentdate.getFullYear() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getDate() +
        " " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds() +
        " ";
  var responseArr = [];
  req.db
    .from("stages")
    .insert({
      projectID: req.body.projectID,
      stageName: req.body.stageName,
      stageDateCreated: date
    })
    .then((rows) => {
      return res.status(200).send({ message: responseArr });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).send({ message: "This stage name already exists." });
    });
});

module.exports = router;

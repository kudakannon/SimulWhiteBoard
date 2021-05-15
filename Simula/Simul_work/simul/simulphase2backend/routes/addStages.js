var router = require("./login");

router.post("/addstages", function (req, res, next) {
  if (req.body.projectID == null) {
    return res
      .status(400)
      .send({
        message: "Project Initialisation failed: Please enter an address",
      });
  }

  var datesArr = [];
  var newStages = [];
  for (var i = 0; i < req.body.stages.length; i++) {
    if (req.body.stages[i].name != "") {
      newStages.push(req.body.stages[i]);
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

      datesArr.push(date);
    }
  }
  var responseArr = [];
  for (var i = 0; i < newStages.length; i++) {
    req.db
      .from("stages")
      .insert({
        projectID: req.body.projectID,
        stageName: newStages[i].name,
        stageDateCreated: datesArr[i],
      })
      .then((rows) => {
        responseArr.push(rows);
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send({ message: err });
      });
  }
  return res.status(200).send({ message: responseArr });
});

module.exports = router;

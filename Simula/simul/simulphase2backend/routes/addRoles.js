var router = require("./login");

router.post("/addRoles", function (req, res, next) {
  if (req.body.projectID == null) {
    return res
      .status(400)
      .send({
        message: "Project Initialisation failed: Please enter an address",
      });
  }

  var newRole = [];
  for (var i = 0; i < req.body.roles.length; i++) {
    if (req.body.roles[i].name != "") {
      newRole.push(req.body.roles[i]);
    }
  }
  var responseArr = [];
  for (var i = 0; i < newRole.length; i++) {
    req.db
      .from("projectRoles")
      .insert({
        projectID: req.body.projectID,
        userRole: newRole[i].name,
        roleWeight: newRole[i].weight,
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

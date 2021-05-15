var router = require("./login");
var jwt = require("jsonwebtoken");

router.post("/updateroles", function (req, res, next) {
  if (req.body.projectID == null) {
    return res
      .status(400)
      .send({
        message: "Project Initialisation failed: Please enter an address",
      });
  }
  

    req
      .db("projectRoles")
      .where({
        projectID: req.body.projectID,
        userRole: req.body.oldName,
        roleWeight: req.body.oldWeight
        })
      .update({
         projectID: req.body.projectID,
        userRole: req.body.newName,
        roleWeight: req.body.newWeight
      })
      .then((rows) => {
        return res.status(200).send('sucess');
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send({ message: err });
      });
  
});

module.exports = router;

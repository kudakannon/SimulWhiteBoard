var router = require("./login");

router.post("/addroles", function (req, res, next) {
  if (req.body.projectID == null) {
    return res
      .status(400)
      .send({
        message: "Project Initialisation failed: Please enter an address",
      });
  }


  var roles = [];
  for (var i = 0; i < req.body.roles.length; i++) {
    if (req.body.roles[i].name != "") {
      roles.push(req.body.roles[i]);
    }
  }
  var responseArr = [];
  for (var i = 0; i < newRoles.length; i++) {
    console.log(roles[i].name);
    console.log(roles[i].weight);
    req.db
          .from("projectRoles")
          .select("projectID")
          .where({
            'project.projectID': req.body.projectID,
            'roleName':role[i].name
          })
          .then((rows) =>{
            
            if(rows.length == 0){
              console.log(roles[i].name);
            console.log(roles[i].weight);
          //     req.db
          //         .from("projectRoles")
          //         .insert({
          //           projectID: req.body.projectID,
          //           userRole: newRoles[i].name,
          //           roleWeight: newRoles[i].weight,
          //         })
          //         .then((rows) => {
          //           responseArr.push(rows);
          //         })
          //         .catch((err) => {
          //           console.log(err);
          //           return res.status(400).send({ message: err });
          //         });
          //   }
          //   else {
          //     console.log("this project already exists");
             }
         })
          .catch((err) => {
            return res.status(404).json({ message: err });
          });
    
  }
  return res.status(200).send({ message: responseArr });
});

module.exports = router;

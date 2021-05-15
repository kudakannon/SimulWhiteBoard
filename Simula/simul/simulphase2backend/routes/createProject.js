var router = require("./login");
const jwt = require("jsonwebtoken");
var crypto = require("crypto");
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "simulcdpinfo@gmail.com",
    pass: "SimulPassword1!",
  },
  tls: { rejectUnauthorized: true }
});

router.post("/createproject", function (req, res, next) {
  var ctID = [];
  // var updatedPW = crypto
  //   .createHash("sha256")
  //   .update(req.body.password + req.body.email)
  //   .digest("base64");

  //check if project aLready exists
  req.db
    .from("project")
    .select("projectID")
    .where("projectAddress", req.body.projectAddress)
    .then((rows) => {
      if (rows.length == 0) {
            var currentdate = new Date();
            var date = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
            req.db
              .from("project")
              .insert({
                projectAddress: req.body.projectAddress, 
                projectDateCreated: date,
                companyName: req.body.companyName,
                projectStatus: "In Progress",
                projectedCompletionDate: req.body.completionDate,
                userID: req.body.userID,
              })
              .then((rows) => {
                return res
                  .status(200)
                  .json({ projectID: rows[0], clientToken: ctID });
              })
          .catch((err) => {
            return res.status(400).json({ message: err });
          });
      } 
      else {
       console.log("this project already exists");
      }
    });
    
});

module.exports = router;

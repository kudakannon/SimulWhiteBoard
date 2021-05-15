var router = require("./login");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
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
  tls: { rejectUnauthorized: false }
});

router.post("/resetpassword", function (req, res, next) {
  var mailOptions = {
    from: "simulcdpinfo@gmail.com",
    to: req.body.email,
    subject: "Your Simul Password has been reset.",
    html: `
            <head>
        <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
      <style>
          body {
              font-family: 'Montserrat';
          }
      </style>
    </head>
    <body>
      <h5>The password has been reset</h5>
    </body>`,
  };
  if (req.body.email == null) {
    return res.status(400).send({
      message: "User Reset Password failed",
    });
  }
  //CHECKING IF TEMP PASSWORD IS CORRECT
  var oldPW = crypto
    .createHash("sha256")
    .update(req.body.oldPassword + req.body.email)
    .digest("base64");
  req.db
    .select()
    .from("users")
    .where({ userEmail: req.body.email })
    .andWhere({ userPassword: oldPW })
    .then((rows) => {
      if (rows.length == 1) {
        // USER PASSWORD IS VALIDATED
        var updatedPW = crypto
          .createHash("sha256")
          .update(req.body.password + req.body.email)
          .digest("base64");
        req
          .db("users")
          .where({ userEmail: req.body.email })
          .update({ userPassword: updatedPW })
          .then((rows) => {
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
                return res.status(400).send({message: "This email does not exist."});
              } else {
                console.log("Email sent: " + info.response);
              }
            });
            return res.status(200).send({message: "You have successfully changed your password"});
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).send({ message: err });
          });
      } else {
        res
          .status(400)
          .json({
            message: "Please ensure you are using the correct email address.",
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(400)
        .json({ message: "Temporary password was incorrect.", error: err });
    });
});

module.exports = router;

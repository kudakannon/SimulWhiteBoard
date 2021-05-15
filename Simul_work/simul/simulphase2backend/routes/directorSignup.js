var router = require("./login");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "simulcdpinfo@gmail.com",
    pass: "SimulPassword1!",
  },
  tls: { rejectUnauthorized: false },
});

router.post("/directorregister", function (req, res, next) {
  if (req.body.password == null) {
    return res.status(400).send({ message: "Error. Password is required" });
  }
  if (req.body.email == null) {
    return res.status(400).send({ message: "Error. Email is required" });
  }
  if (req.body.phone == null) {
    return res.status(400).send({ message: "Error. Phone is required" });
  }
  if (req.body.name == null) {
    return res.status(400).send({ message: "Error. Name is required" });
  }

  req.db
    .from("users")
    .select()
    .where({
      userEmail: req.body.email.toLowerCase(),
    })
    .then((rows) => {
      if (rows.length != 0) {
        res.status(400).json({
          Error: true,
          Message: "This email address is already used for a user account",
        });
      } else {
        var updatedPW = crypto
          .createHash("sha256")
          .update(req.body.password + req.body.email)
          .digest("base64");
        req.db
          .from("directors")
          .insert({
            directorName: req.body.name,
            directorPhone: req.body.phone,
            directorEmail: req.body.email.toLowerCase(),
            directorPassword: updatedPW,
          })
          .then((rows) => {
            //EMAIL CONFIRMATION
            var mailOptions = {
              from: "stephen.horsburgh1@gmail.com",
              to: req.body.email,
              subject: "Director Account Email Confirmation",
              html: `
                      <head>
                  <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
                  <style>
                    body {
                        font-family: 'Montserrat';
                    }
                    .contact a {
                      color:black!important; 
                      text-decoration:underline!important;
                    }
                    link a {
                      background-color: #de4442;
                      border: none;
                      color: white!important;
                      padding: 15px 32px;
                      text-align: center;
                      text-decoration: none;
                      display: inline-block;
                      font-size: 16px;
                      margin: 4px 2px;
                    }
                    .link a:hover {
                      background-color: #b62825;
                    }
                  </style>
              </head>
              <body>
                <h1>Welcome ${req.body.name}!</h1>
                <p>Please confirm your Director account - <span class="contact">${req.body.email}</span> by clicking the link below</p> 
                <span class="link"><a href="http://simulcdp.com.s3-website-ap-southeast-2.amazonaws.com/" class="button">Confirm Email</a></link>
              </body>`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
                console.log("");
                console.log(info);
                return res
                  .status(400)
                  .send({ message: "This email does not exist." });
              } else {
                console.log("Email sent: " + info.response);

                const userId = rows[0];
                const accessToken = jwt.sign(
                  { user: req.body.email + updatedPW, token: userId },
                  "helloKey",
                  { expiresIn: "24h" }
                );
                const resp = {
                  status: "success",
                  token: accessToken,
                };
                return res.status(200).send(resp);
              }
            });
          })
          .catch((err) => {
            console.log(err);
           
            return res.status(400).send({ Error: true, Message: err });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      
      return res.status(400).send({ Error: true, Message: err });
    });
});

module.exports = router;

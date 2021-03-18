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

router.post("/register", function (req, res, next) {
  //CHECK DIRECTOR ID USING EMAIL FIRST
  req.db
    .from("directors")
    .select("directorID")
    .where({
      directorEmail: req.body.directorEmail,
    })
    .then((directorRows) => {
      // RETURN ERROR IF DIRECTOR DOESN'T EXIST
      if (directorRows.length == 0) {
        res
          .status(400).send({message:
              "We could not find your director's account. Please contact your director and ensure you are entering the correct credentials.",
          });
      } 
      // REGISTER USER IF DIRECTOR EXISTS
      else {
        var updatedPW = crypto
          .createHash("sha256")
          .update(req.body.password + req.body.email)
          .digest("base64");
        req.db
          .from("users")
          .insert({
            userName: req.body.name,
            userPhone: req.body.phone,
            userEmail: req.body.email.toLowerCase(),
            userPassword: updatedPW,
          })

          .then((rows) => {
            //EMAIL CONFIRMATION PARAMS
            var mailOptions = {
              from: "simulcdpinfo@gmail.com",
              to: req.body.email,
              subject: "Email Confirmation",
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
                    .link a {
                      background-color: #de4442;
                      border: none;
                      padding: 15px 32px;
                      text-align: center;
                      text-decoration: none;
                      display: inline-block;
                      font-size: 16px;
                      margin: 4px 2px;
                      color:white!important;
                    }
                    .link a:hover {
                        background-color: #b62825;
                        color:white!important;
                      }
                </style>
              </head>
              <body>
                <h1>Welcome ${req.body.name}!</h1>
                <p>Please confirm you email account - <span class="contact">${req.body.email}</span> by clicking the link below</p> 
                <span class="link"><a href="http://simulcdp.com.s3-website-ap-southeast-2.amazonaws.com/" class="button">Confirm Email</a></span>
              </body>`,
            };

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

            // LINK USER AND DIRECTOR
            req.db
              .from("directorUsers")
              .insert({
                directorID: directorRows[0].directorID,
                userID: userId,
              })
              .then((rows) => {
                // SEND EMAIL FOR CONFIRMATION
                // RETURN THE TOKEN GENERATED WHEN USER IS CREATED
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    console.log(error);
                    console.log(mailOptions);
                    return res.status(400).send({message: "This email does not exist."} );
                  } else {
                    console.log("Email sent: " + info.response);
                    return res.status(200).send(resp);
                  }
                });
              });
          })

          .catch((err) => {
            console.log(err);
            return res.status(400).send({
              message:
                "Error. Please check your credentials are correct. It looks like that user already exists.",
            });
          });
      }
    });
});

module.exports = router;

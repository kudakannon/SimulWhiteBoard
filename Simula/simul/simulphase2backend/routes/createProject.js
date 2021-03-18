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
  tls: { rejectUnauthorized: false }
});

router.post("/createproject", function (req, res, next) {
  var ctID = [];
  var updatedPW = crypto
    .createHash("sha256")
    .update(req.body.password + req.body.email)
    .digest("base64");

  //check if client aLready exists
  req.db
    .from("users")
    .select("userID")
    .where("userEmail", req.body.email)
    .then((rows) => {
      if (rows.length == 0) {
        req.db
          .from("users")
          .insert({
            userName: req.body.name,
            userPhone: req.body.phone,
            userEmail: req.body.email,
            userPassword: updatedPW,
          })
          .then((moreRows) => {
            var mailOptions = {
              from: "simulcdpinfo@gmail.com",
              to: req.body.email,
              subject: "Your Simul Account has been created.",
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
                    .credentials {
                        padding: 20px;
                        border: 1px solid #ccc!important;
                        border-radius: 8px;
                    }
                </style>
              </head>
              <body>
                <h1>Welcome ${req.body.name}!</h1>
                <p>Please login using the following credentials</p>
                <div class="credentials">
                <p>Email: <span class="contact">${req.body.email}</span></p> 
                <p>Temporary Password: ${req.body.password}</p>
                </div>
                <br /><b>There will be a prompt to reset your password</b><br /><br />
                <span class="link"><a href="http://simulcdp.com.s3-website-ap-southeast-2.amazonaws.com/resetpassword" class="button">Login</a></span>
              </body>`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
                return res.status(400).json({message: "This email does not exist."});
              }
            });
            ctID.push(moreRows[0]);

            var currentdate = new Date();
            var date = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
            req.db
              .from("directorUsers")
              .select("directorID")
              .where({
                userID: req.body.userID,
              })
              .then((rows) => {
                req.db
                  .from("project")
                  .insert({
                    projectAddress: req.body.projectAddress,
                    projectDateCreated: date,
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
                    console.log(err);
                    return res.status(400).json({ message: err });
                  });
              });
          })
          .catch((err) => {
            return res.status(400).json({ message: err });
          });
      } 
      else {
        ctID.push(rows[0].userID);
        var currentdate = new Date();
        var date = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
        req.db
          .from("directorUsers")
          .select("directorID")
          .where({
            userID: req.body.userID,
          })
          .then((rows) => {
            req.db
              .from("project")
              .insert({
                projectAddress: req.body.projectAddress,
                projectDateCreated: date,
                projectStatus: "In Progress",
                projectedCompletionDate: req.body.completionDate,
                userID: req.body.userID,
              })

              .then((rows) => {
                var mailOptions = {
                  from: "simulcdpinfo@gmail.com",
                  to: req.body.email,
                  subject: "You have been added to a Simul Project",
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
                        .credentials {
                            padding: 20px;
                            border: 1px solid #ccc!important;
                            border-radius: 8px;
                        }
                    </style>
                  </head>
                  <body>
                    <h1>Hey ${req.body.name}!</h1>
                    <p>You have been added to the following project:</p>
                    <div>
                        <h4>${req.body.projectAddress}</h4>
                    </div>
                    <p>Access this project by logging in and navigating to the Projects page.</p> 
                    <span class="link"><a href="http://simulcdp.com.s3-website-ap-southeast-2.amazonaws.com/login" class="button">Login</a></span>
                  </body>`,
                      }
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    console.log(error);
                    return res.status(400).json({message: "This email does not exist."});
                  }
                });
                return res.status(200).json({ projectID: rows[0], clientToken: ctID });
              })
              .catch((err) => {
                console.log(err);
                return res.status(400).json({ message: err });
              });
          });
      }
    });
});

module.exports = router;

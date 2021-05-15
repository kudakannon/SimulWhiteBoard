var router = require("./login");
var crypto = require("crypto");
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "simulcdpinfo@gmail.com",
    pass: "SimulPassword1!"
  },
  tls: { rejectUnauthorized: false }
});

router.post("/directorforgotpassword", function(req, res, next) {
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
          <h1>Hi !</h1>
          <p>Please login using the following credentials</p>
          <div class="credentials">
          <p>Email: <span class="contact">${req.body.email}</span></p> 
          <p>Temporary Password: ${req.body.password}</p>
          </div>
          <br /><b>There will be a prompt to reset your password</b><br /><br />
          <span class="link"><a href="http://simulcdp.com.s3-website-ap-southeast-2.amazonaws.com/directorresetpassword" class="button">Login</a></span>
        </body>`
  };
  req.db
  .from('directors')
  .select('directorID', 'directorName', 'directorPhone', 'directorEmail')
  .where('directorEmail', req.body.email)
  .then((rows) => {
      if(rows.length == 0) {
        return res.status(400).send({ message: "This email doesn't exist."});
      } else {
          var tempPW = crypto.createHash('sha256').update(req.body.password+req.body.email).digest('base64');
          req
          .db("directors")
          .where({ directorEmail: req.body.email })
          .update({ directorPassword: tempPW })
          .then(rows => {
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                  return res.status(400).send({message: "This email does not exist."});
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
            return res.status(200).send({message: "Email sent"})
          })
          .catch(err => {
            console.log(err);
            return res.status(400).send({ message: err });
          });
      }
  })
  .catch((err) => {
    res.json({"Error" : true, "Message" : "Error in MySQL query"})
  })
});

module.exports = router;

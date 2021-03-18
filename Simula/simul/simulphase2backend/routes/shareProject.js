var router = require("./login");
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

router.post("/shareproject", function (req, res, next) {
  if (req.body.projectInfo.title == null) {
    return res.status(400).send({
      message: "Project Initialisation failed: Couldn't find an address."
    });
  }
  req.db
    .from("projectAccess")
    .insert({
      projectID: req.body.projectInfo.projectID,
      sharedEmail: req.body.sharedEmail,
      userID: req.body.user.userID,
    })
    .then((rows) => {
        var mailOptions = {
            from: "simulcdpinfo@gmail.com",
            to: req.body.sharedEmail,
            subject: `${req.body.user.userName} shared a Simul project with you`,
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
                    <h1>Welcome ${req.body.sharedName}!</h1>
                    <p>${req.body.user.userName} shared a project with you!</p>
                    <div>
                        <h4>${req.body.projectInfo.title}</h4>
                        <p>was shared to <span class="contact">${req.body.sharedEmail}</span>.</p>
                    </div>
                    <p>Access this project by clicking the link below and entering your email.</p> 
                    <span class="link"><a href="http://simulcdp.com.s3-website-ap-southeast-2.amazonaws.com/sharedproject?project=${req.body.projectInfo.projectID}&address=${req.body.projectInfo.title}" class="button">Get Access</a></span>
                  </body>`
                };
    
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              return res.status(400).send({message: "This email does not exist."});
            } else {
              console.log("Email sent: " + info.response);
            }
        })
      return res.status(200).send({ message: "Project shared successfully"});
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).send({ message: err });
    });
});

module.exports = router;

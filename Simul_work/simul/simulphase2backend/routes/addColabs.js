var router = require('./login');
var jwt = require('jsonwebtoken');
var password;


router.post('/addcolabs', function(req, res, next) {
    //TOKEN VERIFICATION
    // var decoded;
  // try {
  //   var tok = req.headers.authorization.slice(7);
  //   decoded = jwt.verify(tok, 'helloKey');
  // }
  // catch(err) {
  //   return res.status(400).send({"message": JSON.stringify(err)});
  // }
  req.db.from('users')
  .select('userID')
  .where('userEmail', req.body.userEmail)
  .then((rows) => {
    if(rows==0){
      req.db
      .from("users")
      .insert({
        userName: req.body.userName,
        userPhone: req.body.phone,
        userEmail: req.body.userEmail,
        userPassword: Math.random().toString(36).slice(-8)
      })
      .then((moreRows) => {
        var mailOptions = {
          from: "simulcdpinfo@gmail.com",
          to: req.body.userEmail,
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
            <h1>Welcome ${req.body.userName}!</h1>
            <p>Please login using the following credentials</p>
            <div class="credentials">
            <p>Email: <span class="contact">${req.body.userEmail}</span></p> 
            <p>Temporary Password: ${password}</p>
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

      })
      .catch((err) => {
        return res.status(400).json({ message: err });
      });
    }
    else{
      console.log("there")
      var userid= req.db.from('users').select('userID').where('userEmail', req.body.userEmail);
      req.db.from('collaborators')
      .insert({

          projectID: req.body.userRole,
          userID: userid.userID,
          userRole: req.body.userRole,

      })
      .then((morerows) => {
        
        responseArr.push(morerows);
      })
      .catch((err) => {
      
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

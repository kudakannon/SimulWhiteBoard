var router = require('./login');
var jwt = require('jsonwebtoken');


router.get('/users/me', function(req, res, next) {
    //TOKEN VERIFICATION
    var decoded;
  try {
    var tok = req.headers.authorization.slice(7);
    decoded = jwt.verify(tok, 'helloKey');
  }
  catch(err) {
    return res.status(400).send({"message": JSON.stringify(err)});
  }
  var userEmail = decoded.user;
  if(decoded.userType == "director") {
    var userID = decoded.token
    req.db
    .from('directors')
    .select('directorID AS userID', 'directorName AS userName', 'directorPhone AS userPhone', 'directorEmail AS userEmail')
    .where('directorID', userID)
    .then((rows) => {
      var response = {
        userType: "director",
        userID: rows[0].userID,
        userName: rows[0].userName,
        userEmail: rows[0].userEmail,
        userPhone: rows[0].userPhone
      }
      res.json({"user" : response})
    })
    .catch((err) => {
      return res.status(401).send({"Error" : true, "Message" : err})
    })
  }
  else if(decoded.userType == "readAccess") {
    req.db
    .from('projectAccess')
    .select('sharedEmail AS email', 'accessID')
    .where('sharedEmail', userEmail)
    .then((rows) => {
      var response = {
        userType: "readAccess",
        accessID: rows[0].accessID,
        userEmail: rows[0].email,
      }
      res.json({"user" : response})
    })
    .catch((err) => {
      return res.status(401).send({"Error" : true, "Message" : err})
    })
  }
  else {
    var userID = decoded.token

  req.db.from('users').select('userID', 'userName', 'userPhone', 'userEmail').where('userID', userID)
  .then((rows) => {
    var response = {
      userType: "user",
      userID: rows[0].userID,
      userName: rows[0].userName,
      userEmail: rows[0].userEmail,
      userPhone: rows[0].userPhone
    }
    res.json({"user" : response})
  })
  .catch((err) => {
    res.json({"Error" : true, "Message" : "Error in MySQL query"})
  })
}
});

module.exports = router;

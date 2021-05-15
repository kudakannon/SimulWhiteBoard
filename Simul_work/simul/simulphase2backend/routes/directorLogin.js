var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

// POST REQUEST FOR LOGIN
router.post('/directorlogin', function(req, res, next) {
  var updatedPW = crypto.createHash('sha256').update(req.body.password+req.body.email).digest('base64');
  if (!req.body.email || !updatedPW) {
    return res.status(401).send({message: "Invalid Login: Incorrect Email or Password."})
  }

  req.db.from('directors').where({directorEmail: req.body.email}).andWhere({directorPassword: updatedPW})
  .then((rows) => {
    if(rows.length == 0){
      return res.status(401).send({message: "Invalid Login: Incorrect Email or Password."})
    }
    else {
      const userId = rows[0].userID;
      const accessToken = jwt.sign({user: req.body.email+updatedPW, token: userId}, 'helloKey', {expiresIn: "24h"});
      const resp = {
        status: 'success',
        token: accessToken
      }
      return res.status(200).send(resp);
    }
  })
  .catch((err) => {
    console.log(err);
    res.json({"Error" : true, "Message" : "Error in MySQL query"})
  })
});


module.exports = router;

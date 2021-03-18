var router = require('./login');
const jwt = require('jsonwebtoken');

router.post('/addcollabs', function(req, res, next) {
    if (req.body.projectID == null) {
      return res.status(400).send({message: "Project Initialisation failed: Please enter an address"})
    }
    const tok = req.headers.authorization.slice(7);
    var userID = jwt.verify(tok, 'helloKey').token;
    var collabs = [userID, req.body.clientID]
    var responseArr = [];
    for(var i=0; i < 2; i++ ) {
            req.db.from('collaborators').insert({
                projectID: req.body.projectID,
                userID: collabs[i]              
            })
              .then((rows) => {
                responseArr.push(rows);
              })
              .catch((err) => {
                console.log(err);
                return res.status(400).send({message: err})
              })
        }
    return res.status(200).send({message: responseArr})
  });
  
  module.exports = router;

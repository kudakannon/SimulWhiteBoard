var router = require('./login');


router.get('/getcolabs', function(req, res, next) {
    //SEARCHING THE DATABASE
    var addr = req.body.projectID;
     //addr = addr.replace(/-/g, ' ');
    req.db.from('collaborators')
    .join('projectRoles','collaborators.userRole','=','projectRoles.userRole','AND', 'collaborators.projectID', '=', 'projectRoles.projectID' )
    .join('users', 'collaborators.userID', '=', 'users.userID')
    .select('projectRoles.userRole', 'projectRoles.roleWeight', 'users.userEmail')
    .where({
        'collaborators.projectID': 1,
        
        
      })
    .then((rows) => {
      
        return res.status(200).send(rows)
      
        
      })
      .catch((err) => {
        console.log(err)
        return res.status(400).send({"Error" : true, "Message" : err})
      })
    });

  module.exports = router;

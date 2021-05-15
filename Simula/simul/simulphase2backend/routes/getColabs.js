var router = require('./login');


router.get('/getcolabs', function(req, res, next) {
    //SEARCHING THE DATABASE
    var addr = req.body.projectID;
     //addr = addr.replace(/-/g, ' ');

    req.db.from('collaborators')
    .join('projectRoles', 'collaborators.projectID', '=', 'projectRoles.projectID','AND','collaborators.userRole','=','projectRoles.userRole')
    .join('users', 'collaborators.userID', '=', 'users.userID')
    .select('projectRoles.projectID', 'projectRoles.userRole', 'projectRoles.roleWeight', 'users.userEmail', 'users.userName')
    .where({
        'collaborators.projectID': 46,
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

var router = require('./login');


router.get('/getroles', function(req, res, next) {
    //SEARCHING THE DATABASE
    var addr = req.body.projectAddress;
     //addr = addr.replace(/-/g, ' ');

    req.db.from('projectRoles')
    .join('project', 'projectRoles.projectID', '=', 'project.projectID')
    .select('project.projectID', 'project.projectAddress', 'projectRoles.userRole', 'projectRoles.roleWeight')
    .where({
        // 'project.projectAddress': addr,
        'project.projectID': 1,
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

var router = require('./login');

router.get('/getprojectdetails', function(req, res, next) {
    //SEARCHING THE DATABASE
    //var addr = req.query.address;
    // addr = addr.replace(/-/g, ' ');

    req.db.from('project')
    .join('collaborators', 'project.projectID', '=', 'collaborators.projectID')
    .join('users', 'collaborators.userID', '=', 'users.userID')    
    .select('users.userID', 'users.userName', 'users.userEmail', 'users.userPhone', 'project.projectID', (req.db.raw(`DATE_FORMAT(project.projectDateCreated,'%d/%m/%Y %h:%i:%s %p') AS dateCreated`)), 'project.projectAddress', 'project.projectStatus', (req.db.raw(`project.userID AS projectOwner`)))
    .where({
        'project.projectAddress': 1,

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

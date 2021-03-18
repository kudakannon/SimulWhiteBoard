var router = require('./login');


router.get('/getstages', function(req, res, next) {
    //SEARCHING THE DATABASE
    var addr = req.query.address;
    addr = addr.replace(/-/g, ' ');

    req.db.from('stages')
    .join('project', 'stages.projectID', '=', 'project.projectID')
    .select('project.projectID', 'project.projectAddress', 'stages.stageName', (req.db.raw(`DATE_FORMAT(stages.stageDateCreated,'%d/%m/%Y %h:%i:%s %p') AS dateCreated`)), 'stages.stageDateCommenced', 'stages.dateCompleted', 'stages.stageProjectedCompletionDate')
    .where({
        'project.projectAddress': addr,
      })
    .orderBy("dateCreated", "asc")

    .then((rows) => {
        return res.status(200).send(rows)
      })
      .catch((err) => {
        console.log(err)
        return res.status(400).send({"Error" : true, "Message" : err})
      })
    });

  module.exports = router;

var router = require('./login');

router.get('/getpinterestinfo', function(req, res, next) {
    //SEARCHING THE DATABASE
    req.db.from('pinterestBoards')
    .join('project', 'pinterestBoards.projectID', '=', 'project.projectID')
    .join('users', 'pinterestBoards.userID', '=', 'users.userID')    
    .select('pinterestBoards.boardOwner', 'pinterestBoards.boardName', 'users.userName')
    .where({
        'project.projectID': req.query.project,
      })
    .then((rows) => {
        return res.status(200).send(rows)
      })
      .catch((err) => {
        return res.status(400).send({"Error" : true, "Message" : err})
      })

    });

  module.exports = router;

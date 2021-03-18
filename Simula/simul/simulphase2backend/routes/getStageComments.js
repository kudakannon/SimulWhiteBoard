var router = require("./login");

router.get("/getstagecomments", function (req, res, next) {
  var stageNames = [];
  req.db
    .distinct()
    .from("stageComments")
    .pluck("stageName")
    .where("stageComments.projectID", req.query.project)
    .then((rows) => {
      stageNames = rows
    });
  req.db
    .from("stageComments")
    .join("users", "stageComments.userID", "=", "users.userID")
    .select(
      req.db.raw(
        `DATE_FORMAT(stageComments.stageCommentCreated,'%d/%m/%Y %h:%i:%s %p') AS dateCreated`
      ),
      "stageComments.stageComment",
      "stageComments.stageName",
      "users.userName"
    )
    .where("stageComments.projectID", req.query.project)
    .orderBy("stageComments.stageCommentCreated", "desc")
    .then((rows) => {
      var result = []
      for(var i = 0; i < stageNames.length; i++) {
        var stageRes = []
        for(var j = 0; j < rows.length; j++) {
          if(rows[j].stageName == stageNames[i]) {
            stageRes.push({
              dateCreated: rows[j].dateCreated,
              stageComment: rows[j].stageComment,
              stageName: rows[j].stageName,
              userName: rows[j].userName
            })
          }
        }
        result[i] = stageRes
      }
      return res.status(200).send(result);
    })
    .catch(err => {
      console.log(err)
      return res.status(400).send({ Error: true, Message: err });
    })
});

module.exports = router;

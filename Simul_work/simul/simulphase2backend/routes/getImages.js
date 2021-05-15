var router = require("./login");
const AWS = require('aws-sdk');
var s3 = new AWS.S3();

router.get("/getimages", function(req, res, next) {
  req.db
    .from("projectImages")
    .select()
    .where("projectID", req.query.project)
    .orderBy("imageDateCreated", "desc")
    .then(rows => {
      var params = {
        Bucket: 'simul-project-images', 
        Key: rows[0].imageKey, 
        Expires: 60
      };
      var url = s3.getSignedUrl('getObject', params);
      return res.status(200).send({imageUrl: url});
    })
    .catch(err => {
      var params = {
        Bucket: 'simul-project-images', 
        Key: "newProject.png", 
        Expires: 60
      };
      var url = s3.getSignedUrl('getObject', params);
      return res.status(200).send({imageUrl: url})
    });
});

module.exports = router;

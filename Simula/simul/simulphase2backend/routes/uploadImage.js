var router = require('./login');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

var multer  = require('multer');
var multerS3 = require('multer-s3');

var s3 = new AWS.S3();
var date;

var cloudStorage = multerS3({
    s3: s3,
    bucket: "simul-project-images",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function(request, file, ab_callback) {
        ab_callback(null, {fieldname: file.fieldname});
    },
    key: function(req, file, ab_callback) {
        var foldername = req.headers.referer.split("?");
        foldername = foldername[1].replace("project=", "").replace("&address=", "-").toLowerCase();
        var currentdate = new Date();
        date = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1) 
        + "-" + currentdate.getDate() + " " 
        + currentdate.getHours() + ":" 
        + currentdate.getMinutes() + ":" + currentdate.getSeconds();
        var newFileName = foldername + "/" + date + "/" + file.originalname;
        ab_callback(null, newFileName);
    },
});
var upload = multer({
    storage: cloudStorage
});

router.post('/uploadimage', upload.single('file'), function(req, res, next) {
  if(!req.file) {
    return res.status(500);
  }
  var projID = req.headers.referer.split("?");
  projID = projID[1].split('&')
  projID = projID[0].split('=');
  projID = projID[1]
  req.db.from('projectImages').insert({
    projectID: projID,
    imageKey: req.file.key,
    imageDateCreated: date,
  })
  .then((rows) => {
    var params = {
      Bucket: 'simul-project-images', 
      Key: req.file.key, 
      Expires: 60
    };
    var url = s3.getSignedUrl('getObject', params);
    return res.status(200).send({imageUrl: url});
  })
  .catch((err) => {
    console.log(err);
    return res.status(400).send({message: err})
  })
});
      
  module.exports = router;
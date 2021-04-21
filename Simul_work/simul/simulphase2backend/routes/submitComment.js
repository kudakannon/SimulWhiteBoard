var router = require("./login");
const jwt = require("jsonwebtoken");

router.post("/submitcomment", function (req, res, next) {
  if (req.body.projectID == null) {
    return res.status(400).send({
      message: "Project Initialisation failed: Please enter an address",
    });
  }
  const tok = req.headers.authorization.slice(7);
  var decoded = jwt.verify(tok, "helloKey");
  var userID = decoded.token;
  var currentdate = new Date();
  var date =
    currentdate.getFullYear() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getDate() +
    " " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds() +
    " ";
  req.db
    .from("stageComments")
    .insert({
      projectID: req.body.projectID,
      userID: userID,
      stageName: req.body.stageName,
      stageComment: req.body.comment,
      stageCommentCreated: date,
    })
    .then((rows) => {
      var time = currentdate.toLocaleString([], { hour12: true }).split(", ");
      return res.status(200).send({ created: time[0] + " " + time[1] });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).send({ message: err });
    });
});

module.exports = router;

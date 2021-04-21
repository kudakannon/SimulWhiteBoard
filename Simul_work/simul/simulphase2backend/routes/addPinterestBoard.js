var router = require("./login");

router.post("/addpinterestboard", function (req, res, next) {
  //CHECK IF BOARD ALREADY EXISTS
  var newName = req.body.boardName.charAt(0).toUpperCase() + req.body.boardName.substring(1);
  req.db
    .from("pinterestBoards")
    .select("boardOwner", "boardName", "projectID")
    .where({
      boardOwner: req.body.boardOwner,
      projectID: req.body.projectID,
      boardName: newName,
    })
    .then((rows) => {
      if (rows.length == 0) {
        req.db
          .from("pinterestBoards")
          .insert({
            projectID: req.body.projectID,
            userID: req.body.userID,
            boardOwner: req.body.boardOwner,
            boardName: newName,
          })
          .then((rows) => {
            return res.status(200).send(rows);
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).send({ message: err });
          });
      } else {
        return res.status(400).send({ message: "Sorry, that board has already been added to the project!" });
      }
    });
});

module.exports = router;

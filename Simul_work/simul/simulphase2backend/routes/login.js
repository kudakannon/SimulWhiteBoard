var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var crypto = require("crypto");

// POST REQUEST FOR LOGIN
router.post("/login", function (req, res, next) {
  var updatedPW = crypto
    .createHash("sha256")
    .update(req.body.password + req.body.email)
    .digest("base64");
  if (!req.body.email || !updatedPW) {
    return res.status(401).send({ message: "Invalid Login: Incorrect Email or Password." });
  }
  if (req.body.userType == "director") {
    req.db
      .from("directors")
      .where({ directorEmail: req.body.email })
      .andWhere({ directorPassword: updatedPW })
      .then((rows) => {
        if (rows.length == 0) {
          return res.status(401).send({ message: "Invalid Login: Incorrect Email or Password." });
        } else {
          const userId = rows[0].directorID;
          const accessToken = jwt.sign(
            {
              user: req.body.email + updatedPW,
              token: userId,
              userType: "director",
            },
            "helloKey",
            { expiresIn: "24h" }
          );
          const resp = {
            status: "success",
            token: accessToken,
          };
          return res.status(200).send(resp);
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ Error: true, Message: "Error in MySQL query" });
      });
  } 
  else if(req.body.userType == "readAccess") {
    req.db
      .from("projectAccess")
      .where({ projectID: req.body.projectID })
      .andWhere({ sharedEmail: req.body.email })
      .then((rows) => {
        if(rows.length == 0) {
          return res.status(400).send({message: "Error. This email hasn't been given permission to access this project"})
        }
        else {
          const userId = rows[0].sharedEmail+req.body.projectID;
          const accessToken = jwt.sign(
            {
              user: req.body.email,
              token: userId,
              userType: "readAccess",
            },
            "helloKey",
            { expiresIn: "24h" }
          );
          const resp = {
            status: "success",
            token: accessToken,
          };
          return res.status(200).send(resp);
        }
      })
      .catch(err => {
        return res.status(400).send(err)
      })
  }
  else {
    req.db
      .from("users")
      .where({ userEmail: req.body.email })
      .andWhere({ userPassword: updatedPW })
      .then((rows) => {
        if (rows.length == 0) {
          return res.status(404).send({ message: "Invalid Login: Incorrect Email or Password." });
        } else {
          const userId = rows[0].userID;
          const accessToken = jwt.sign(
            {
              user: req.body.email + updatedPW,
              token: userId,
              userType: "user",
            },
            "helloKey",
            { expiresIn: "24h" }
          );
          const resp = {
            status: "success",
            token: accessToken,
          };
          return res.status(200).send(resp);
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ Error: true, Message: "Error in MySQL query" });
      });
  }
});

module.exports = router;

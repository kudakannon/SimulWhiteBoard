var router = require("./login");
var jwt = require("jsonwebtoken");

router.post("/updatedetails", function (req, res, next) {
  if (req.body.name == "") {
    return res.status(400).send({ message: "Error. Name is required" });
  }
  if (req.body.email == "") {
    return res.status(400).send({ message: "Error. Email is required" });

  }
  if (req.body.phone == "") {
    return res.status(400).send({ message: "Error. Phone is required" });
  }
  var decoded;
  try {
    tok = req.headers.authorization.slice(7);
    decoded = jwt.verify(tok, "helloKey");
  } catch {
    res
      .status(401)
      .json({
        message: "oh no! it looks like your authorization token is invalid...",
      });
  }

  if (decoded.userType == "director") {
    req
      .db("directors")
      .where({ directorID: decoded.token })
      .update({
        directorName: req.body.name,
        directorEmail: req.body.email,
        directorPhone: req.body.phone,
      })
      .then((rows) => {
        const resp = {
          status: "success",
          user: rows,
        };
        return res.status(200).send(resp);
      })
      .catch((err) => {
        console.log(err);
        res
          .status(400)
          .json({
            message:
              "Error. Please check your credentials are correct. It looks like that user already exists.",
          });
      });
  } else {
    req
      .db("users")
      .where({ userID: decoded.token })
      .update({
        userName: req.body.name,
        userEmail: req.body.email,
        userPhone: req.body.phone,
      })
      .then((rows) => {
        const resp = {
          status: "success",
          user: rows,
        };
        return res.status(200).send(resp);
      })
      .catch((err) => {
        console.log(err);
        res
          .status(400)
          .json({
            message:
              "Error. Please check your credentials are correct. It looks like that user already exists.",
          });
      });
  }
});

module.exports = router;

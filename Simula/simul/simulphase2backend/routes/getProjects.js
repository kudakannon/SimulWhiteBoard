var router = require("./login");
const jwt = require("jsonwebtoken");

router.get("/projects", function (req, res, next) {
  //TOKEN VERIFICATION
  var tok;
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
  if(decoded.userType == "director") {
    req.db
    .from("project")
    .join("users", "project.userID", "=", "users.userID")
    .join("directorUsers", "project.userID", "=", "directorUsers.userID")
    .select(
      req.db.raw(
        `DATE_FORMAT(projectDateCreated,'%d/%m/%Y %h:%i:%s %p') AS projectDateCreated`
      ),
      'users.userName AS createdBy',
      "projectAddress",
      "projectStatus",
      "project.projectID",
    )
    .where("directorUsers.directorID", decoded.token)
    .orderBy('project.projectID', 'desc')
    .then((rows) => {
      var completedProjects = []
      var cancelledProjects = []
      var pausedProjects = []
      var currentProjects = []
      for (var i = 0; i < rows.length; i++) {
        if(rows[i].projectStatus == "Completed") {
          completedProjects.push(rows[i])
        }
        else if(rows[i].projectStatus == "Cancelled") {
          cancelledProjects.push(rows[i])
        }
        else if(rows[i].projectStatus == "Paused") {
          pausedProjects.push(rows[i])
        }
        else {
          currentProjects.push(rows[i])
        }
      }
      
      var response = {
        currentProjects: currentProjects,
        completedProjects: completedProjects,
        cancelledProjects: cancelledProjects,
        pausedProjects: pausedProjects,
      }
      return res.status(200).send({ response });
    })
    .catch((err) => {
      return res.status(400).send({ Error: true, Message: err });
    });
  }
  else if(decoded.userType == "readAccess") {
    req.db
    .from("projectAccess")
    .join("project", "projectAccess.projectID", "=", "project.projectID")
    .join("users", "project.userID", "=", "users.userID")
    .select(
      req.db.raw(
        `DATE_FORMAT(project.projectDateCreated,'%d/%m/%Y %h:%i:%s %p') AS projectDateCreated`
      ),
      'users.userName AS createdBy',
      "project.projectAddress",
      "project.projectStatus",
      "project.projectID",
    )
    .where("projectAccess.sharedEmail", decoded.user)
    .orderBy('project.projectID', 'desc')
    .then((rows) => {
      var completedProjects = []
      var cancelledProjects = []
      var pausedProjects = []
      var currentProjects = []
      for (var i = 0; i < rows.length; i++) {
        if(rows[i].projectStatus == "Completed") {
          completedProjects.push(rows[i])
        }
        else if(rows[i].projectStatus == "Cancelled") {
          cancelledProjects.push(rows[i])
        }
        else if(rows[i].projectStatus == "Paused") {
          pausedProjects.push(rows[i])
        }
        else {
          currentProjects.push(rows[i])
        }
      }
      
      var response = {
        currentProjects: currentProjects,
        completedProjects: completedProjects,
        cancelledProjects: cancelledProjects,
        pausedProjects: pausedProjects,
      }
      return res.status(200).send({ response });
    })
    .catch(err => {
      console.log(err)
      return res.status(400).send({ message: err });
    });
  }
  else {
  //SEARCHING THE DATABASE
  req.db
    .from("project")
    .join("collaborators", "project.projectID", "=", "collaborators.projectID")
    .join("users", "collaborators.userID", "=", "users.userID")
    .select(
      req.db.raw(
        `DATE_FORMAT(projectDateCreated,'%d/%m/%Y %h:%i:%s %p') AS projectDateCreated`
      ),
      "projectAddress",
      "projectStatus",
      "project.projectID"
    )
    .where("collaborators.userID", decoded.token)
    .orderBy(req.db.raw(`UNIX_TIMESTAMP(projectDateCreated)`), 'desc')

    .then((rows) => {
      var completedProjects = []
      var cancelledProjects = []
      var pausedProjects = []
      var currentProjects = []
      for (var i = 0; i < rows.length; i++) {
        if(rows[i].projectStatus == "Completed") {
          completedProjects.push(rows[i])
        }
        else if(rows[i].projectStatus == "Cancelled") {
          cancelledProjects.push(rows[i])
        }
        else if(rows[i].projectStatus == "Paused") {
          pausedProjects.push(rows[i])
        }
        else {
          currentProjects.push(rows[i])
        }
      }
      
      var response = {
        currentProjects: currentProjects,
        completedProjects: completedProjects,
        cancelledProjects: cancelledProjects,
        pausedProjects: pausedProjects,
      }
      return res.status(200).send({ response });
    })
    .catch((err) => {
      return res.status(400).send({ Error: true, Message: err });
    });
  }
  });
module.exports = router;

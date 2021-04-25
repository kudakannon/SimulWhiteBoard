--DROP DATABASE simul;
CREATE DATABASE simul;
USE simul;

CREATE TABLE directors (
	directorID INT AUTO_INCREMENT,
    directorName VARCHAR(60) NOT NULL,
    directorPhone VARCHAR(20) NOT NULL,
    directorEmail VARCHAR(60) NOT NULL UNIQUE,
    directorPassword VARCHAR(255) NOT NULL,
    PRIMARY KEY(directorID)
    );


CREATE TABLE users (
	userID INT AUTO_INCREMENT NOT NULL,
    userName VARCHAR(60) NOT NULL,
    userPhone VARCHAR(20) NOT NULL,
    userEmail VARCHAR(60) NOT NULL UNIQUE,
    userPassword VARCHAR(255) NOT NULL,
    PRIMARY KEY(userID)
    );

CREATE TABLE directorUsers (
	directorID INT NOT NULL,
    userID INT NOT NULL,
    PRIMARY KEY(directorID, userID),
	FOREIGN KEY(userID) REFERENCES users(userID),
	FOREIGN KEY(directorID) REFERENCES directors(directorID)
    );


CREATE TABLE project (
	projectID INT AUTO_INCREMENT UNIQUE,
    userID INT NOT NULL,
    companyName VARCHAR(60) NOT NULL,
    projectDateCreated DATETIME NOT NULL,
    projectedCompletionDate DATETIME NOT NULL,
    projectAddress VARCHAR(60) NOT NULL,
    projectStatus ENUM ('In Progress', 'Completed', 'Cancelled', 'Paused') NOT NULL,
    projectDateCompleted DATETIME,
    PRIMARY KEY(projectID),
    FOREIGN KEY (userID) REFERENCES directors(directorID)
    );

CREATE TABLE collaborators (
	projectID INT NOT NULL,
    userID INT NOT NULL,
    userRole VARCHAR(60) NOT NULL,
    PRIMARY KEY(projectID, userID, userRole),
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY(projectID, userRole) REFERENCES projectRoles(projectID, userRole)
    );

CREATE TABLE projectRoles (
	projectID INT NOT NULL,
    userRole VARCHAR(60) NOT NULL,
    roleWeight INT NOT NULL,
    CONSTRAINT PK_role PRIMARY KEY(projectID, userRole),
	FOREIGN KEY(projectID) REFERENCES project(projectID)
    );

CREATE TABLE projectAccess (
	accessID INT AUTO_INCREMENT NOT NULL,
	projectID INT NOT NULL,
	sharedEmail VARCHAR(60) NOT NULL,
	userID INT NOT NULL,
    PRIMARY KEY(accessID, projectID),
	FOREIGN KEY(projectID) REFERENCES project(projectID),
	FOREIGN KEY(userID) REFERENCES users(userID)
    );
    
CREATE TABLE stages (
	projectID INT NOT NULL,
    stageName VARCHAR(100) NOT NULL,
    stageDateCreated DATETIME NOT NULL,
    stageDateCommenced DATETIME,
    dateCompleted DATETIME,
	stageProjectedCompletionDate DATETIME,
    CONSTRAINT PK_stage PRIMARY KEY (projectID, stageName),
    FOREIGN KEY(projectID) REFERENCES project(projectID)
    );

CREATE TABLE stageComments (
	stageCommentID INT AUTO_INCREMENT NOT NULL,
	projectID INT NOT NULL,
    userID INT NOT NULL,
    stageName VARCHAR(100) NOT NULL,
    stageComment VARCHAR(300) NOT NULL,
    stageCommentCreated DATETIME NOT NULL,
	PRIMARY KEY (stageCommentID, projectID),
	FOREIGN KEY(projectID) REFERENCES project(projectID),
	FOREIGN KEY(userID) REFERENCES users(userID)
    );

CREATE TABLE projectImages (
    imageID INT AUTO_INCREMENT,
    projectID INT NOT NULL,
	imageKey VARCHAR(200) NOT NULL,
    imageDateCreated DATETIME NOT NULL,
    PRIMARY KEY(imageID, projectID),
    FOREIGN KEY(projectID) REFERENCES project(projectID)
    );

CREATE TABLE pinterestBoards (
	boardID INT AUTO_INCREMENT NOT NULL,
    projectID INT NOT NULL,
    userID INT NOT NULL,
    boardOwner VARCHAR(100) NOT NULL,
    boardName VARCHAR(60) NOT NULL,
    PRIMARY KEY (boardID, projectID),
	FOREIGN KEY(projectID) REFERENCES project(projectID),
	FOREIGN KEY(userID) REFERENCES users(userID)
);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'thisIsASimulPassword1!';
FLUSH privileges;

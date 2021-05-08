const router = require("./login");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const options = require('../knexfile.js');
const knex = require('knex')(options);

const whiteboards = [];

async function checkAccess(projectID, userID, userType) {
    var permitted = false;
    //if the use is a director, check if tthey are the director of the project
    if (userType === "director") {
        var result = await knex.from("project").count('* AS count').where({
            projectID: projectID.valueOf(),
            userID: userID.valueOf(),
        });
        permitted = (result[0].count > 0);
    //if the user is a user, check if they are a collaborator on the project
    } else if (userType === "user") {
        var result = await knex.from("collaborators").count('*').where({
            projectID: projectID.valueOf(),
            userID: userID.valueOf(),
        });
        permitted = (result[0].count > 0);
    }
    return permitted;
}


module.exports = function (io) {
    io.on('connection', function(socket) {
        console.log('CONNECTION MADE');
        var decoded;
        var projectID;
        try {
            projectID = socket.handshake.query.projectID;
            decoded = jwt.verify(socket.handshake.auth.token.slice(7), "helloKey");

            if (!(checkAccess(projectID, decoded.token, decoded.userType))) {

                throw 'access denied';
            }
            socket.join(projectID);

            socket.on("update", (target, type, data) => {
                try {
                    //var room = crypto.createHash("sha256").update(target + type + toString(Math.random()))
                                //.digest("base64");
                    var projectID = socket.handshake.query.projectID;
                    
                    console.log(data);
                    socket.to(projectID).emit("update", target, type, data);
                } catch(err) {
                    console.log(err);
                    socket.emit('updateFailed');
                };
            });

            socket.emit("loginSuccess", socket.id);

        } catch {
            socket.emit("loginFailure");
            socket.disconnect(true);
            return;
        }
        

    });
    return router;
};
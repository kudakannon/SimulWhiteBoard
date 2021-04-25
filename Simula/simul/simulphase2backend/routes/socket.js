const router = require("./login");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const whiteboards = [];


router.post("/socket", function(req, res, next) {
    //var tok;
    //var decoded;
    //try {
        //tok = req.headers.authorization.slice(7);
        //decoded = jwt.verify(tok, "helloKey");
    //} catch {
        //res
        //.status(401)
        //.json({
            //message: "oh no! it looks like your authorization token is invalid...",
        //});
    //};
    //let conn = new Connection(decoded.token, req.body.projectID);
    //console.log(conn.getSessionCode());
    //res.status(200).send({sessionID: conn.getSessionCode()});
    ////req.db.from("projectAccess").select('*').where({
            ////userId: decoded.token,
            ////projectID: req.body.projectID
        ////})
});


module.exports = function (io) {
    io.on('connection', function(socket) {
        console.log('CONNECTION MADE');
        var decoded;
        var projectID;
        try {
            projectID = socket.handshake.query.projectID;
            decoded = jwt.verify(socket.handshake.auth.token.slice(7), "helloKey");

            //req.db.from("projectAccess").select('*').where({
                //userID: decoded.token,
                //projectID: projectID
            //})
            socket.join(projectID);

            socket.on("update", (target, type, data) => {
                try {
                    //var room = crypto.createHash("sha256").update(target + type + toString(Math.random()))
                                //.digest("base64");
                    var projectID = socket.handshake.query.projectID;
                    //console.log('1');
                    //socket.in(projectID).join(room);
                    //socket.leave(room);
                    //console.log('2');
                    console.log(data);
                    socket.to(projectID).emit("update", target, type, data);
                    //socket.in(room).leave(room);
                    socket
                } catch {
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
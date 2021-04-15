const router = require("./login");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


let connections = new Map();
const whiteboards = [];

class Connection {
    remove() {
        connections.delete(this.sessionCode);
    };

    constructor(userID, projectID) {
        this.user = userID;
        this.room = projectID.toString();
        this.active = false;

        this.sessionCode = crypto.createHash('sha256')
            .update(this.user.toString() + this.room + (Math.random() * 1000000).toString()).digest('base64');

        this.timeout = setTimeout(this.remove, 1000 * 60 * 5);
        connections.set(this.sessionCode, this);
    };

    getSessionCode() {
        return this.sessionCode
    };
};


router.post("/socket", function(req, res, next) {
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
    };
    let conn = new Connection(decoded.token, req.body.projectID);
    console.log(conn.getSessionCode());
    res.status(200).send({sessionID: conn.getSessionCode()});
    //req.db.from("projectAccess").select('*').where({
            //userId: decoded.token,
            //projectID: req.body.projectID
        //})
});


module.exports = function (io) {
    io.on('connection', function(socket) {
        console.log('CONNECTION MADE');
        var decoded;
        var projectID;
        try {
            projectID = socket.handshake.query.projectID;
            decoded = jwt.verify(socket.handshake.query.user, "helloKey");
        } catch {
            socket.disconnect(true);
            return;
        }
        
    });
    return router;
};
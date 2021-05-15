const router = require("./login");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fsp = require("fs/promises");

const options = require('../knexfile.js');
const knex = require('knex')(options);

const whiteboards = new Map();
const defaultboard = '{"height": "1080px", "width": "1800px", "elements": []}';

class Whiteboard {
    constructor(boardname, boardjson) {
        whiteboards.set(boardname, this);
        //loading whiteboard json
        this.boardname = boardname;
        this.data = JSON.parse(boardjson);
        
        

        //creating map to track where whiteboard elements are in data without messing with JSON.stringify()
        this.elemmap = new Map();
        for (var i = 0; i < this.data.elements.length; i++) {
            this.elemmap.set(this.data.elements[i].id, i);
        }

        this.deletetimer = null; //removes whiteboard object if not change have been made for 20 minutes

        //prevent harddrive spam
        this.recentchange = false;
        this.savetimer = setInterval(() => {
            if (this.recentchange) {
                console.log("saved " + this.boardname);
                fsp.writeFile("./whiteboards/" + boardname + "/board.json", JSON.stringify(this.data));
            } else {
                this.deletetimer = setTimeout(()=>{
                    whiteboards.delete(this.boardname);
                }, (1000 * 60 * 15));
            };
        }, (1000 * 60 * 2));//timer set to five minutes
        
    };

    get elements() {
        return this.data.elements;
    };

    get json() {
        return JSON.stringify(this.data);
    }

    addElement(element) {
        if (!(this.elemmap.has(element.id))) {
            var length = this.data.elements.push(element);
            this.elemmap.set(element.id, length - 1);
            return true;
        }
        return false;
        
    };

    deleteElement(elemID) {
        if (this.elemmap.has(elemID)) {
            var pos = this.elemmap.get(elemID);
            this.data.elements.splice(pos, 1);
            this.elemmap.delete(elemID);

            for (var i = pos; i < this.data.elements.length; i++) {
                this.elemmap.set(this.data.elements[i].id, i);
            }
            return true;
        }
        return false;
        

    }


    updateText(target, text) {
        //signal whiteboard has been updated
        this.recentchange = true;
        try {
            clearTimeout(this.deletetimer);
        } catch {
            //if timer is not set, do nothing
        }

        var targetnotfound = true;
        var i = 0;
        var targets = target.trim().split(' ');

        //find which part of the target refers to the element ID
        while (targetnotfound && (i < targets.length)) {
            if (this.elemmap.has(targets[i])) {
                targetnotfound = false;
            } else {
                i++;
            }
        }
        if (targetnotfound) {
            return false;
        }
        
        var id = targets.splice(i, 1)[0];

        //store target element index, while also removing element ID from array of targets
        var targindex = this.elemmap.get(id);


        //use remaining target array to put text change in correct object parameter
        try {
            this.data.elements[targindex][targets[0]] = text;
        } catch {
            return false;
        }

        return true;

    };

    updateSize(target, dimens) {
        //signal whiteboard has been updated
        this.recentchange = true;
        try {
            clearTimeout(this.deletetimer);
        } catch {
            //if timer is not set, do nothing
        }

        var targetnotfound = true;
        var i = 0;
        var targets = target.trim().split(' ');

        //find which part of the target refers to the element ID
        while (targetnotfound && (i < targets.length)) {
            if (this.elemmap.has(targets[i])) {
                targetnotfound = false;
            } else {
                i++;
            }
        }
        if (targetnotfound) {
            return false;
        }

        try {
            this.data.elements[this.elemmap.get(targets[i])].height = dimens.height;
            this.data.elements[this.elemmap.get(targets[i])].width = dimens.width;
        } catch {
            return false;
        }
        return true;

    };

    updateLocation(target, coords) {
        //signal whiteboard has been updated
        this.recentchange = true;
        try {
            clearTimeout(this.deletetimer);
        } catch {
            //if timer is not set, do nothing
        }

        var targetnotfound = true;
        var i = 0;
        var targets = target.trim().split(' ');

        //find which part of the target refers to the element ID
        while (targetnotfound && (i < targets.length)) {
            if (this.elemmap.has(targets[i])) {
                targetnotfound = false;
            } else {
                i++;
            }
        }
        if (targetnotfound) {
            return false;
        }

        try {
            this.data.elements[this.elemmap.get(targets[i])].top = coords.top;
            this.data.elements[this.elemmap.get(targets[i])].left = coords.left;
        } catch {
            return false;
        }
        return true;
    };


};

async function checkAccess(projectID, userID, userType, userRole) {//userRole is not implemented at ttime of writing
    var permitted = false;
    //if the use is a director, check if they are the director of the project
    if (userType === "director") {
        var result = await knex.from("project").count('* AS count').where({
            projectID: projectID.valueOf(),
            userID: userID.valueOf(),
        });
        permitted = (result[0].count > 0);
    //if the user is a user, check if they are a collaborator on the project
    } else if (userType === "user") {
        var result = await knex.from("collaborators").count('* AS count').where({
            projectID: projectID.valueOf(),
            userID: userID.valueOf(),
        });
        permitted = (result[0].count > 0);
    }
    return permitted;
};

async function createWhiteboard(name) {
    var boardjson;
    
    try { 
        boardjson = await fsp.readFile("./whiteboards/" + name + "/board.json");
    } catch {
        //save defaultboard to file under boardname directory
        await fsp.mkdir("./whiteboards/" + name);
        await fsp.writeFile("./whiteboards/" + name + "board.json", defaultboard);
        boardjson = defaultboard;
    }

    return new Whiteboard(name, boardjson);

}


module.exports = function (io) {
    io.on('connection', function(socket) {
        console.log('CONNECTION MADE');
        var decoded;
        var projectID;
        try {
            projectID = socket.handshake.query.projectID;
            decoded = jwt.verify(socket.handshake.auth.token.slice(7), "helloKey");

            if (!(checkAccess(projectID, decoded.token, decoded.userType, null))) {

                throw 'access denied';
            }
            if (!(whiteboards.has(projectID))) {
                var w = createWhiteboard(projectID);
            }
            socket.join(projectID);

            socket.on("update", (target, type, data) => {
                try {
                    var projectID = socket.handshake.query.projectID;

                    if (!(whiteboards.has(projectID))) {
                        var w = createWhiteboard(projectID);
                    }

                    var success = false;
                    if (type === "text") {
                        success = whiteboards.get(projectID).updateText(target, data);
                    } else if (type === "move") {
                        success = whiteboards.get(projectID).updateLocation(target, data);
                    } else if (type === "resize") {
                        success = whiteboards.get(projectID).updateSize(target, data);
                    } else {
                        success = true;
                    }

                    
                    console.log(data);
                    socket.to(projectID).emit("update", target, type, data);
                } catch(err) {
                    console.log(err);
                    socket.emit('updateFailed');
                };
            });
            socket.emit("loginSuccess", socket.id, whiteboards.get(projectID).json);

        } catch {
            socket.emit("loginFailure");
            socket.disconnect(true);
            return;
        }
        

    });
    return router;
};
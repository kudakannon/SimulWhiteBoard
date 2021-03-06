
<template>
<span>

    <div v-if="(connected && loaded)" id="wframecontainer"> 
        <div id="whiteboardframe" v-on:mousedown="whiteboardMouseDown">
            <div id="toolbar" v-on:mousedown.stop>
                <!-- this stylesheet is here so the toolbar can access the icons it holds-->
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                <div v-for="{name, icon} in tools" :key="name" class="toolselector" v-on:click.stop="useTool(name)">
                    <i class="fa" :class="icon" aria-hidden="true" ></i>
                </div>
                <!-- Links directors to project settings-->
                <NuxtLink to="/viewproject">
                    <div class="toolselector" v-if="loggedInUser.userType === 'director'">
                        <i class="fa fa-cogs" aria-hidden="true"></i>
                    </div>
                </NuxtLink>
            </div>
            <div id="whiteboard" :style="{height: wdata.height, width: wdata.width}" :key="forkey" 
                v-on:drop="dropElement" v-on:dragover.prevent>
                <!-- template to Iterate through all stored whiteboard elements-->
                <template v-for="[key ,element] of wdata.elements" >
                    <!-- a different template for each type of element-->
                    <template v-if="element.get('type') === 'postit'">
                        <div :key="key" :id="element.get('id')" 
                            :class="element.get('type') + ' ' + element.get('id')"
                            v-on:mousedown.stop v-on:dragstart="dragElement" draggable="true" 
                            v-observer:subtree.attributes="resizeHandler" v-on:click="deleteElement"
                            :style="{height: element.get('height'), width: element.get('width'), 
                            top: element.get('top'), left: element.get('left')}">

                            <textarea class="label" :class="element.get('id')" :value="element.get('label')" 
                                v-on:click.stop v-on:input="sendTextUpdate" />
                            <textarea class="text" :class="element.get('id')" :value="element.get('text')" 
                                v-on:click.stop v-on:input="sendTextUpdate" />
                        </div>
                    </template>
                    <template v-else-if="element.get('type') === 'img'">
                        <div :key="element.get('file')" :id="element.get('id')" 
                        :class="element.get('type') + ' ' + element.get('id')"
                        v-on:mousedown.stop v-on:dragstart="dragElement" draggable="true"
                        v-observer:subtree.attributes="resizeHandler" v-on:click="deleteElement"
                        :style="{height: element.get('height'), width: element.get('width'),
                        top: element.get('top'), left: element.get('left')}">
                            <div class="noimagetop"><div class="noimagebottom">
                                <i class="fa fa-picture-o fa-4x" aria-hidden="true"></i>
                            </div></div>
                            <img :class="'imgbase ' + element.get('id')" :src="element.get('imgdata')"
                            draggable="false" :title="element.get('file')">
                            <!--upload is always visible with no image and visible on mousover otherwise -->
                            <div v-if="element.get('file') === ''"
                            :class="'imgpreupload'">
                                <input type="file" :class="element.get('id')">
                                <button :class="element.get('id')" v-on:click.stop="uploadImage">Upload</button>
                            </div>
                            <div v-else class="imghoverbox">
                                <div class="imghover">Change Image</div>
                                <div class="imgupload">
                                    <input type="file" :class="element.get('id')">
                                    <button :class="element.get('id')" v-on:click.stop="changeImage">Upload</button>
                                </div>
                            </div>
                        </div> 
                    </template>
                    <!-- catch all-->
                    <template v-else>
                        <div :key="key">
                        </div>
                    </template>
                </template>
            </div>
        </div>
    </div>
    <div v-else>
        <Loading />
    </div>
</span>
</template>


<script>
import Loading from "~/components/Loading"
import { io, Socket } from 'socket.io-client'
import ss from 'socket.io-stream'
import { mapGetters } from 'vuex'
import { observer } from 'vue-mutation-observer'


export default ({
    middleware: "auth",
    computed: {
        ...mapGetters(["loggedInUser"])
    },
    directives: {
        observer
    },
    data() {
        return {
            pos: {top: 0, left: 0, x: 0, y: 0}, //stores values when moving elements
            connected: false, 
            loaded: false,
            sessionID: "", //the socket ID
            sock: null, //the socket
            tool: "mouse", //which tool is in use
            wdata: { //all whiteboard data
                name: this.$route.query.project,
                height: "",
                width: "",
                elements: new Map(),
            },
            //all tools in toolbar: {name: "", imgurl: ""}
            tools: [
                {name:"mouse", icon: "fa-mouse-pointer"}, 
                //{name:"edit", icon: "fa-edit"}, 
                {name:"font", icon: "fa-font"},
                {name:"sticky", icon: "fa-sticky-note"},
                {name:"image", icon: "fa-image"},
                //{name:"comment", icon: "fa-comment"},
                {name:"delete", icon: "fa-trash"},
                {name:"thumbup", icon: "fa-thumbs-up"},
                {name:"thumbdown", icon: "fa-thumbs-down"},
                {name:"save", icon: "fa-save"},
                //{name:"resize", icon: "fa-arrows-alt"}
            ],

            defaultstickylabel: "Title",
            defaultstickytext: "Text",
            forkey: 0, //increment to update whiteboard
            resizeObs: null,
        };
    },
    components: {
        Loading,
        io,
        Socket,
        ss,
    },
    methods: {
        async startWhiteboard() {
            if (this.loggedInUser) {

                this.startSocket();
                

                //var wjson = await this.$axios.$get('http://localhost:3000/testdata.json');
                //this.buildWhiteboard(wjson);
            }
        },

        //--------------------
        //Socket setup and events
        //--------------------
        startSocket() {
            console.log(this.wdata.name);
            this.sock = io("http://localhost:10011", {
                auth: {token: this.$auth.$storage.getUniversal("_token.local")}, 
                query: {projectID: this.wdata.name}
            });

            this.sock.on("loginSuccess", (sessionID, wjson) => {
                this.sessionID = sessionID;
                this.connected = true;
                this.buildWhiteboard(JSON.parse(wjson));
            });

            this.sock.on("loginFailure", () => {
                console.log('failure');
                this.sock.disconnect();
            });

            this.sock.on("update", (target, type, data) => {
                if (type == "text") {
                    this.receiveTextUpdate(target, data);
                } else if (type == "move") {
                    this.receiveMoveUpdate(target, data);
                } else if (type == "resize") {
                    this.receiveResizeUpdate(target, data);
                }
            });

            this.sock.on("updateFail", () => {
                this.message = "update failed";
            });
            //adds object to elements map
            this.sock.on('create', (object) => {
                this.wdata.elements.set(object.id, new Map(Object.entries(object)));
                this.forkey = this.forkey + 1;
                this.$forceUpdate();
            });

            //deletes object
            this.sock.on('delete', (elemID) => {
                this.wdata.elements.delete(elemID);
                this.forkey = this.forkey + 1;
                this.$forceUpdate();
            });

            //creates new img element then asks server to send image
            this.sock.on('imgupload', (object) => {
                this.wdata.elements.set(object.id, new Map(Object.entries(object)));
                this.sock.emit('imgdownload', object.id, object.file);
            });

            //updates img element file name then asks server to send image
            this.sock.on('imgupdate', (elemID, filenme) => {
                this.wdata.elements.get(elemID).set('file', filenme);
                this.sock.emit('imgdownload', elemID, filenme);
            });

            //receives image from server
            ss(this.sock).on('imgdownload', (elemID, stream) => {
                console.log('starting');
                this.renderDownloadedImage(elemID, stream);
            })
        },

        //stores whiteboard data into wdata variable for use by template
        buildWhiteboard(wjson) {
            this.wdata.height = wjson.height;
            this.wdata.width = wjson.width;
            for (var elem of wjson.elements) {
                //changes elements into Map objects for ease of searching
                var newmap = new Map(Object.entries(elem));
                this.wdata.elements.set(elem.id, newmap);
                if (newmap.get('type')==='img') {
                    this.sock.emit('imgdownload', newmap.get('id'), newmap.get('file'));
                }
            }

            this.loaded = true;
            this.$forceUpdate();
            
            
        },
        //changes current tool in use
        useTool(toolname) {
            //resets cursur on whiteboard elements
            if (this.tool === 'delete' && toolname !== 'delete') {
                for (var elem of document.getElementById('whiteboard').children) {
                    elem.style.removeProperty('cursor');
                };
            };

            this.tool = toolname;
            
            //sets cursor on whitebaords
            if (toolname === "mouse") {
                document.getElementById('whiteboardframe').style.cursor = "grab";
            } else if (toolname === "sticky" || toolname === "image") {
                document.getElementById('whiteboardframe').style.cursor = "crosshair";
            } else if (toolname === "delete") {
                document.getElementById('whiteboardframe').style.cursor = "default";
                for (var elem of document.getElementById('whiteboard').children) {
                    elem.style.cursor = "crosshair";
                }
            }
        },
        //moves classlist to string when .classes property not working as expected
        getClassQuery(element) {
            var classlist = element.classList;
            var classes = "";
            for (var c of classlist.values()) {
                classes = classes + c + " ";
            }
            return classes;
        },
        //finds which class is the whiteboard element id
        splitTarget(target) {
            var targets = target.trim().split(' ');
            var result = [];

            for (var s of targets) {
                if (this.wdata.elements.has(s)) {
                    result.unshift(s);
                } else {
                    result.push(s);
                }
            }
            return result;

        },


        //------------------
        //send/receive updates
        //------------------
        //updates whitebaord data with new text values, sending to and receiving from others
        updateText(target, data) {
            var keys = this.splitTarget(target);
            var map = this.wdata.elements;
            for (var i = 0; i < keys.length - 1; i++) {
                map = map.get(keys[i]);

            }


            map.set(keys.pop(), data);
        },

        receiveTextUpdate(target, data) {
            this.updateText(target, data);
            this.$forceUpdate();
            //document.querySelector(target).value = data;
        },

        sendTextUpdate(event) {
            var target = this.getClassQuery(event.target);

            this.updateText(target, event.target.value);
            
            this.sock.emit("update", target, "text", event.target.value);
        },


        //Updates whiteboard data with new top and left values, sending to and receiving from others
        updateLocation(target, data) {
            var keys = this.splitTarget(target);
            
            this.wdata.elements.get(keys[0]).set('top', data.top);
            this.wdata.elements.get(keys[0]).set('left', data.left);
        },

        receiveMoveUpdate(target, data) {
            this.updateLocation(target, data);

            this.$forceUpdate();
            //var element = document.querySelector(target);
            //element.style.top = data.top;
            //element.style.left = data.left;
        },

        sendMoveUpdate(element) {
            var target = this.getClassQuery(element);
            var data = {top: element.style.top, left: element.style.left};

            this.updateLocation(target, data);
            this.sock.emit("update", target, "move", data);
        },


        //handles events from the mutation observer
        resizeHandler(mutationsList) {
            for (const m of mutationsList) {
                try {
                    //limits first to style changes, then to height and width only
                    if (m.type == "attributes" && m.attributeName == "style") {
                        var style = m.target[m.attributeName];
                        var oldheight = this.wdata.elements.get(m.target['id']).get('height');
                        var oldwidth = this.wdata.elements.get(m.target['id']).get('width');

                        if (!(style.height == oldheight && style.width == oldwidth)) {
                            this.sendResizeUpdate(m.target);
                        }
                    
                    }
                } catch { console.log('resize observer fail')};
            }
        },

        //Updates whiteboard data with resized elements, sending to and receiving from others
        updateSize(target, data) {
            var keys = this.splitTarget(target);
            
            this.wdata.elements.get(keys[0]).set('height', data.height);
            this.wdata.elements.get(keys[0]).set('width', data.width);
        },

        receiveResizeUpdate(target, data) {
            this.updateSize(target, data);

            this.$forceUpdate();
            //var element = document.querySelector(target);
            //element.style.height = data.height;
            //element.style.width = data.width;
        },
    
        sendResizeUpdate(element) {
            var target = this.getClassQuery(element);
            var data = {height: element.style.height, width: element.style.width};

            this.updateSize(target, data);
            this.sock.emit("update", target, "resize", data)
        },


        //Uploads an images from an image element that the user has just created
        uploadImage(event) {
            var id = event.target.className;
            var file = document.querySelector('input.' + id).files[0];

            this.wdata.elements.get(id).set('file', file.name);
            var img = {
                type: "img",
                id: id,
                left: this.wdata.elements.get(id).get('left'),
                top: this.wdata.elements.get(id).get('top'),
                height: this.wdata.elements.get(id).get('height'),
                width: this.wdata.elements.get(id).get('width'),
                file: file.name,
                imgdata: "",
            };
            this.renderImage(id, file);
            var stream = ss.createStream();
            ss(this.sock).emit('imgupload', img, stream)
            ss.createBlobReadStream(file).pipe(stream);
            console.log('sent');
        },

        //uploads an image from an existing image element
        changeImage(event) {
            var id = event.target.className;
            var file = document.querySelector('input.' + id).files[0];

            this.wdata.elements.get(id).set('file', file.name);
            this.renderImage(id, file);
            var stream = ss.createStream();
            ss(this.sock).emit('imgupdate', id, file.name, stream)
            ss.createBlobReadStream(file).pipe(stream);
            console.log('sent');
        },

        //displays an image that the user has just uploaded
        renderImage(elemID, file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.wdata.elements.get(elemID).set('imgdata', e.target.result);
                this.forkey = this.forkey + 1;
                this.$forceUpdate();
            };
            reader.onerror = (e) => {
                console.log(e);
            };
            reader.readAsDataURL(file);
        },

        //displays an image that the user has just downloaded
        async renderDownloadedImage(elemID, stream) {
            const chunks = [];

            var prom = new Promise((resolve, reject) => {
                stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
                stream.on('error', (err) => reject(err));
                stream.on('end', () => {
                    resolve(Buffer.concat(chunks).toString('base64'));
                })
            })

            var image = await prom;

            var suffixes = this.wdata.elements.get(elemID).get('file').split('.');
            var suff = suffixes[suffixes.length - 1];
            var datauri;
            if ( suff === 'jpg' || suff === 'jpeg') {
                datauri = "data:image/jpeg;base64,"
            } else if ( suff === 'png') {
                datauri = "data:image/png;base64,"
            } else if (suff === 'gif') {
                datauri = "data:image/gif;base64,"
            }

            this.wdata.elements.get(elemID).set('imgdata', datauri + image);
            this.forkey = this.forkey + 1;
            this.$forceUpdate();
        },

        //changes whiteboard behaviour based on active tool
        whiteboardMouseDown(event) {
            if (this.tool === "mouse") {
                this.moveWhiteboard(event);
            } else if (this.tool === "sticky") {
                this.newDragBox(event, this.newSticky);
            } else if (this.tool === "image") {
                this.newDragBox(event, this.newImg);
            }
        },

        //allows user to move whiteboard byclick-and-dragging the background
        moveWhiteboard(event) {
            //look grabbed, don't highlight text
            var wframe = document.getElementById('whiteboardframe');
            wframe.style.cursor = 'grabbing';
            wframe.style.userSelect = 'none';

            //store current mouse and scroll postions
            this.pos = {
            left: wframe.scrollLeft,
            top: wframe.scrollTop,
            x: event.clientX,
            y: event.clientY,
            };

            //
            document.addEventListener('mousemove', this.dragWhiteboard);
            document.addEventListener('mouseup', this.releaseWhiteboard);
        },

        dragWhiteboard(event) {
            var wframe = document.getElementById('whiteboardframe');
            var xMove = event.clientX - this.pos.x;
            var yMove = event.clientY - this.pos.y;
            
            wframe.scrollTop = this.pos.top - yMove;
            wframe.scrollLeft = this.pos.left - xMove;


        },

        releaseWhiteboard() {
            var wframe = document.getElementById('whiteboardframe');
            wframe.style.cursor = 'grab';
            wframe.style.removeProperty('userSelect');

            document.removeEventListener('mousemove', this.dragWhiteboard);
            document.removeEventListener('mouseup', this.releaseWhiteboard);

        },

        //-------------------
        //creating and Deleting
        //-------------------
        //makes a box to show the size of the new element
        //newelemfunct: the function to call when releasing the mouse, meaning the box is at full size
        newDragBox(event, newelemfunct) {
            var wframe = document.getElementById('whiteboardframe');
            var box = document.createElement('div');
            box.id = 'dragbox';
            var headerheight = document.querySelector(".navbar-dark").offsetHeight;
            box.style.top = (event.clientY + wframe.scrollTop - headerheight) + 'px';
            box.style.left = (event.clientX + wframe.scrollLeft) + 'px';
            box.style.width = '0px';
            box.style.height = '0px';


            document.getElementById('whiteboard').appendChild(box);


            this.pos.top = event.clientY;
            this.pos.left = event.clientX;

            document.addEventListener('mousemove', this.dragDragBox);
            document.addEventListener('mouseup', newelemfunct);
        },

        dragDragBox(event) {

            var box = document.getElementById('dragbox');
            box.style.width = (event.clientX - this.pos.left) + 'px';
            box.style.height = (event.clientY - this.pos.top) + 'px';
        },

        newSticky(event) {
            var box = document.getElementById('dragbox');
            box.style.width = (event.clientX - this.pos.left) + 'px';
            box.style.height = (event.clientY - this.pos.top) + 'px';

            var id = this.sessionID + box.style.top + 'z' + (Math.random().toString().split('.')[1]);
            var sticky = {
                type: "postit",
                id: id,
                left: box.style.left,
                top: box.style.top,
                height: box.style.height,
                width: box.style.width,
                label: this.defaultstickylabel,
                text: this.defaultstickytext,
            };

            this.wdata.elements.set(id, new Map(Object.entries(sticky)));
            console.log(this.wdata.elements);
            this.forkey = this.forkey + 1;
            this.$forceUpdate;
            this.sock.emit('create', sticky);


            box.remove();
            this.useTool('mouse');
            document.removeEventListener('mousemove', this.dragDragBox);
            document.removeEventListener('mouseup', this.newSticky);

        },

        newImg(event) {
            var box = document.getElementById('dragbox');
            box.style.width = (event.clientX - this.pos.left) + 'px';
            box.style.height = (event.clientY - this.pos.top) + 'px';

            var id = this.sessionID + box.style.left + 'p' + (Math.random().toString().split('.')[1]);
            var img = {
                type: "img",
                id: id,
                left: box.style.left,
                top: box.style.top,
                height: box.style.height,
                width: box.style.width,
                file: "",
                imgdata: "",
            };

            this.wdata.elements.set(id, new Map(Object.entries(img)));
            console.log(this.wdata.elements);
            this.forkey = this.forkey + 1;
            this.$forceUpdate;

            box.remove();
            this.useTool('mouse');
            document.removeEventListener('mousemove', this.dragDragBox);
            document.removeEventListener('mouseup', this.newImg);

        },
    
        dragElement(event) {
            event.dataTransfer.setData('text', event.target.id);
            console.log(event.target);
            var sty = getComputedStyle(event.target);
    
            this.pos = {
            left: parseInt(sty.left),
            top: parseInt(sty.top),
            x: event.clientX,
            y: event.clientY,
            };
        },
    
        dropElement(event) {
            event.preventDefault();
            var dropid = event.dataTransfer.getData('text');
            var dropelem = document.getElementById(dropid);
            var xMove = event.clientX - this.pos.x;
            var yMove = event.clientY - this.pos.y;

            dropelem.style.top = Math.max(0, this.pos.top + yMove) + 'px';
            dropelem.style.left = Math.max(0, this.pos.left + xMove) + 'px';

            this.sendMoveUpdate(dropelem);
        },

        deleteElement(event) {

            //if delete tool isn't selected, do nothing
            if (this.tool !== "delete") {
                return;
            };

            this.wdata.elements.delete(event.target.id);
            this.useTool('mouse');
            this.sock.emit('delete', event.target.id);

            this.forkey = this.forkey + 1;
            this.$forceUpdate();


        }
        
        
        
    },
    
    created() {
        this.startWhiteboard();
        
        
    },
    beforeUpdated() {
        //clears mutation observer events before updates, since they will be created again during the update.
        observer.disconnect();
    }
})
</script>

<style>
    /*moves with the rest of site*/
    #wframecontainer {
        position: relative;
        width: 100%;
        height: 640px;
    }

    /*size of visible part of whiteboard*/
    #whiteboardframe {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;

        /*allows scrolling*/
        overflow: auto;
        cursor: grab;

        /*disables scrollbar part 1 */
        scrollbar-width: none; /* Firefox*/
        -ms-overflow-style: none;  /* Internet Explorer 10+ */

    }

    /*disables scrollbar part 2 */
    #whiteboardframe::-webkit-scrollbar { /* WebKit */
        width: 0;
        height: 0;
    }

    #toolbar {
        /*hover over whiteboard*/
        display: inline-block;
        position: sticky;
        z-index: 3;
        top: 10%;
        left:5%;
        margin: 0;
        padding: 20px 20px;
        /*width:50px;*/
        border-radius: 5px;
        background: rgb(0, 0, 0); 
        line-height: 35px;
        cursor: default;
    }

    div.toolselector {
        
        height: 35px;
        text-align: center;
        /*background-color: grey;
        border: 2px black;
        border-style: solid none;*/
        color: seashell;
        
    }


    #whiteboard {
            /*removes whitespace*/
            position: absolute;				
            top: 0px;
            /*default values*/
            /*width: 900px;
            height: 900px;*/

            background-color: lightgrey;
            /*little dots in background*/
            background-size: 50px 50px;
            background-image: linear-gradient(45deg, black 1px, transparent 1px),
                linear-gradient(-135deg, black 1px, transparent 1px);
    }

    /*for all postits*/
    div.postit {
        position: absolute;
        z-index: 2;
        background-color: lightyellow;
        border-color: black;
        overflow: hidden;
        padding: 5px;
        resize: both;
    }

    textarea.label {
        display: inline-block;
        width: 100%;
        height: 25px;
        background-color: yellow;
        border: 1px solid black;
        cursor: default;
        resize: none;
    }

    textarea.text {
        display: inline-block;
        width: 100%;
        height: 80%;
        cursor: default;
        overflow-y: scroll;
        resize: none;
    }

    #dragbox {
        display: block;
        position: absolute;
        fill-opacity: 0.2;
        fill: lightyellow;
        border: 1px dotted black;
    }

    .img {
        position: absolute;
        z-index: 1;
        background-color: lightyellow;
        border-color: black;
        overflow: hidden;
        resize: both;
    }

    .imgpreupload {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        min-height: 2em;
        padding-top: 2px;
        background-color: black;
        border: 2px white;
        color: seashell;
    }

    .noimagetop {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 50%;
        width: 50%;
    }

    .noimagebottom {
        display: block;
        position: absolute;
        right: -2em;
        bottom: -3em;
    }

    .imgbase {
        display: block;
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
    }

    .imghoverbox {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    .imghover {
        position: absolute;
        top: 0;
        left: 0;
        width: 110px;
        height: 2em;
        background-color: black;
        color: seashell;
        border: 2px white;
    }

    .imgupload {
        position: absolute;
        top: 0;
        left: 0;
        display: none;
        width: 100%;
        min-width: 200px;
        height: 2em;
        background-color: black;
        color: seashell;
        border: 2px white;
    }

    .imgupload button {
        color: black;
    }

    .img:hover .imghoverbox {
        display: contents;
    }

    .imghoverbox:hover .imgupload {
        display: block;
    }


</style>
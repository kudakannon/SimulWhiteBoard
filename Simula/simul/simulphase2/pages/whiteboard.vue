<script>
import Loading from "~/components/Loading"
import { io, Socket } from 'socket.io-client'
import { mapGetters } from 'vuex'


export default ({
    middleware: "auth",
    computed: {
        ...mapGetters(["loggedInUser"])
    },
    data() {
        return {
            pos: {top: 0, left: 0, x: 0, y: 0},
            connected: false,
            loaded: false,
            sessionID: "",
            sock: null,
            wdata: {
                name: "0",
                height: "",
                width: "",
                elements: new Map(),
            },
            //all tools in toolbar: {name: "", imgurl: ""}
            tools: [
                {name:"Reset", imgurl: ""}, 
                {name:"Pstit", imgurl: ""}, 
                {name:"Pen", imgurl: ""},
                {name:"Pncl", imgurl: ""}
            ],

            resizeObs: null,
        };
    },
    components: {
        Loading,
        io,
        Socket,
    },
    methods: {
        async startWhiteboard() {
            if (this.loggedInUser) {
                this.startSocket();
                

                var wjson = await this.$axios.$get('http://localhost:3000/testdata.json');
                console.log(wjson);
                this.buildWhiteboard(wjson);
                this.loaded = true;
            }
        },

        startSocket() {
            this.sock = io("http://localhost:10011", {
                auth: {token: this.$auth.$storage.getUniversal("_token.local")}, 
                query: {projectID: this.wdata.name}
            });
            this.sock.on("loginSuccess", (sessionID) => {
                this.sessionID = sessionID;
                this.connected = true;
            });

            this.sock.on("loginFailure", () => {
                this.connected = true;
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
        },

        buildWhiteboard(wjson) {
            this.wdata.height = wjson.height;
            this.wdata.width = wjson.width;

            for (var elem in wjson.elements) {
                var newmap = new Map(Object.entries(elem));
                this.wdata.elements.set(elem.id, newmap);
            }
            console.log(this.wdata.elements);
            
            
        },
        useTool(toolname) {
            console.log(toolname);
        },
        getClassQuery(element) {
            var classlist = element.classList;
            var classes = "";
            for (var c of classlist.values()) {
                classes = classes + "." + c;
            }
            return classes;
        },

        receiveTextUpdate(target, data) {
            document.querySelector(target).value = data;
        },
        
        sendTextUpdate(event) {
            var target = this.getClassQuery(event.target);
            
            this.sock.emit("update", target, "text", event.target.value);
        },
        receiveMoveUpdate(target, data) {
            var element = document.querySelector(target);
            element.style.top = data.top;
            element.style.left = data.left;
        },
        sendMoveUpdate(element) {
            var target = this.getClassQuery(element);

            this.sock.emit("update", target, "move", {top: element.style.top, left: element.style.left});
        },
        receiveResizeUpdate(target, data) {
            var element = document.querySelector(target);
            element.style.height = data.height;
            element.style.width = data.width;
        },
        sendResizeUpdate(element) {
            var target = this.getClassQuery(element);
            this.sock.emit("update", target, "resize", {height: element.style.height, width: element.style.left})
        },
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
    
        dragElement(event) {
            event.dataTransfer.setData('text', event.target.id);
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
        
        
        
    },
    render: function(createElement) {
        var app = this;
        if (this.connected && this.loaded) {
            return createElement('div', {attrs: {id: 'wframecontainer'}},[
                //the interactable part of the whiteboard
                createElement('div', {attrs: {id: 'whiteboardframe'}, 
                on: {mousedown: (event) => {this.moveWhiteboard(event)}}},[
                    //toolbar
                    createElement('div', {attrs: {id: 'toolbar'}, 
                    on: {mousedown: (event)=> {event.stopPropagation();}}}, this.tools.map( (tool) => {
                        return createElement('div', {class: 'toolselector', on: {
                                click: (event) => {
                                    event.stopPropagation();
                                    this.useTool(tool.name)
                                }
                            }
                        },/*implement tool images here*/tool.name);
                    })),

                    //the display part of the whiteboard
                    createElement('div', {
                        attrs: {id: 'whiteboard'}, 
                        style: {
                            height: this.wdata.height, 
                            width: this.wdata.width,
                        },
                        on: {
                            drop: (event) => {this.dropElement(event)},
                            dragover: (event) => {event.preventDefault()}
                        }
                    },//all whiteboard elements
                    this.wdata.elements.forEach((element, key) => {
                        //postit elements
                        if (element.get('type') == 'postit') {
                            return createElement('div', {
                                attrs: {id: element.get('id'), draggable: true},
                                class: [element.get('type'), element.get('id')],
                                on: {
                                    mousedown: (event) =>{
                                        event.stopPropagation();
                                    },
                                    dragstart: (event) => {this.dragElement(event)}
                                },
                                style: {
                                    height: element.get('height'),
                                    width: element.get('width'),
                                    top: element.get('top'),
                                    left: element.get('left'),
                                }
                            },[
                                createElement('textarea', {
                                    domProps: {value: element.get('title')},
                                    class: ['titlebox', element.get('id')],
                                    on: {
                                        click: (event) => {event.stopPropagation()},
                                        input: (event) => {this.sendTextUpdate(event)},
                                    }
                                }),
                                createElement('textarea', {
                                    domProps: {value: element.get('text')},
                                    class: ['textbox', element.get('id')],
                                    on: {
                                        input: (event) => {this.sendTextUpdate(event)},
                                    },
                                })
                            ]);
                        }else {
                            return "this isn't it";
                        };//implement other elements here
                    }))//end whiteboard createElement
                ])//end whiteboardframe createElement
            ]);//end whiteboardcontainer createElement
        } else {
            return createElement('Loading');
        }
        
    },
    created() {
        return this.startWhiteboard();
    },
    updated() {
        try {
            var ro = new ResizeObserver(entries => {
                for (let entry of entries) {
                    this.sendResizeUpdate(entry.target);
                }
            })
            var elements = document.getElementById('whiteboard').children;

            for (var e of elements) {
                ro.observe(e);
            };

            this.resizeObs = ro;
        } finally {};
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
        display: block;
        position: sticky;
        z-index: 1;

        top: 100px;
        left: 50px;
        width: 50px;
        border-radius: 12px;
        background-color: darkgrey;
        padding: 10px 5px;
        user-select: none;
    }

    div.toolselector {
        background-color: grey;
        height: 35px;
        text-align: center;
        border: 2px black;
        border-style: solid none;
        
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
        background-color: lightyellow;
        border-color: black;
        overflow: hidden;
        padding: 5px;
        resize: both;
    }

    textarea.titlebox {
        display: inline-block;
        width: 100%;
        height: 25px;
        background-color: yellow;
        border: 1px solid black;
        cursor: default;
        resize: none;
    }

    textarea.textbox {
        display: inline-block;
        width: 100%;
        height: 80%;
        cursor: default;
        overflow-y: scroll;
        resize: none;
    }


    /*test data to be generated programatically*/
    /*#e001 {
        top: 300px;
        left: 250px;
        height: 100px;
        width: 100px;
    }*/
</style>
<template>
    <div id="wframecontainer">
        <div id="whiteboardframe" onmousedown="moveWhiteboard(event)">

            <div id="toolbar" onmousedown="stopEvent(event)">
                <div class="toolselector" v-on:click="divtest">Reset</div>
                <div class="toolselector">PST</div>
                <div class="toolselector">PEN</div>
                <div class="toolselector">PNCL</div>
            </div>

            <div id="whiteboard" ondrop="drop(event)" ondragover="allowdrop(event)">
            </div>
            
        </div>
        <script type="application/javascript" charset="UTF-8" src="./divtest.js"></script>
    </div>	
</template>

<script>
    export default {
        data() {
            return {
                pos: { top: 0, left: 0, x: 0, y: 0 }
            };
        },
        mounted: function() {
            this.$nextTick(function() {
                this.divtest();
            });
        },
        methods: {

            //holds the postion values for dragging the whiteboard screen.

            divtest() {


                function buildWhiteboard(wdata) {
                    var wboard = document.getElementById('whiteboard');
                    wboard.style.height = wdata.height
                    wboard.style.width = wdata.width

                    for (var x in wdata.elements) {
                        if (wdata.elements[x].type == "postit") {
                            buildPostit(wdata.elements[x]);
                        };
                    };
                };
                
                function buildPostit(postdata) {
                    var newpostit = document.createElement("div");
                    newpostit.onmousedown = stopEvent;
                    newpostit.ondragstart = drag;
                    newpostit.draggable = true;

                    newpostit.classList.add(postdata.type);
                    newpostit.id = postdata.id;
                    newpostit.style.top = postdata.top;
                    newpostit.style.left = postdata.left;
                    newpostit.style.height = postdata.height;
                    newpostit.style.width = postdata.width;

                    var newtitle = document.createElement("textarea");
                    newtitle.innerHTML = postdata.title;
                    newtitle.classList.add("titlebox");
                    newpostit.appendChild(newtitle);


                    var newtext = document.createElement("textarea");
                    newtext.innerHTML = postdata.text;
                    newtext.classList.add("textbox");
                    newpostit.appendChild(newtext);

                    document.getElementById('whiteboard').appendChild(newpostit);

                };





                var wframe = document.getElementById('whiteboardframe');
                wframe.scrollTop = 0;
                wframe.scrollLeft = 0;
                var wboard = document.getElementById('whiteboard');
                wboard.innerHTML = "";

                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {

                        buildWhiteboard(JSON.parse(this.responseText));
                    };
                };


                xmlhttp.open("GET", "./testdata.json", true);
                xmlhttp.setRequestHeader("Content-type", "application/json");
                xmlhttp.send();
            },

            

        }   
    }
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
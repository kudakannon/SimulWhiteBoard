<template>
    <div id="wframecontainer">
        <div id="whiteboardframe" onmousedown="moveWhiteboard(event)">

            <div id="toolbar" onmousedown="stopEvent(event)">
                <div class="toolselector" onclick="divtest()">Reset</div>
                <div class="toolselector">PST</div>
                <div class="toolselector">PEN</div>
                <div class="toolselector">PNCL</div>
            </div>

            <div id="whiteboard" ondrop="drop(event)" ondragover="allowdrop(event)">
            </div>
            
        </div>
    </div>	
</template>

<script>
export default {
data() {
    return {
        pos: { top: 0, left: 0, x: 0, y: 0 }
    };
},
methods: {

    //holds the postion values for dragging the whiteboard screen.

    divtest() {
        var wframe = document.getElementById('whiteboardframe');
        wframe.scrollTop = 0;
        wframe.scrollLeft = 0;
        var wboard = document.getElementById('whiteboard');
        wboard.innerHTML = "";

        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

            buildWhiteboard(JSON.parse(this.responseText));
            };
        };


        xmlhttp.open("GET", "../static/testdata.json", true);
        xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.send();
    },

    buildWhiteboard(wdata) {
        var wboard = document.getElementById('whiteboard');
        wboard.style.height = wdata.height
        wboard.style.width = wdata.width

        for (x in wdata.elements) {
            if (wdata.elements[x].type == "postit") {
                buildPostit(wdata.elements[x]);
            };
        };
    },

    buildPostit(postdata) {
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

        var newtitle = document.createElement("div");
        newtitle.innerHTML = postdata.title;
        newtitle.classList.add("titlebox");
        newpostit.appendChild(newtitle);


        var newtext = document.createElement("div");
        newtext.innerHTML = postdata.text;
        newtext.classList.add("textbox");
        newpostit.appendChild(newtext);

        document.getElementById('whiteboard').appendChild(newpostit);

    },

    moveWhiteboard() {
        //look grabbed, don't highlight text
        var wframe = document.getElementById('whiteboardframe');
        wframe.style.cursor = 'grabbing';
        wframe.style.userSelect = 'none';

        //store current mouse and scroll postions
        pos = {
        left: wframe.scrollLeft,
        top: wframe.scrollTop,
        x: event.clientX,
        y: event.clientY,
        };

        //
        document.addEventListener('mousemove', dragWhiteboard);
        document.addEventListener('mouseup', releaseWhiteboard);
    },

    dragWhiteboard() {
        var wframe = document.getElementById('whiteboardframe');
        var xMove = event.clientX - pos.x;
        var yMove = event.clientY - pos.y;
        
        wframe.scrollTop = pos.top - yMove;
        wframe.scrollLeft = pos.left - xMove;


    },

    releaseWhiteboard() {
        var wframe = document.getElementById('whiteboardframe');
        wframe.style.cursor = 'grab';
        wframe.style.removeProperty('userSelect');

        document.removeEventListener('mousemove', dragWhiteboard);
        document.removeEventListener('mouseup', releaseWhiteboard);

    },

    stopEvent() {
        event.stopPropagation();
    },

    drag() {
        //stopEvent(event);
        event.dataTransfer.setData("text/plain", event.target.id);
        var sty = getComputedStyle(event.target);

        pos = {
        left: parseInt(sty.left),
        top: parseInt(sty.top),
        x: event.clientX,
        y: event.clientY,
        };
    },

    drop() {
        event.preventDefault();
        var dropid = event.dataTransfer.getData("text");
        var dropelem = document.getElementById(dropid);
        var xMove = event.clientX - pos.x;
        var yMove = event.clientY - pos.y;
        
        dropelem.style.top = Math.max(0, pos.top + yMove);
        dropelem.style.left = Math.max(0, pos.left + xMove);
    },

    allowdrop() {
        event.preventDefault();
    }

    //divtest();
}
}

function test() {
    console.log("test");
}
</script>

<style scoped>
    /*moves with the rest of site*/
    #wframecontainer {
        position: relative;
        width: 100%;
        height: 100%;
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
    }

    div.titlebox {
        display: block;
        background-color: yellow;
        border: 1px solid black;
        cursor: default;
    }

    div.textbox {
        display: block;
        cursor: default;
    }


    /*test data to be generated programatically*/
    /*#e001 {
        top: 300px;
        left: 250px;
        height: 100px;
        width: 100px;
    }*/
</style>
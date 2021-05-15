var pos = { top: 0, left: 0, x: 0, y: 0 };
            function moveWhiteboard() {
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
            };

            function dragWhiteboard() {
                var wframe = document.getElementById('whiteboardframe');
                var xMove = event.clientX - pos.x;
                var yMove = event.clientY - pos.y;
                
                wframe.scrollTop = pos.top - yMove;
                wframe.scrollLeft = pos.left - xMove;


            };

            function releaseWhiteboard() {
                var wframe = document.getElementById('whiteboardframe');
                wframe.style.cursor = 'grab';
                wframe.style.removeProperty('userSelect');

                document.removeEventListener('mousemove', dragWhiteboard);
                document.removeEventListener('mouseup', releaseWhiteboard);

            };

            function stopEvent() {
                event.stopPropagation();
            };
        
            function drag() {
                //stopEvent(event);
                event.dataTransfer.setData('text', event.target.id);
                var sty = getComputedStyle(event.target);
        
                pos = {
                left: parseInt(sty.left),
                top: parseInt(sty.top),
                x: event.clientX,
                y: event.clientY,
                };
            };
        
            function drop() {
                event.preventDefault();
                var dropid = event.dataTransfer.getData('text');
                var dropelem = document.getElementById(dropid);
                var xMove = event.clientX - pos.x;
                var yMove = event.clientY - pos.y;

                dropelem.style.top = Math.max(0, pos.top + yMove) + 'px';
                dropelem.style.left = Math.max(0, pos.left + xMove) + 'px';
            };
        
            function allowdrop() {
                event.preventDefault();
            };
        
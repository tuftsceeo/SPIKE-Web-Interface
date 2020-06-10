dragElement("codebox");
dragElement("statusbox");

//logic from https://www.w3schools.com/howto/howto_js_draggable.asp
//translated into jquery syntax
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if ($("#"+ elmnt +"header")) {
        $("#"+ elmnt +"header").mousedown(dragMouseDown);
        console.log("here");
    } else {
        $("#" + elmnt).mousedown(dragMouseDown);
    }

    function dragMouseDown() {
        console.log("mouse is down");
        var e = window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;

        $(document).mousemove(elementDrag);

        $(document).mouseup(closeDragElement);       
    }

    function elementDrag(){
        console.log("mouse moving, elementDrag");
            var e = window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            if($("#" + elmnt)) {
                var offset_top = ($("#" + elmnt).offset().top - pos2) + "px";
                var offset_left = ($("#" + elmnt).offset().left - pos1) + "px";
                $("#" + elmnt).css("top", offset_top);
                $("#" + elmnt).css("left", offset_left);
            }
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        console.log("mouse released, closeDragElement");
        $(document).unbind("mouseup");
        $(document).unbind("mousemove");
    }
    
}

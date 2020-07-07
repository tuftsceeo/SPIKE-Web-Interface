/*
Project Name: SPIKE Prime Web Interface
File name: hoverscript_jquery.js
Author: Jeremy Jung
Date: 6/8/20
Description: Script for movable HTML elements
Credits/inspirations: https://www.w3schools.com/howto/howto_js_draggable.asp
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

dragElement("portA");
dragElement("portB");
dragElement("portC");
dragElement("portD");
dragElement("portE");
dragElement("portF");
dragElement("hub");


//logic from https://www.w3schools.com/howto/howto_js_draggable.asp
//translated into jquery syntax
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    /*
    //to drag the element by its header
    if ($("#"+ elmnt +"header")) {
        $("#"+ elmnt +"header").mousedown(dragMouseDown);
        console.log("here");
    }*/
    //to drag the element itself 
    $("#" + elmnt).mousedown(dragMouseDown);
    

    function dragMouseDown() {
        var e = window.event;
        target_class = e.target.getAttribute("class")
        if (e.target == document.getElementById(elmnt) || target_class == "target_ignore") {
            e.preventDefault();
            pos4 = e.clientY;
            pos3 = e.clientX;

            //console.log(e.target)
            //console.log("mouse is down");

            $(document).mousemove(elementDrag);

            $(document).mouseup(closeDragElement);    
        }   
        //console.log(e.target)
        //console.log(document.getElementById(elmnt))
    }

    function elementDrag(){
        //console.log("mouse moving, elementDrag");
        var e = window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        if($("#" + elmnt)) {

            var offset_top = ($("#" + elmnt).offset().top)
            var offset_left = ($("#" + elmnt).offset().left)

            var new_top = offset_top - pos2;
            var new_left = offset_left - pos1;

            $("#" + elmnt).offset({top: new_top, left: new_left})
        }
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        console.log("mouse released, closeDragElement");
        $(document).unbind("mouseup");
        $(document).unbind("mousemove");
    }
    
}

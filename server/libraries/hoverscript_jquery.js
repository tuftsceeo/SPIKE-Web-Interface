/*
Project Name: SPIKE Prime Web Interface
File name: hoverscript_jquery.js
Author: Jeremy Jung
Last update: 7/6/20
Description: Script for movable HTML elements
Credits/inspirations: https://www.w3schools.com/howto/howto_js_draggable.asp
History: 
    Created by Jeremy on 6/8/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)

Usage:
dragElement("div id") in html modules that you want to move around.
assign class = "target-ignore" in HTML elements in those divs to make them draggable as well
*/

//drag an element 
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
       // console.log("mouse released, closeDragElement");
        $(document).unbind("mouseup");
        $(document).unbind("mousemove");
    }
    
}

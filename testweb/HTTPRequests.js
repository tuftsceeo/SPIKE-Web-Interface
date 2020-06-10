/*
Project Name: SPIKE Prime Web Interface
File name: HTTPRequests.js
Author: Jeremy Jung
Date: 6/10/20
Description: Script for testing AJAX capabilities with System Link
Credits/inspirations:
History: 
    Created by Jeremy on 6/10/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

$(document).ready(new function() {
    var request = new XMLHttpRequest();
    request.open

    $("#submitbutton1").click(function(){
        apikey = document.getElementById("keyinputfield");
        if (checkAPIKey(apikey)) {
            
        }
        dragElement("#codebox")
    });
}); 

function checkAPIKey(apikey) {
    return true;
}
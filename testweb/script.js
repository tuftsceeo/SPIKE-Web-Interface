var apikey;

$(document).ready(new function() {
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
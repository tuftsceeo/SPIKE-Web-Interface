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

var APIkey = ""
var all_tags = [];
//run when document is done loading
$(document).ready(new function() {
    console.log("daddy's home");
    //check APIkey and display available tags whenever there is input
    $("#keyinputfield").on("input", function (event) {
        auth_key($("#keyinputfield").val())
    });

    $("#updateTagValue").click(update_value)
});

//check API key
function auth_key(apikey) {
    console.log(apikey)
    $.ajax({
        url: "https://api.systemlinkcloud.com/niauth/v1/auth",
        headers: {
         "Accept": "application/json",
         "x-ni-api-key": apikey
        }
    })
    .done(function(data) {
     if ( console && console.log ) {
         console.log( "Sample of data:", data);
       }
       $("#key_valid").html("Valid APIkey!")
       APIkey = apikey
       update_tag_selects();
    });
}

//update the tag selection options with already existing tags
function update_tag_selects() {
    $.ajax({
        url: "https://api.systemlinkcloud.com/nitag/v2/tags",
        headers: {
         "Accept": "application/json",
         "x-ni-api-key": APIkey
        }
    })
    .done(function(data) {
     if ( console && console.log ) {
         console.log( "Sample of data:", data);
         var number_of_tags = data.totalCount
         console.log("total count:" + number_of_tags)
         var i
         for (i = 0; i < number_of_tags; i++) {
             //js keys are accessed with [] for integer keys
             tag_name = data.tags[i].path
             all_tags.push(tag_name)
             console.log(tag_name)
             var select_element = $("<option></option>").text(tag_name)
             $("#tagSelect").append(select_element)
         }
       }
    });
}

async function display_select_value() {
    var selected_option = $("#tagSelect option:selected").text(); 
    get_value(selected_option).then((value) => $("#currVal").text(value))
    console.log("here option:" + selected_option);
}

//returns value of tag
async function get_value(tag_path) {
    var response_data;
    await $.ajax({
        url: "https://api.systemlinkcloud.com/nitag/v2/tags/" + tag_path + "/values/current",
        "method": "GET",
        headers: {
            "Accept": "application/json",
            "x-ni-api-key": APIkey
           }
    }).done(function (data){
        if ( console && console.log ) {
            console.log("getValue:", data)
            console.log("data.value.value: ", data.value.value)
            response_data = data.value.value
          }
    })
    return response_data;
}

//doesn't work due to conflict with cross origin policy
//update current value or create new tag with a value
async function update_value() {
    // TO-DO; decide whether tag is selected or new tag to be created
    var selected_option = $("#tagSelect option:selected").text(); 
    var exists = false;
    var new_value = await $("#tagValInput").val();
    console.log("newvalue", new_value)
    for (var i = 0; i < all_tags.length; i++) {
        if ( all_tags[i] == selected_option ) {
            exists = true;
        }
    }
    //check type of new_value
    var inputType = input_type(new_value);
    //update current value
    let data = {"value": {"type": inputType, "value": new_value}};
    console.log("data to send", data)
    console.log("inputtype", inputType)
    if (exists) {
        await $.ajax({
            url: 
            "https://api.systemlinkcloud.com/nitag/v2/tags/" + selected_option + "/values/current",
            "method": "PUT",
            headers: {
                "Content-type": "application/json",
                "x-ni-api-key": "daciN5xlHb-J_eABvDQPRIYt4jrKmbUbCl-Zc2vta7"
            },
            data: JSON.stringify(data)
        }).done(function(data) {
            if ( console && console.log ) {
                console.log("newValue: " + new_value)
                console.log( "Sucess; Sample of data:", data);
              }
        }).fail(function (data){
            if ( console && console.log ) {
                console.log( "Failed; Sample of data:", data);
              }
        })
    }
    else {

    }
    display_select_value();
}

//returns the data type indicator of tag based on given argument
function input_type(new_value) {
    //if the value is not a number
    if ( isNaN(new_value) ) {
        //if the value is a boolean
        if (new_value == "true" || new_value == "false") {
            return "BOOLEAN";
        }
        //if the value is a string
       return "STRING"; 
    }
    //value is a number
    else {
        //if value is an integer
        if ( Number.isInteger(parseFloat(new_value)) ) {
            return "INT"
        }
        //if value is a double
        else {
            return "DOUBLE"
        }
    }
}
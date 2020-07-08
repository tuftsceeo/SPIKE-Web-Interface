/*
Project Name: SPIKE Prime Web Interface
File name: SLajaxlib.js
Author: Jeremy Jung
Last update: 6/17/20
Description: General library for accessing Systemlink cloud data
Credits/inspirations:
    Based on code wrriten by Ethan Danahy, Chris Rogers
History: 
    Created by Jeremy on 6/10/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

//check API key
async function auth_key(apikey) {
    console.log(apikey)
    var is_valid = false
    await $.ajax({
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
       is_valid = true
    });
    return is_valid
}

//get a list of already existing tags
async function get_tag_list(apikey) {
    var tag_list = []
    await $.ajax({
        url: "https://api.systemlinkcloud.com/nitag/v2/tags",
        headers: {
         "Accept": "application/json",
         "x-ni-api-key": apikey
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
             tag_list.push(tag_name)
             console.log(tag_name)
         }
       }
    });
    return tag_list
}

//returns value of a tag on Systemlink
//example:
//value(return) : { type: "BOOLEAN", value: TRUE }
async function get_value(apikey, tag_path) {
    var response_data;
    await $.ajax({
        url: "https://api.systemlinkcloud.com/nitag/v2/tags/" + tag_path + "/values/current",
        "method": "GET",
        headers: {
            "Accept": "application/json",
            "x-ni-api-key": apikey
           }
    }).done(function (data){
        if ( console && console.log ) {
            if(data) {
                response_data = data.value
            }
          }
    })
    return response_data;
}

//download a file from the cloud
//doesn't work yet (conflict with Cross Origin)
async function get_file(apikey) {
    var response_data;
    await $.ajax({
        url: "https://api.systemlinkcloud.com/nifile/v1/service-groups/Default/files",
        headers: {
            "Accept": "application/json",
            "X-NI-API-Key": apikey,
           }
    }).done(function (data){
        if ( console && console.log ) {
            if(data) {
                response_data = data.value.value
            }
          }
    })
    return response_data
}

//testing the message service of system link 
//NOT IMPLEMENTED
async function message_service(apikey) {
    let session_data = { "workspace": "7b25306f-2111-436e-b348-fd52ef6c2efe" };
    let token
    await $.ajax({
        url: "https://api.systemlinkcloud.com/nimessage/v1/sessions",
        "method": "POST",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "x-ni-api-key": apikey
        },
        data: JSON.stringify(session_data)
    }).done(function(data) {
        if ( console && console.log ) {
            console.log( "session creation Sucess; Sample of data:", data);
            token = data.token

        }
    }).fail(function (data){
        if ( console && console.log ) {
            console.log( "Failed; Sample of data:", data);
        }
    })

    console.log("token", token)
    
    let message_data = {
        "topic": "testtopic",
        "message": "testesttest"
    }
    await $.ajax({
        url: "https://api.systemlinkcloud.com/nimessage/v1/sessions/" + token + "/messages",
        "method": "POST",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "x-ni-api-key": apikey
        },
        data: JSON.stringify(message_data)
    }).done(function(data) {
        if ( console && console.log ) {
            console.log( "publish Sucess; Sample of data:", data);
        }
    }).fail(function (data){
        if ( console && console.log ) {
            console.log( "Failed; Sample of data:", data);
        }
    })

    let subscription_data = {"topic": "testtopic"}
    await $.ajax({
        url: "https://api.systemlinkcloud.com/nimessage/v1/sessions/" + token + "/subscriptions/subscribe",
        "method": "POST",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "x-ni-api-key": apikey
        },
        data: JSON.stringify(subscription_data)
    }).done(function(data) {
        if ( console && console.log ) {
            console.log( "subscription Sucess; Sample of data:", data);
        }
    }).fail(function (data){
        if ( console && console.log ) {
            console.log( "Failed; Sample of data:", data);
        }
    })

    await $.ajax({
        url: "https://api.systemlinkcloud.com/nimessage/v1/sessions/" + token + "/messages",
        "method": "GET",
        headers: {
            "Accept": "application/json",
            "x-ni-api-key": apikey
        }
    }).done(function(data) {
        if ( console && console.log ) {
            console.log( "read message:", data);
        }
    }).fail(function (data){
        if ( console && console.log ) {
            console.log( "Failed; Sample of data:", data);
        }
    })  
}

//update current value of an existing tag
async function update_value(apikey, tag_path, inputType, new_value) {
    // TO-DO; decide whether tag is selected or new tag to be created
    let data = {"value": {"type": inputType, "value": new_value}};
    await $.ajax({
        url: 
        "https://api.systemlinkcloud.com/nitag/v2/tags/" + tag_path + "/values/current",
        "method": "PUT",
        headers: {
            "Content-type": "application/json",
            "x-ni-api-key": apikey
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
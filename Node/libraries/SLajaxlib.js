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


/* auth_key() - check if Systemlink API key is valid for use
 * 
 * Parameters:
 * {apikey} (string) - Systemlink API key
 * 
 * Return: 
 * {is_valid} (boolean) - (TRUE if API key valid) (FALSE if invalid)
 * 
 */
async function auth_key(apikey) {
    var is_valid = false
    //send get request
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


/* get_tag_list() - get the list of tags existing in the cloud
 * 
 * Parameters:
 * {apikey} (string) - Systemlink API key
 * 
 * Return: 
 * {tag_list} (array) - an array of the names of the tags
 * 
 */
async function get_tag_list(apikey) {
    
    // return to which tags will be appended
    var tag_list = []

    //send get request
    await $.ajax({
        url: "https://api.systemlinkcloud.com/nitag/v2/tags",
        headers: {
         "Accept": "application/json",
         "x-ni-api-key": apikey
        }
    })
    .done(function(data) {
        //check if console is available (purely for debugging purposes)
        if ( console && console.log ) {
            
            // the total number of tags
            var number_of_tags = data.totalCount

            for ( var i = 0; i < number_of_tags; i++ ) {
                // js keys are accessed with [] for integer keys
                tag_name = data.tags[i].path
                // append to result
                tag_list.push(tag_name)
            }
        }
    });

    return tag_list
}

/* get_value() - get the "value" of a tag
 * 
 * Parameters:
 * {apikey} (string) - Sytemlink API key
 * {tag_path} (string) - name of the tag
 * 
 * Return: 
 * {response_data} (object) - the value of the tag
 * ex) response_data = { type: "BOOLEAN", value: TRUE }
 * 
 * Note:
 * The return is not the actual value, but an object, in which 
 * there is the value of the tag and the value's datatype
 */
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

/* update_value() - update current value of an existing tag
 * 
 * Parameters:
 * {apikey} (string) - Sytemlink API key
 * {tag_path} (string) - name of the tag
 * {inputType} (string) - data type of the new value
 * {new_value} - the new value of the tag
 * 
 */
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

//////////////////////////////////////////
//                                      //
//        UNIMPLEMENTED FUNCTIONS       //
//                                      //
//////////////////////////////////////////

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
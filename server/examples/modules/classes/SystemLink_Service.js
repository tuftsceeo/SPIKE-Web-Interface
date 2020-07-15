/*
Project Name: SPIKE Prime Web Interface
File name: SystemLink_Service.js
Author: Jeremy Jung
Last update: 7/15/20
Description: SystemLink Service Library (OOP)
History:
    Created by Jeremy on 7/15/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

function SystemLink_Service() {
    
    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////
    
    /* private members */

    let tagsInfo = {}; // contains real-time information of the tags in the cloud

    // defined during init
    let APIKey; // string of the valid APIkey

    //////////////////////////////////////////
    //                                      //
    //           Public Functions           //
    //                                      //
    //////////////////////////////////////////

    /* init() - initialize SystemLink_Service
    *
    * Parameters:
    * {APIKeyInput} (string) - SYstemlink APIkey to init service with
    * 
    * Effect: 
    * - defines global variable APIKey for use in other functions
    * 
    * Returns:
    * {boolean} - true if initialization was successful, else false
    * 
    * Note:
    * This function needs to be executed first before executing any other public functions of this class
    */
    async function init(APIKeyInput) {
        try {
            var response = await checkAPIKey( APIKeyInput );
            if ( response ) {
                APIKey = APIKeyInput;
                updateTagsInfo();
                return true;
            }
        }
        catch (e) {
            console.log("Error at initialization", e);
            return false;
        }
    }

    /* getTagsInfo() - return the tagsInfo global variable
    *
    * Returns:
    * {tagsInfo} - object containing basic information about currently existing tags in the cloud
    */
    async function getTagsInfo() {
        return tagsInfo;
    }

    /* setTagValue() - change the current value of a tag on system link cloud
    *
    * Effect:
    * - changes the value of a tag on the cloud
    */
    async function setTagValue(tagName, newValue) {
        updateTagValue(tagName, newValue);
    }

    //////////////////////////////////////////
    //                                      //
    //          Private Functions           //
    //                                      //
    //////////////////////////////////////////

    /* checkAPIKey() - check if Systemlink API key is valid for use
    * 
    * Parameters:
    * {apikey} (string) - Systemlink API key
    * 
    * Return: 
    * {Promise} - if success: boolean true
    *           - if fail: an error and response
    */
    async function checkAPIKey(APIKeyInput) {
        return new Promise(async function (resolve, reject)  {
            var apiKeyAuthURL = "https://api.systemlinkcloud.com/niauth/v1/auth";

            request = await sendXMLHTTPRequest("GET", apiKeyAuthURL, APIKeyInput)

            request.onload = function () {
                resolve(true);
            }

            request.onerror = function() {
                reject(Error(this.response));
            }
        })
    }

    /* updateTagsInfo() - assign list of tags existing in the cloud to {tagPaths} global variable
    * 
    * Effect:
    * modifies global variable {tagPaths}
    * continuously send HTTP requests to SL Cloud (ASYNC INTERVAL)
    * 
    */
    async function updateTagsInfo() {
        setInterval(async function () {

            var collectedTagsInfo = await getTagsInfoFromCloud();

            tagsInfo = collectedTagsInfo;

        }, 1000)
    }

    /* getTagsInfoFromCloud() - get the info of a tag in the cloud
    * 
    * Return: 
    * {Promise} - if success: object containing information on all tags
    *           - if fail: an error and response
    * ex) response_data = { type: "BOOLEAN", value: TRUE }
    * 
    * Note:
    * The return is not the actual value, but an object, in which 
    * there is the value of the tag and the value's datatype
    */
    async function getTagsInfoFromCloud() {
        return new Promise(async function (resolve, reject) {

            var collectedTagsInfo = {}; // to return

            var getMultipleTagsURL = "https://api.systemlinkcloud.com/nitag/v2/tags-with-values";

            // send request to SystemLink API
            request = await sendXMLHTTPRequest("GET", getMultipleTagsURL, APIKey);

            // when transaction is complete, parse response and update return value (collectedTagsInfo)
            request.onload = function () {

                // parse response (string) into JSON object
                responseJSON = JSON.parse(this.response)
                var tagsInfoArray = responseJSON.tagsWithValues;
                // get total number of tags
                var tagsAmount = responseJSON.totalCount;

                for (var i = 0; i < tagsAmount; i++) {

                    // parse information of the tags
                    var value = tagsInfoArray[i].current.value.value;
                    var valueType = tagsInfoArray[i].current.value.type;
                    var tagName = tagsInfoArray[i].tag.path;

                    // store tag information
                    var pathInfo = {};
                    pathInfo["value"] = value;
                    pathInfo["type"] = valueType;

                    // add a tag info to the return object
                    collectedTagsInfo[tagName] = pathInfo;
                }

                resolve(collectedTagsInfo);

            }
            request.onerror = function () {
                reject(Error(this.response));
            }
        })
    }


    /* updateTagValue() - send PUT request to SL cloud API and change the value of a tag
    *
    * Parameters:
    * {tagPath} - string of the name of the tag
    * {newValue} - value to assign tag
    * 
    * Returns:
    * {Promise} - if success: boolean true
    *           - if fail: an error and response
    */
    async function updateTagValue(tagPath, newValue) {
        return new Promise(async function (resolve, reject) {

            var URL = "https://api.systemlinkcloud.com/nitag/v2/tags/" + tagPath + "/values/current";
            var data = { "value": { "type": getValueType(newValue), "value": newValue } };
            var requestBody = data;

            request = await sendXMLHTTPRequest("PUT", URL, APIKey, requestBody);

            request.onload = function () {
                resolve(true);
            }

            request.onerror = function () {
                reject(Error(this.response));
            }
        })
    }


    /* sendXMLHTTPRequest() - helper function for sending XMLHTTPRequests
    *
    * Parameters:
    * {method} (string) - HTTP method (ex. "GET" or "PUT")
    * {URL} (string) - the URL path to send the request to
    * {APIKeyInput} - Systemlink APIKey to use in request for credentials
    * 
    * Return:
    * {request} ( XMLHttpRequest object)
    *
    */
    async function sendXMLHTTPRequest(method, URL, APIKeyInput, body) {
        var request = new XMLHttpRequest();
        request.open(method, URL, true);

        //Send the proper header information along with the request
        request.setRequestHeader("x-ni-api-key", APIKeyInput);

        if (body === undefined) {
            request.setRequestHeader("Accept", "application/json");
            request.send();
        }
        else {
            request.setRequestHeader("Content-type", "application/json");
            requestBody = JSON.stringify(body);
            request.send(requestBody);
        }

        return request;
    }

    /* getValueType() - helper function for getting data types in systemlink format
    *
    * Parameters:
    * {new_value) - the variable containing the new value of a tag
    *
    * Return:
    * (string) - data type of tag
    */
    function getValueType(new_value) {
        //if the value is not a number
        if (isNaN(new_value)) {
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
            if (Number.isInteger(parseFloat(new_value))) {
                return "INT"
            }
            //if value is a double
            else {
                return "DOUBLE"
            }
        }
    }

    /* public members */
    return {
        init: init,
        getTagsInfo: getTagsInfo,
        setTagValue: setTagValue
    }
}
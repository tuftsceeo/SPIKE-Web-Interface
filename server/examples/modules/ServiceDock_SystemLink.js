/*
Project Name: SPIKE Prime Web Interface
File name: ServiceDock_SystemLink.js
Author: Jeremy Jung
Last update: 7/19/20
Description: HTML Element definition for <service-systemlink> to be used in ServiceDocks
Credits/inspirations:
History:
    Created by Jeremy on 7/16/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

// import { Service_SystemLink } from "./Service_SystemLink.js";

class servicesystemlink extends HTMLElement {   

    constructor () {
        super();

        this.active = false; // whether the service was activated
        this.service = new Service_SystemLink(); // instantiate a service object ( one object per button )

        // Create a shadow root
        var shadow = this.attachShadow({ mode: 'open' });

        /* wrapper definition and CSS */
        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');
        wrapper.setAttribute("style", "width: 50px; height: 50px; position: relative; margin-top: 10px;")
        
        /* ServiceDock button definition and CSS */
        
        var button = document.createElement("button");
        button.setAttribute("id", "sl_button");
        button.setAttribute("class", "SD_button");
         /* CSS */
        var imageRelPath = "./modules/views/cloud.png" // relative to the document in which a servicesystemlink is created ( NOT this file )
        var length = 50; // for width and height of button
        var backgroundColor = "#A2E1EF" // background color of the button
        var buttonStyle = "width:" + length + "px; height:" + length + "px; background: url(" + imageRelPath + ") no-repeat; background-size: 40px 40px; background-color:" + backgroundColor 
                + "; border: none; background-position: center; cursor: pointer; border-radius: 10px; position: relative; margin: 4px 0px; "
        button.setAttribute("style", buttonStyle);

        /* status circle definition and CSS */

        var status = document.createElement("div");
        status.setAttribute("class", "status");
        /* CSS */
        var length = 20; // for width and height of circle
        var statusBackgroundColor = "red" // default background color of service (inactive color)
        var posLeft = 30;
        var posTop = 20;
        var statusStyle = "border-radius: 50%; height:" + length + "px; width:" + length + "px; background-color:" + statusBackgroundColor +
         "; position: relative; left:" + posLeft + "px; top:" + posTop + "px;";
        status.setAttribute("style", statusStyle);

        /* event listeners */

        button.addEventListener("mouseleave", function (event) {
            button.style.backgroundColor = "#A2E1EF";
            button.style.color = "#000000";
        });

        button.addEventListener("mouseenter", function(event){
            button.style.backgroundColor = "#FFFFFF";
            button.style.color = "#000000";
        })

        this.addEventListener("click", async function() {
            // check active flag so once activated, the service doesnt reinit
            if ( !this.active ) {
                console.log("activating service");
                var initSuccessful = await this.service.init();
                if (initSuccessful) {
                    this.active = true;
                    status.style.backgroundColor = "green";
                }
            }
        });


        shadow.appendChild(wrapper);
        button.appendChild(status);
        wrapper.appendChild(button);
    }

    /* get the Service_SystemLink object */
    getService() {
        return this.service;
    }

    /* get whether the ServiceDock button was clicked */
    getClicked() {
        return this.active;
    }

    // initialize the service (is not used in this class but available for use publicly)
    async init() {
        var initSuccess = await this.service.init();
        if ( initSuccess ) {
            return true;
        }
        else {
            return false;
        }
    }

}

// when defining custom element, the name must have at least one - dash 
window.customElements.define('service-systemlink', servicesystemlink);

/*
Project Name: SPIKE Prime Web Interface
File name: Service_SystemLink.js
Author: Jeremy Jung
Last update: 7/22/20
Description: SystemLink Service Library (OOP)
History:
    Created by Jeremy on 7/15/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

function Service_SystemLink() {

    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    /* private members */

    let tagsInfo = {}; // contains real-time information of the tags in the cloud

    // defined during init
    let APIKey; // string of the valid APIkey

    let serviceActive = false; // set to true when service goes through init

    let pollInterval = 1000;

    var funcAtInit = undefined; // function to call after init

    //////////////////////////////////////////
    //                                      //
    //           Public Functions           //
    //                                      //
    //////////////////////////////////////////

    /* init() - initialize SystemLink_Service
    *
    * Parameters:
    * OPTIONAL {APIKeyInput} (string) - SYstemlink APIkey to init service with
    * OPTIONAL {pollIntervalInput} (int) - interval at which to get tags from the cloud in MILISECONDS
    * Effect: 
    * - defines global variable APIKey for use in other functions
    * 
    * Returns:
    * {boolean} - true if initialization was successful, else false
    * 
    * Note:
    * This function needs to be executed first before executing any other public functions of this class
    */
    async function init(APIKeyInput, pollIntervalInput) {

        // if an APIKey was specified
        if ( APIKeyInput !== undefined ) {
            var response = await checkAPIKey(APIKeyInput);
            APIKey = APIKeyInput;
        }
        // if no APIkey was specified, use an already existing one
        else {
            APIKey = "daciN5xlHb-J_eABvDQPRIYt4jrKmbUbCl-Zc2vta7";
            var response = await checkAPIKey(APIKey);
        }

        // if response from checkAPIKey is valid
        if ( response ) {
            if ( pollIntervalInput !== undefined ) {
                pollInterval = await pollIntervalInput;
            }
            // initialize the tagsInfo global variable
            updateTagsInfo();
            active = true;
            
            await sleep(2000); // wait for service to init

            // call funcAtInit if defined
            if (funcAtInit !== undefined) {
                funcAtInit();
            }

            return true;
        }
        else {
            return false;
        }
    }

    /* executeAfterInit() - get the callback function to execute after service is initialized
    *
    * Parameter:
    * {callback} (function) - function to execute after initialization
    * Effect:
    * - assigns global variable funcAtInit a pointer to callback function
    *
    * Note:
    * This function needs to be executed before calling init()
    */
    function executeAfterInit(callback) {
        funcAtInit = callback;
    }


    /* getTagsInfo() - return the tagsInfo global variable
    *
    * Returns:
    * {tagsInfo} (object) - object containing basic information about currently existing tags in the cloud
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
        return updateTagValue(tagName, newValue);
    }

    /* isActive() - get whether the Service was initialized or not
    *
    * Returns:
    * {serviceActive} (boolean) - whether Service was initialized or not
    */
    function isActive(){
        return serviceActive;
    }

    //////////////////////////////////////////
    //                                      //
    //          Private Functions           //
    //                                      //
    //////////////////////////////////////////

    //sleep function
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /* checkAPIKey() - check if Systemlink API key is valid for use
    * 
    * Parameters:
    * {apikey} (string) - Systemlink API key
    * 
    * Return: 
    * {Promise} - if success: resolve(true)
    *           - if fail: reject(error)
    */
    async function checkAPIKey(APIKeyInput) {
        return new Promise(async function (resolve, reject) {
            var apiKeyAuthURL = "https://api.systemlinkcloud.com/niauth/v1/auth";

            var request = await sendXMLHTTPRequest("GET", apiKeyAuthURL, APIKeyInput)

            request.onload = function () {

                var response = JSON.parse(request.response);

                if (response.error) {
                    reject(new Error("Error at apikey auth:", response));
                }
                else {
                    console.log("APIkey is valid")
                    resolve(true)
                }

            }

            request.onerror = function () {
                var response = JSON.parse(request.response);
                // console.log("Error at apikey auth:", request.response);
                reject(new Error("Error at apikey auth:", response));
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

            // if the object is defined and not boolean false
            if (collectedTagsInfo) {
                tagsInfo = collectedTagsInfo;
            }

        }, pollInterval)
    }

    /* getTagsInfoFromCloud() - get the info of a tag in the cloud
    * 
    * Return: 
    * {Promise} - if success: resolve(collectedTagsInfo)
    *           - if fail: reject(error)
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
            var request = await sendXMLHTTPRequest("GET", getMultipleTagsURL, APIKey);

            // when transaction is complete, parse response and update return value (collectedTagsInfo)
            request.onload = async function () {

                // parse response (string) into JSON object
                var responseJSON = JSON.parse(this.response)
                var tagsInfoArray = responseJSON.tagsWithValues;
                // get total number of tags
                var tagsAmount = responseJSON.totalCount;

                for (var i = 0; i < tagsAmount; i++) {

                    // parse information of the tags
                    var value = tagsInfoArray[i].current.value.value;
                    var valueType = tagsInfoArray[i].current.value.type;
                    var tagName = tagsInfoArray[i].tag.path;

                    var valueToAdd = await getValueFromType(valueType, value);
                    // store tag information
                    var pathInfo = {};
                    pathInfo["value"] = valueToAdd;
                    pathInfo["type"] = valueType;

                    // add a tag info to the return object
                    collectedTagsInfo[tagName] = pathInfo;
                }

                resolve(collectedTagsInfo)

            }
            request.onerror = function () {
                reject(new Error("Error at getTagsInfoFromCloud"));
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
    * {Promise} - if success: resolve(true)
    *           - if fail: reject(error)
    */
    async function updateTagValue(tagPath, newValue) {
        return new Promise(async function (resolve, reject) {

            var URL = "https://api.systemlinkcloud.com/nitag/v2/tags/" + tagPath + "/values/current";
            var data = { "value": { "type": getValueType(newValue), "value": newValue } };
            var requestBody = data;

            var request = await sendXMLHTTPRequest("PUT", URL, APIKey, requestBody);

            request.onload = function () {
                resolve(true);
            }

            request.onerror = function () {
                reject(new Error("Error at updateTAagValue"));
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
            var requestBody = JSON.stringify(body);
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

    /* getValueType() - helper function for converting values to correct type based on datatype
    *
    * Parameters:
    * {valueType} - typeof value in systemlink format
    * {value} - value to convert
    * 
    * Return:
    * (value) - value in correct data type
    */
    function getValueFromType(valueType, value) {
        if (valueType == "BOOLEAN") {
            if (value == "true") {
                return true;
            }
            else {
                return false;
            }
        }
        else if (valueType == "STRING") {
            return value;
        }
        else if (valueType == "INT" || valueType == "DOUBLE") {
            return parseFloat(value);
        }
        return value;
    }

    /* public members */
    return {
        init: init,
        getTagsInfo: getTagsInfo,
        setTagValue: setTagValue,
        executeAfterInit: executeAfterInit,
        isActive: isActive
    }
}
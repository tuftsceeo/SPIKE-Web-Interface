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
        this.proceed = false; // if there are credentials input

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
        //var imageRelPath = "./modules/views/systemlinkIcon.png" // relative to the document in which a servicesystemlink is created ( NOT this file )
        var length = 50; // for width and height of button
        var backgroundColor = "#A2E1EF" // background color of the button
        var buttonStyle = "width:" + length + "px; height:" + length + "px; background:" + "url('data:image/png;base64,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')" + "no-repeat; background-size: 50px 50px; background-color:" + backgroundColor 
                + "; border: none; background-position: center; cursor: pointer; border-radius: 10px; position: relative; margin: 4px 0px; "
        button.setAttribute("style", buttonStyle);

        /* status circle definition and CSS */

        this.status = document.createElement("div");
        this.status.setAttribute("class", "status");
        
        /* CSS */
        var length = 20; // for width and height of circle
        var statusBackgroundColor = "red" // default background color of service (inactive color)
        var posLeft = 30;
        var posTop = 20;
        var statusStyle = "border-radius: 50%; height:" + length + "px; width:" + length + "px; background-color:" + statusBackgroundColor +
         "; position: relative; left:" + posLeft + "px; top:" + posTop + "px;";
        this.status.setAttribute("style", statusStyle);

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

            if ( !this.active ) {
                this.popUpBox();
            }

            // check active flag so once activated, the service doesnt reinit
            if ( !this.active && this.proceed) {
                
                console.log("activating service");
                
                var initSuccessful = await this.service.init(this.APIKey);
                
                if (initSuccessful) {
                    this.active = true;
                    this.status.style.backgroundColor = "green";
                }

            }

        });

        shadow.appendChild(wrapper);
        button.appendChild(this.status);
        wrapper.appendChild(button);
    }

    /* Ask user for API credentials */
    popUpBox() {
        var APIKeyExists = true;

        var APIKeyResult = prompt("Please enter your System Link Cloud API Key:", "daciN5xlHb-J_eABvDQPRIYt4jrKmbUbCl-Zc2vta7");
        // APIkey 
        if ( APIKeyResult == null || APIKeyResult == "" ) {
            console.log("You inserted no API key");
            APIKeyExists = false;
        }
        else {
            APIKeyExists = true;
            this.APIKey = APIKeyResult;
        }

        if ( APIKeyExists ) {
            this.proceed = true;
        }
    }

    /* for Service's API credentials */

    static get observedAttributes() {
        return ["apikey"];
    }

    get apikey() {
        return this.getAttribute("apikey");
    }

    set apikey(val) {
        console.log(val);
        if ( val ) {
            this.setAttribute("apikey", val);
        }
        else {
            this.removeAttribute("apikey");
        }
    }

    attributeChangedCallback (name, oldValue, newValue) {
        this.APIKey = newValue;
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
        var initSuccess = await this.service.init(this.APIKey);
        if (initSuccess) {
            this.status.style.backgroundColor = "green";
            this.active = true;
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
Last update: 8/04/20
Description: SystemLink Service Library (OOP)
History:
    Created by Jeremy on 7/15/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

/**
 * 
 * @class Service_SystemLink
 * @example
 * // if you're using ServiceDock
 * var mySL = document.getElemenyById("service_systemlink").getService();
 * mySL.setAttribute("apikey", "YOUR API KEY");
 * mySL.init();
 * 
 * // if you're not using ServiceDock
 * var mySL = new Service_SystemLink();
 * 
 * mySL.init(APIKEY);
 */
function Service_SystemLink() {

    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    /* private members */

    let tagsInfo = {}; // contains real-time information of the tags in the cloud

    let APIKey = "API KEY";

    let serviceActive = false; // set to true when service goes through init

    let pollInterval = 1000;

    var funcAtInit = undefined; // function to call after init

    //////////////////////////////////////////
    //                                      //
    //           Public Functions           //
    //                                      //
    //////////////////////////////////////////

    /** initialize SystemLink_Service
     * <p> Starts polling the System Link cloud </p>
     * <p> <em> this function needs to be executed after executeAfterInit but before all other public functions </em> </p>
     * 
     * @public
     * @param {string} APIKeyInput SYstemlink APIkey
     * @param {integer} pollIntervalInput interval at which to get tags from the cloud in MILISECONDS
     * @returns {boolean} True if service was successsfully initialized, false otherwise
     * 
     */
    async function init(APIKeyInput, pollIntervalInput) {

        // if an APIKey was specified
        if (APIKeyInput !== undefined) {
            APIKey = APIKeyInput;
        }

        var response = await checkAPIKey(APIKey);

        // if response from checkAPIKey is valid
        if (response) {

            if (pollIntervalInput !== undefined) {
                pollInterval = await pollIntervalInput;
            }

            // initialize the tagsInfo global variable
            updateTagsInfo(function () {

                active = true;

                // call funcAtInit if defined
                if (funcAtInit !== undefined) {

                    funcAtInit();
                }
            });

            return true;
        }
        else {
            return false;
        }
    }

    /** Get the callback function to execute after service is initialized
     * <p> <em> This function needs to be executed before calling init() </em> </p>
     * 
     * @public
     * @param {function} callback function to execute after initialization
     * @example
     * mySL.executeAfterInit( function () {
     *     var tagsInfo = await getTagsInfo();
     * })
     */
    function executeAfterInit(callback) {
        // Assigns global variable funcAtInit a pointer to callback function
        funcAtInit = callback;
    }

    /** Return the tagsInfo global variable
     * 
     * @public
     * @returns basic information about currently existing tags in the cloud
     * @example
     * var tagsInfo = await mySL.getTagsInfo();
     * var astringValue = tagsInfo["astring"]["value"];
     * var astringType = tagsInfo["astring"]["type"];
     */
    async function getTagsInfo() {
        return tagsInfo;
    }

    /** Change the current value of a tag on SystemLink cloud
     * 
     * @public
     * @param {string} tagName 
     * @param {any} newValue 
     * @param {function} callback 
     */
    async function setTagValue(tagName, newValue, callback) {
        // changes the value of a tag on the cloud
        changeValue(tagName, newValue, function(valueChanged) {
            if (valueChanged) {
                typeof callback === 'function' && callback();
            }
        });
    }

    /** Get the current value of a tag on SystemLink cloud
     * 
     * @public
     * @param {string} tagName 
     * @returns {any} current value of tag
     */
    async function getTagValue(tagName) {

        var currentValue = tagsInfo[tagName].value;

        return currentValue;
    }

    /** Get whether the Service was initialized or not
     * 
     * @public
     * @returns {boolean} whether Service was initialized or not
     */
    function isActive() {
        return serviceActive;
    }

    /** Change the APIKey
     * @ignore
     * @param {string} APIKeyInput 
     */
    function setAPIKey(APIKeyInput) {
        // changes the global variable APIKey
        APIKey = APIKeyInput;
    }
    
    /** Create a new tag
     * 
     * @public
     * @param {string} tagName name of tag to create
     * @param {any} tagValue value to assign the tag after creation
     * @param {function} callback optional callback
     * @example
     * mySL.createTag("message", "hi", function () {
     *      mySL.setTagValue("message", "bye"); 
     * })
     */
    async function createTag(tagName, tagValue, callback) {
        
        // get the SystemLink formatted data type of tag
        var valueType = getValueType(tagValue);

        // create a tag with the name and data type. If tag exists, it still returns successful response
        createNewTagHelper(tagName, valueType, function (newTagCreated) {
            
            // after tag is created, assign a value to it
            changeValue(tagName, tagValue, function (newTagValueAssigned) {

                // execute callback if successful
                if (newTagCreated) {
                    if (newTagValueAssigned) {
                        typeof callback === 'function' && callback();
                    }
                }
            })
        })
    }

    /** Delete tag
     * 
     * @public
     * @param {string} tagName name of tag to delete
     * @param {function} callback optional callback
     */
    async function deleteTag(tagName, callback) {
        // delete the tag on System Link cloud
        deleteTagHelper(tagName, function (tagDeleted) {
            if ( tagDeleted ) {
                typeof callback === 'function' && callback();
            }
        });
    }

    //////////////////////////////////////////
    //                                      //
    //          Private Functions           //
    //                                      //
    //////////////////////////////////////////


    /** sleep function
     * 
     * @private
     * @param {integer} ms 
     * @returns {Promise}
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /** Check if Systemlink API key is valid for use
     * 
     * @private
     * @param {string} APIKeyInput 
     * @returns {Promise} resolve(true) or reject(error)
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

    /** Assign list of tags existing in the cloud to {tagPaths} global variable
     * 
     * @private
     * @param {function} callback 
     */
    async function updateTagsInfo(callback) {

        // get the tags the first time before running callback
        getTagsInfoFromCloud(function (collectedTagsInfo) {

            // if the collectedTagsInfo is defined and not boolean false
            if (collectedTagsInfo) {
                tagsInfo = collectedTagsInfo;
            }

            // after tagsInfo is initialized, begin the interval to update it
            setInterval(async function () {

                getTagsInfoFromCloud(function (collectedTagsInfo) {

                    // if the object is defined and not boolean false
                    if (collectedTagsInfo) {
                        tagsInfo = collectedTagsInfo;
                    }
                });

            }, pollInterval)

            // run the callback of updateTagsInfo inside init()
            callback();

        });

    }

    /** Get the info of a tag in the cloud
     * 
     * @private
     * @param {function} callback 
     */
    async function getTagsInfoFromCloud(callback) {

        // make a new promise
        new Promise(async function (resolve, reject) {

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

                    try {
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
                    // when value is not yet assigned to tag
                    catch (e) {
                        var value = null
                        var valueType = tagsInfoArray[i].tag.type;
                        var tagName = tagsInfoArray[i].tag.path;

                        // store tag information
                        var pathInfo = {};
                        pathInfo["value"] = value;
                        pathInfo["type"] = valueType;

                        // add a tag info to the return object
                        collectedTagsInfo[tagName] = pathInfo;
                    }
                }

                resolve(collectedTagsInfo)

            }
            request.onerror = function () {

                console.log(this.response);

                reject(false);

            }
        }).then(
            // success handler 
            function (resolve) {
                //run callback with resolve object
                callback(resolve);
            },
            // failure handler
            function (reject) {
                // run calllback with reject object
                callback(reject);
            }
        )
    }

    /** Send PUT request to SL cloud API and change the value of a tag
     * 
     * @private
     * @param {string} tagPath string of the name of the tag
     * @param {any} newValue value to assign tag
     * @param {function} callback
     */
    async function changeValue(tagPath, newValue, callback) {
        new Promise(async function (resolve, reject) {

            var URL = "https://api.systemlinkcloud.com/nitag/v2/tags/" + tagPath + "/values/current";

            var valueType = getValueType(newValue);

            // value is not a string
            if (valueType != "STRING") {
                // newValue will have no quotation marks before being stringified
                var stringifiedValue = JSON.stringify(newValue);

                var data = { "value": { "type": valueType, "value": stringifiedValue } };

            }
            // value is a string
            else {
                // newValue will already have quotation marks before being stringified, so don't stringify
                var data = { "value": { "type": valueType, "value": newValue } };
            }

            var requestBody = data;

            var request = await sendXMLHTTPRequest("PUT", URL, APIKey, requestBody);

            request.onload = function () {
                resolve(true);
            }

            request.onerror = function () {
                reject(false);
            }

            // catch error
            request.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && (this.status != 200) ) {
                    console.log(this.status + " Error at changeValue: ", this.response)
                }
            }


        }).then(
            // success handler
            function (resolve) {
                callback(resolve);
            },
            function (reject) {
                callback(reject);
            }
        )
    }

    /** Send PUT request to SL cloud API and change the value of a tag
     * 
     * @private
     * @param {string} tagPath name of the tag
     * @param {string} tagType SystemLink format data type of tag
     * @param {function} callback 
     */
    async function createNewTagHelper(tagPath, tagType, callback) {
        new Promise(async function (resolve, reject) {

            var URL = "https://api.systemlinkcloud.com/nitag/v2/tags/";

            var data = { "type": tagType, "properties": {}, "path": tagPath, "keywords": [], "collectAggregates": false };

            var requestBody = data;

            var request = await sendXMLHTTPRequest("POST", URL, APIKey, requestBody);

            request.onload = function () {
                resolve(true);
            }

            request.onerror = function () {
                console.log("Error at createNewTagHelper", request.response);
                reject(false);
            }

            // catch error
            request.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && (this.status != 200 && this.status != 201)) {
                    console.log(this.status + " Error at createNewTagHelper: ", this.response)
                }
            }

        }).then(
            // success handler
            function (resolve) {
                callback(resolve)
            },
            // error handler
            function (reject) {
                callback(reject)
            }
        )
    }

    /** Delete the tag on the System Link cloud
     * 
     * @private
     * @param {string} tagName 
     * @param {function} callback 
     */
    async function deleteTagHelper ( tagName, callback ) {
        new Promise(async function (resolve, reject) {

            var URL = "https://api.systemlinkcloud.com/nitag/v2/tags/" + tagName;

            var request = await sendXMLHTTPRequest("DELETE", URL, APIKey);

            request.onload = function () {
                resolve(true);
            }

            request.onerror = function () {
                console.log("Error at deleteTagHelper", request.response);
                reject(false);
            }

            // catch error
            request.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && this.status != 200) {
                    console.log(this.status + " Error at deleteTagHelper: ", this.response)
                }
            }

        }).then(
            // success handler
            function (resolve) {
                callback(resolve)
            },
            // error handler
            function (reject) {
                callback(reject)
            }
        )
    }

    /** Helper function for sending XMLHTTPRequests
     * 
     * @private
     * @param {string} method 
     * @param {string} URL 
     * @param {string} APIKeyInput 
     * @param {object} body 
     * @returns {object} XMLHttpRequest
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
            try {
                request.send(requestBody);
            } catch (e) {
                console.log("error sending request:", request.response);
            }
        }

        return request;
    }

    /** Helper function for getting data types in systemlink format
     * 
     * @private
     * @param {any} new_value the variable containing the new value of a tag
     * @returns {string} data type of tag
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

    /** Helper function for converting values to correct type based on data type
     * 
     * @private
     * @param {string} valueType data type of value in systemlink format
     * @param {string} value value to convert
     * @returns {any} converted value
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
        getTagValue: getTagValue,
        executeAfterInit: executeAfterInit,
        setAPIKey: setAPIKey,
        isActive: isActive,
        createTag: createTag,
        deleteTag: deleteTag
    }
}
/*
Project Name: SPIKE Prime Web Interface
File name: ServiceDock_Airtable.js
Author: Grace Kayode
Last update: 11/5/20
Description: HTML Element definition for <service-airtable> to be used in ServiceDocks
Credits/inspirations:
    Airtable browser API (https://github.com/Airtable/airtable.js)
History:
    Created by Jeremy on 7/20/20, Edited by Grace 11/1/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

/* ServiceDock HTML Element Definition */
// document.writeln("<script type='text/javascript' src='ServiceDock_Airtable.js'></script>");

class serviceairtable extends HTMLElement {

    constructor() {
        super();

        this.active = false; // whether the service was activated
        this.service = new Service_Airtable(); // instantiate a service object ( one object per button )
        this.proceed = false; // if there are credentials input
        this.APIKey;
        this.BaseID;
        this.TableName;

        // Create a shadow root
        var shadow = this.attachShadow({ mode: 'open' });

        /* wrapper definition and CSS */
        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');
        wrapper.setAttribute("style", "width: 50px; height: 50px; position: relative; margin-top: 10px;")

        /* ServiceDock button definition and CSS */

        var button = document.createElement("button");
        button.setAttribute("id", "airtableid_button");
        button.setAttribute("class", "airtablecl_button");
        /* CSS */
        //var imageRelPath = "./modules/views/airtable-logo.png" // relative to the document in which a servicesystemlink is created ( NOT this file )
        var length = 50; // for width and height of button
        var backgroundColor = "#A2E1EF" // background color of the button

        // the icon is base64 encoded
        var buttonStyle = "width:" + length + "px; height:" + length + "px; background:" + "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAYAAAB/HSuDAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAABYlAAAWJQFJUiTwAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAABAAElEQVR4AezdB5xlRZnw/5rpMN093RMZMpIxIKCSlLRIUKIRECQNGbOurq/r7r7r7v5dd/d11V1FERCGnIOCgmRBEAREQVBAcg6TZzqH/6+me5Bhum/ovuGEX30+D91z7wl1vucOc+upOlUhWBRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQ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QIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIDA0wT+f7QY7l64VTJRAAAAAElFTkSuQmCC')" + " no-repeat; background-size: 40px 40px; background-color:" + backgroundColor
            + "; border: none; background-position: center; cursor: pointer; border-radius: 10px; position: relative; margin: 4px 0px; "
        button.setAttribute("style", buttonStyle);

        /* status circle definition and CSS */

        this.status = document.createElement("div");
        this.status.setAttribute("class", "status");

        /* CSS */
        var length = 20; // for width and height of circle
        var statusBackgroundColor = "red" // default background color of service (inactive color)
        var posLeft = 30;
        var posTop = 20;
        var statusStyle = "border-radius: 50%; height:" + length + "px; width:" + length + "px; background-color:" + statusBackgroundColor +
            "; position: relative; left:" + posLeft + "px; top:" + posTop + "px;";
        this.status.setAttribute("style", statusStyle);

        /* event listeners */

        button.addEventListener("mouseleave", function (event) {
            button.style.backgroundColor = "#A2E1EF";
            button.style.color = "#000000";
        });

        button.addEventListener("mouseenter", function (event) {
            button.style.backgroundColor = "#FFFFFF";
            button.style.color = "#000000";
        })


        this.addEventListener("click", async function () {

            if (!this.active) {
                this.popUpBox();
            }

            // check active flag so once activated, the service doesnt reinit
            if (!this.active && this.proceed) {

                console.log("activating service");

                var initSuccessful = await this.service.init(this.APIKey);
                var initSuccessful2 = await this.service.init(this.BaseID);
                var initSuccessful3 = await this.service.init(this.TableName);

                if (initSuccessful && initSuccessful2 && initSuccessful3) {
                    this.active = true;
                    this.status.style.backgroundColor = "green";
                }

            }

        });


        shadow.appendChild(wrapper);
        button.appendChild(this.status);
        wrapper.appendChild(button);
    }

    /* Ask user for API credentials with an alert */
    // DEV: credentials will differ by service

    popUpBox() {
        // flags to check if users' input exists
        // DEV: add as many as needed
        var APIKeyExists = true;
        var BaseIDKeyExists = true;
        var TableNameExists = true;

        // prompt user for input
        // DEV: add as many as needed
        var APIKeyResult = prompt("Please enter your API Key:");
        var BaseIDKeyResult = prompt("Please enter your BaseID Key:");
        var TableNameResult = prompt("Please enter your Base Table Name:");
        
        // if the user did not input any field, flag nonexistant field
        if (APIKeyResult == null || APIKeyResult == "") {
            console.log("You inserted no API key");
            APIKeyExists = false;
        }
        // if user did input field, flag existing field and store data
        else {
            APIKeyExists = true;
            this.APIKey = APIKeyResult;
        }

        // if the user did not input any field, flag nonexistant field
        if (BaseIDKeyResult == null || BaseIDKeyResult == "") {
            console.log("You inserted no Base key");
            BaseIDKeyExists = false;
        }
        // if user did input field, flag existing field and store data
        else {
            BaseIDKeyExists = true;
            this.BaseID = BaseIDKeyResult;
        }

        // if the user did not input any field, flag nonexistant field
        if (TableNameResult == null || TableNameResult == "") {
            console.log("You inserted no Base Table Name");
            TableNameExists = false;
        }
        // if user did input field, flag existing field and store data
        else {
            TableNameExists = true;
            this.TableName = TableNameResult;
        }

        // proceed if user input an API Key & Base ID field
        if (APIKeyExists && BaseIDKeyExists && TableNameExists) {
            this.proceed = true;
        }

        

    }

    /* allow credentials input through HTML attributes */
    // DEV: add more fields as needed
    
    // observe the attributes listed
    static get observedAttributes() {
        return ["apikey", "baseid", "tablename"];
    }

    /* getter and setter methods for credentials.*/
    get apikey() {
        return this.getAttribute("apikey");
    }
    get baseid() {
        return this.getAttribute("baseid");
    }
    get tablename() {
        return this.getAttribute("tablename");
    }


    set apikey(val) {
        console.log(val);
        if (val) {
            this.setAttribute("apikey", val);
        }
        else {
            this.removeAttribute("apikey");
        }
    }

    set baseid(val) {
        console.log(val);
        if (val) {
            this.setAttribute("baseid", val);
        }
        else {
            this.removeAttribute("baseid");
        }
    }

    set tablename(val) {
        console.log(val);
        if (val) {
            this.setAttribute("tablename", val);
        }
        else {
            this.removeAttribute("tablename");
        }
    }

    // change the API key 
    attributeChangedCallback(name, oldValue, newValue) {
        // console.log("changing attribute: ", name);
        if (name == "apikey") {
            console.log("newvalue of apikey:", newValue);
            this.APIKey = newValue;
        }
        else if (name == "baseid") {
            this.BaseID = newValue
        }
        else if (name == "tablename") {
            this.TableName = newValue
        }
        
    }

    /* functions on the HTML element */

    /* get the Service object */
    getService() {
        return this.service;
    }

    /* get whether the ServiceDock button was clicked */
    getClicked() {
        return this.active;
    }

    // initialize the service (is not used in this class but available for use publicly)
    async init() {
        console.log("apikey attribute value: ", this.APIKey);
        console.log("baseid attribute value: ", this.BaseID);
        console.log("tablename attribute value: ", this.TableName);
        var initSuccess = await this.service.init(this.APIKey, this.BaseID, this.TableName);
        if (initSuccess) {
          this.status.style.backgroundColor = "green";
          return true;
        }
        else {
            return false;
        }
    }

}

// when defining custom element, the name must have at least one - dash 
window.customElements.define('service-airtable', serviceairtable);

/* ServiceDock class Definition */

/**
 *
 * Service_Airtable
 * // if you're using ServiceDock
 * var mySL = document.getElemenyById("service_Template").getService();
 * // if you're not using ServiceDock
 * var myExampleService = new Service_Template();
 *
 * myExampleService.init();
 **/

/** Assumes your workspace only consists of two columns of records
 * that are "Name" and "Value", each of a single line text type
 * @class Service_Airtable
 * @example
 * // if you're using ServiceDock
 * var myAirtable = document.getElemenyById("service_airtable").getService();
 * // if you're not using ServiceDock
 * var myAirtable = new Service_Airtable();
 *
 * myAirtable.init(APIKEY, BASEID, TABLENAME);
 */
function Service_Airtable() {

    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    /* private members */

    /*
    currentData = {
      Name_field: Value_field
    };
    */
    let currentData= {}; // contains real-time information of the tags in the cloud

    let recordIDNameMap = {}; // map Name fields to its record ID

    /* DEV: API credentials, add or remove as needed for your API */
    let APIKey = "API KEY"; // default APIKey in case no APIKey is given on init

    let serviceActive = false; // set to true when service goes through init

    let BaseID = "BASE ID";
    let TableName = "Table Name";
    let pollInterval = 1000; // interval at which to continuously poll the external API

    var base = undefined;
    var table = undefined;

    var funcAtInit = undefined; // function to call after init
    

    //////////////////////////////////////////
    //                                      //
    //           Public Functions           //
    //                                      //
    //////////////////////////////////////////

    /** initialize Service_Template 
     * Starts polling the external API
     * <em> this function needs to be executed after executeAfterInit but before all other public functions </em> 
     * 
     * @public
     * @ignore
     * @param {string} APIKeyInput API Key
     * @param {string} BaseIDInput Base ID for Table in which data is stored
     * @param {string} TableNameInput Table Name of Base
     * @returns {boolean} True if service was successsfully initialized, false otherwise
     * 
     */
    async function init(APIKeyInput, BaseIDInput, TableNameInput) {

        var credentialsValid = false;
        
        // if an APIKey was specified, use the specified key
        if (APIKeyInput !== undefined) {
            APIKey = APIKeyInput;
        }
        
        // if an BaseIDKey was specified, use the specified key
        if (BaseIDInput !== undefined) {
            BaseID = BaseIDInput;
        }

        // if an TableName was specified, use the specified key
        if (TableNameInput !== undefined) {
            TableName = TableNameInput;

        }

        console.log(BaseID);

        const Airtable = require('airtable');

        try {
            base = new Airtable({ apiKey: APIKey }).base(BaseID);
            credentialsValid = true;
        }
        catch (e) {
            return false;
        }

        console.log(base);
        // console.log(apiKey);

        table = base(TableName);

        // if the credentials are valid authorization
        if (credentialsValid) {

          beginDataStream(function () {
            console.log(funcAtInit)
            // call funcAtInit if defined from executeAfterInit
            if (funcAtInit !== undefined) {
              funcAtInit();
            }
          });

          return true;
        }
        else {
            return false;
        }
    }

    /** Get the callback function to execute after service is initialized
     *  <em> This function needs to be executed before calling init() </em>
     * 
     * @public
     * @param {function} callback function to execute after initialization
     * @example
     * myAirtable.executeAfterInit( function () {
     *     // your API code
     * })
     */
    function executeAfterInit(callback) {
        // Assigns global variable funcAtInit a pointer to callback function
        funcAtInit = callback;
    }

    /** Get whether the Service was initialized or not
    *
    * @public
    * @returns {boolean} whether Service was initialized or not
    */
    function isActive() {
        return serviceActive;
    }
    
    /** Get all the entries only in 'Name' column, which are keys
     * @public
     * @returns {array}
     */
    function getNames() {
      var names = [];

      for (var key in currentData) {
        names.push(key);
      }

      return names;
    }

    /** Create a Name & Value pair if it doesn't exist
     * @public
     * @param {string} name 
     * @param {string} value 
     * @param {function} callback
     */
    function createNameValuePair(name, value, callback) {
      // only create new pair if name does not yet exist
      if (currentData[name] == undefined) {
        createName({Name: name, Value: value});
        if (callback != undefined ) {
          callback();
        }
      }
      else {
        if (callback != undefined) {
          callback();
        }
      }
    }

    /** Get the Value field associated with a Name
     * @public
     * @param {string} name name of the Name entry
     * @returns {any} Value associated with the given Name
     */
    function getValue(name) {
      return convertToDataType(currentData[name]);
    }

    /** Update the Value field associated with a Name 
     * @public
     * @param {string} name 
     * @param {string} newValue 
     */
    function updateValue(name, newValue) {
      var recordID = recordIDNameMap[name];
      var convertedValue = convertToString(newValue);
      var requestBody = { Name: name, Value: convertedValue };
      updateRecord(recordID, requestBody);
    }

    /** Delete a record given a record ID
     * @public
     * @param {any} id 
     */
    const deleteRecord = async (id) => {
        try {
            const deletedRecord = await table.destroy(id);
            console.log(minifyRecord(deletedRecord));
        } catch (err) {
            console.error(err);
        }
    };

    //////////////////////////////////////////
    //                                      //
    //          Private Functions           //
    //                                      //
    //////////////////////////////////////////


    /** get an initial reading of the table, and then initialize global variable currentData
     * @private
     * 
     */
    async function beginDataStream(callback) {
      var records = await base(TableName).select().firstPage(function(err, records) {
        if (err) {
          console.log(err);
          return false;
        }
        console.log(records);
        // initialize currentData global variable
        for (var key in records) {
          var name = records[key].fields.Name;
          var value = records[key].fields.Value;
          var recordID = records[key].id;

          currentData[name] = value;
          recordIDNameMap[name] = recordID;
        }

        console.log("currentData: ", currentData);
        setTimeout( function () {
          setInterval(async function () {

            var records = await base(TableName).select().firstPage();

            // if the object is defined and not boolean false
            if (records) {
              currentData = {}; // reinitialize currentData in case some info was deleted outside
              // initialize currentData global variable
              for (var key in records) {
                var name = records[key].fields.Name;
                var value = records[key].fields.Value;
                var recordID = records[key].id;

                currentData[name] = value;
                recordIDNameMap[name] = recordID;
              }
            }

          }, 200)

          callback();
        }, 2000);

      });
    }

    /** Update the record(row) with given fields
     * @private
     * @param {integer} rowNumber row number to update
     * @param {object} fields an object with given fields to update row with
     */
    async function updateRecord(recordID, fields) {
      const updatedRecord = await table.update(recordID, fields);
      console.log(minifyRecord(updatedRecord));
    }

    /** Creates a new entry of specified data fields that gets pushed to Airtable
    * @param {string} fields passed in data fields
    */
    const createName = async (fields) => {
      const createdName = await table.create(fields);
      console.log(minifyRecord(createdName));
    };

    /** Get the content of a record/row in minified format
     * @private
     * @param {any} record 
     * @returns {object}
     */
    const minifyRecord = (record) => {
      return {
        id: record.id,
        fields: record.fields,
      };
    };

    /** Display a record by its recordID
    * @private
    * @param {any} id 
    */
    const getRecordById = async (id) => {
      const record = await table.find(id);
      console.log(record);
    };


    /** Get 50 pieces of "row" information
     * @private
     * @returns records
     */
    const getRecords = async () => {
      const records = await table.select({
        maxRecords: 50, view: 'Main View'
      }).firstPage();

      return records;
    }


    /** convert a string variable to a JS variable of its presumed data type
     * @private
     * @param {string} input 
     * @returns {any} type converted variable
     */
    function convertToDataType(input) {
      input = input.trim();
      var convertedInput;
      // string is not a pure number
      if (isNaN(input)) {
        // string is a boolean
        if (input == "True" || input == "true") {
          convertedInput = true;
        }
        else if (input == "False" || input == "false") {
          convertedInput = false;
        }
        // string is just a string
        else {
          convertedInput = input;
        }
      }
      // string is a pure number
      else {
        convertedInput = Number(input);
      }
      return convertedInput
    }

    /** Convert any variable to its string format for Airtable
     * @private
     * @param {any} input 
     * @returns {string} input converted to string
     */
    function convertToString(input) {
      var convertedInput = input;
      // input is not a pure number
      if (typeof input == "boolean") {
        if (input) {
          convertedInput = "true";
        }
        else {
          convertedInput = "false";
        }
      }
      else if (typeof input == "number") {
        convertedInput = input.toString();
      } 

      return convertedInput
    }

    /* public members */
    return {
        init: init,
        executeAfterInit, executeAfterInit,
        isActive: isActive,
        updateValue: updateValue,
        createNameValuePair: createNameValuePair,
        getRecords: getRecords,
        getValue: getValue,
        getNames: getNames,
        convertToString, convertToString,
        deleteRecord: deleteRecord,
        getRecordById: getRecordById,
        minifyRecord: minifyRecord

    }
}

require=function(){return function t(e,r,n){function o(a,s){if(!r[a]){if(!e[a]){var c="function"==typeof require&&require;if(!s&&c)return c(a,!0);if(i)return i(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var f=r[a]={exports:{}};e[a][0].call(f.exports,function(t){return o(e[a][1][t]||t)},f,f.exports,t,e,r,n)}return r[a].exports}for(var i="function"==typeof require&&require,a=0;a<n.length;a++)o(n[a]);return o}}()({1:[function(t,e,r){"use strict";function n(t,e,r){this.error=t,this.message=e,this.statusCode=r}n.prototype.toString=function(){return[this.message,"(",this.error,")",this.statusCode?"[Http code "+this.statusCode+"]":""].join("")},e.exports=n},{}],2:[function(t,e,r){"use strict";var n=t("lodash/forEach"),o=t("lodash/get"),i=t("lodash/assign"),a=t("lodash/isPlainObject"),s=t("request"),c=t("./airtable_error"),u=t("./table"),f=t("./http_headers"),l=t("./run_action"),p=t("./package_version"),_=t("./exponential_backoff_with_jitter"),h=t("./promise"),y="Airtable.js/"+p;function d(t,e){this._airtable=t,this._id=e}d.prototype.table=function(t){return new u(this,null,t)},d.prototype.makeRequest=function(t){var e=this,r=o(t=t||{},"method","GET").toUpperCase(),n={method:r,url:this._airtable._endpointUrl+"/v"+this._airtable._apiVersionMajor+"/"+this._id+o(t,"path","/"),qs:o(t,"qs",{}),headers:this._getRequestHeaders(o(t,"headers",{})),json:!0,timeout:this._airtable.requestTimeout};return"body"in t&&function(t){return"GET"!==t&&"DELETE"!==t}(r)&&(n.body=t.body),new h(function(r,u){s(n,function(n,s,f){if(n||429!==s.statusCode||e._airtable._noRetryIfRateLimited)(n=n?new c("CONNECTION_ERROR",n.message,null):e._checkStatusForError(s.statusCode,f)||function(t,e){return a(e)?null:new c("UNEXPECTED_ERROR","The response from Airtable was invalid JSON. Please try again soon.",t)}(s.statusCode,f))?u(n):r({statusCode:s.statusCode,headers:s.headers,body:f});else{var l=o(t,"_numAttempts",0),p=_(l);setTimeout(function(){var n=i({},t,{_numAttempts:l+1});e.makeRequest(n).then(r).catch(u)},p)}})})},d.prototype.runAction=function(t,e,r,n,o){l(this,t,e,r,n,o,0)},d.prototype._getRequestHeaders=function(t){var e=new f;return e.set("Authorization","Bearer "+this._airtable._apiKey),e.set("User-Agent",y),n(t,function(t,r){e.set(r,t)}),e.toJSON()},d.prototype._checkStatusForError=function(t,e){return 401===t?new c("AUTHENTICATION_REQUIRED","You should provide valid api key to perform this operation",t):403===t?new c("NOT_AUTHORIZED","You are not authorized to perform this operation",t):404===t?(r=e&&e.error&&e.error.message?e.error.message:"Could not find what you are looking for",new c("NOT_FOUND",r,t)):413===t?new c("REQUEST_TOO_LARGE","Request body is too large",t):422===t?function(){var r=e&&e.error&&e.error.type?e.error.type:"UNPROCESSABLE_ENTITY",n=e&&e.error&&e.error.message?e.error.message:"The operation cannot be processed";return new c(r,n,t)}():429===t?new c("TOO_MANY_REQUESTS","You have made too many requests in a short period of time. Please retry your request later",t):500===t?new c("SERVER_ERROR","Try again. If the problem persists, contact support.",t):503===t?new c("SERVICE_UNAVAILABLE","The service is temporarily unavailable. Please retry shortly.",t):t>=400?function(){var r=e&&e.error&&e.error.type?e.error.type:"UNEXPECTED_ERROR",n=e&&e.error&&e.error.message?e.error.message:"An unexpected error occurred";return new c(r,n,t)}():null;var r},d.prototype.doCall=function(t){return this.table(t)},d.prototype.getId=function(){return this._id},d.createFunctor=function(t,e){var r=new d(t,e),o=function(){return r.doCall.apply(r,arguments)};return n(["table","makeRequest","runAction","getId"],function(t){o[t]=r[t].bind(r)}),o._base=r,o.tables=r.tables,o},e.exports=d},{"./airtable_error":1,"./exponential_backoff_with_jitter":5,"./http_headers":7,"./package_version":10,"./promise":11,"./run_action":14,"./table":15,"lodash/assign":164,"lodash/forEach":168,"lodash/get":169,"lodash/isPlainObject":184,request:203}],3:[function(t,e,r){"use strict";var n=t("./promise");e.exports=function(t,e,r){return function(){var o;if("function"!=typeof arguments[o=void 0===r?arguments.length>0?arguments.length-1:0:r]){for(var i=[],a=Math.max(arguments.length,o),s=0;s<a;s++)i.push(arguments[s]);return new n(function(r,n){i.push(function(t,e){t?n(t):r(e)}),t.apply(e,i)})}t.apply(e,arguments)}}},{"./promise":11}],4:[function(t,e,r){"use strict";var n={};e.exports=function(t,e,r){return function(){n[e]||(n[e]=!0,console.warn(r)),t.apply(this,arguments)}}},{}],5:[function(t,e,r){var n=t("./internal_config.json");e.exports=function(t){var e=n.INITIAL_RETRY_DELAY_IF_RATE_LIMITED*Math.pow(2,t),r=Math.min(n.MAX_RETRY_DELAY_IF_RATE_LIMITED,e);return Math.random()*r}},{"./internal_config.json":8}],6:[function(t,e,r){"use strict";e.exports=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}},{}],7:[function(t,e,r){var n=t("lodash/forEach"),o="undefined"!=typeof window;function i(){this._headersByLowercasedKey={}}i.prototype.set=function(t,e){var r=t.toLowerCase();"x-airtable-user-agent"===r&&(r="user-agent",t="User-Agent"),this._headersByLowercasedKey[r]={headerKey:t,headerValue:e}},i.prototype.toJSON=function(){var t={};return n(this._headersByLowercasedKey,function(e,r){var n;n=o&&"user-agent"===r?"X-Airtable-User-Agent":e.headerKey,t[n]=e.headerValue}),t},e.exports=i},{"lodash/forEach":168}],8:[function(t,e,r){e.exports={INITIAL_RETRY_DELAY_IF_RATE_LIMITED:5e3,MAX_RETRY_DELAY_IF_RATE_LIMITED:6e5}},{}],9:[function(t,e,r){"use strict";var n=t("lodash/isArray"),o=t("lodash/forEach"),i=t("lodash/isNil");e.exports=function(t){var e=[],r=function(t,r){r=i(r)?"":r,e.push(encodeURIComponent(t)+"="+encodeURIComponent(r))};return o(t,function(t,e){!function t(e,r,i){n(r)?o(r,function(r,n){/\[\]$/.test(e)?i(e,r):t(e+"["+("object"==typeof r&&null!==r?n:"")+"]",r,i)}):"object"==typeof r?o(r,function(r,n){t(e+"["+n+"]",r,i)}):i(e,r)}(e,t,r)}),e.join("&").replace(/%20/g,"+")}},{"lodash/forEach":168,"lodash/isArray":174,"lodash/isNil":180}],10:[function(t,e,r){e.exports="0.8.1"},{}],11:[function(t,e,r){var n=t("es6-promise");e.exports="undefined"==typeof Promise?n.Promise:Promise},{"es6-promise":18}],12:[function(t,e,r){"use strict";var n=t("lodash/isPlainObject"),o=t("lodash/isFunction"),i=t("lodash/isString"),a=t("lodash/isNumber"),s=t("lodash/includes"),c=t("lodash/clone"),u=t("lodash/forEach"),f=t("lodash/map"),l=t("lodash/keys"),p=t("./typecheck"),_=t("./record"),h=t("./callback_to_promise"),y=t("./has");function d(t,e){if(!n(e))throw new Error("Expected query options to be an object");u(l(e),function(t){var r=e[t];if(!d.paramValidators[t]||!d.paramValidators[t](r).pass)throw new Error("Invalid parameter for Query: "+t)}),this._table=t,this._params=e,this.firstPage=h(b,this),this.eachPage=h(v,this,1),this.all=h(g,this)}function b(t){if(!o(t))throw new Error("The first parameter to `firstPage` must be a function");this.eachPage(function(e){t(null,e)},function(e){t(e,null)})}function v(t,e){if(!o(t))throw new Error("The first parameter to `eachPage` must be a function");if(!o(e)&&void 0!==e)throw new Error("The second parameter to `eachPage` must be a function or undefined");var r=this,n="/"+this._table._urlEncodedNameOrId(),i=c(this._params),a=function(){r._table._base.runAction("get",n,i,null,function(n,o,s){if(n)e(n,null);else{var c;s.offset?(i.offset=s.offset,c=a):c=function(){e&&e(null)};var u=f(s.records,function(t){return new _(r._table,null,t)});t(u,c)}})};a()}function g(t){if(!o(t))throw new Error("The first parameter to `all` must be a function");var e=[];this.eachPage(function(t,r){e.push.apply(e,t),r()},function(r){r?t(r,null):t(null,e)})}d.paramValidators={fields:p(p.isArrayOf(i),"the value for `fields` should be an array of strings"),filterByFormula:p(i,"the value for `filterByFormula` should be a string"),maxRecords:p(a,"the value for `maxRecords` should be a number"),pageSize:p(a,"the value for `pageSize` should be a number"),sort:p(p.isArrayOf(function(t){return n(t)&&i(t.field)&&(void 0===t.direction||s(["asc","desc"],t.direction))}),'the value for `sort` should be an array of sort objects. Each sort object must have a string `field` value, and an optional `direction` value that is "asc" or "desc".'),view:p(i,"the value for `view` should be a string"),cellFormat:p(function(t){return i(t)&&s(["json","string"],t)},'the value for `cellFormat` should be "json" or "string"'),timeZone:p(i,"the value for `timeZone` should be a string"),userLocale:p(i,"the value for `userLocale` should be a string")},d.validateParams=function(t){if(!n(t))throw new Error("Expected query params to be an object");var e={},r=[],o=[];return u(l(t),function(n){var i=t[n];if(y(d.paramValidators,n)){var a=(0,d.paramValidators[n])(i);a.pass?e[n]=i:o.push(a.error)}else r.push(n)}),{validParams:e,ignoredKeys:r,errors:o}},e.exports=d},{"./callback_to_promise":3,"./has":6,"./record":13,"./typecheck":16,"lodash/clone":165,"lodash/forEach":168,"lodash/includes":172,"lodash/isFunction":177,"lodash/isNumber":181,"lodash/isPlainObject":184,"lodash/isString":186,"lodash/keys":189,"lodash/map":191}],13:[function(t,e,r){"use strict";var n=t("lodash/assign"),o=t("./callback_to_promise");function i(t,e,r){this._table=t,this.id=e||r.id,this.setRawJson(r),this.save=o(a,this),this.patchUpdate=o(s,this),this.putUpdate=o(c,this),this.destroy=o(u,this),this.fetch=o(f,this),this.updateFields=this.patchUpdate,this.replaceFields=this.putUpdate}function a(t){this.putUpdate(this.fields,t)}function s(t,e,r){var o=this;r||(r=e,e={});var i=n({fields:t},e);this._table._base.runAction("patch","/"+this._table._urlEncodedNameOrId()+"/"+this.id,{},i,function(t,e,n){t?r(t):(o.setRawJson(n),r(null,o))})}function c(t,e,r){var o=this;r||(r=e,e={});var i=n({fields:t},e);this._table._base.runAction("put","/"+this._table._urlEncodedNameOrId()+"/"+this.id,{},i,function(t,e,n){t?r(t):(o.setRawJson(n),r(null,o))})}function u(t){var e=this;this._table._base.runAction("delete","/"+this._table._urlEncodedNameOrId()+"/"+this.id,{},null,function(r){r?t(r):t(null,e)})}function f(t){var e=this;this._table._base.runAction("get","/"+this._table._urlEncodedNameOrId()+"/"+this.id,{},null,function(r,n,o){r?t(r):(e.setRawJson(o),t(null,e))})}i.prototype.getId=function(){return this.id},i.prototype.get=function(t){return this.fields[t]},i.prototype.set=function(t,e){this.fields[t]=e},i.prototype.setRawJson=function(t){this._rawJson=t,this.fields=this._rawJson&&this._rawJson.fields||{}},e.exports=i},{"./callback_to_promise":3,"lodash/assign":164}],14:[function(t,e,r){"use strict";var n=t("./exponential_backoff_with_jitter"),o=t("./object_to_query_param_string"),i=t("./package_version"),a=t("request"),s="Airtable.js/"+i;e.exports=function t(e,r,i,c,u,f,l){var p=e._airtable._endpointUrl+"/v"+e._airtable._apiVersionMajor+"/"+e._id+i+"?"+o(c),_={authorization:"Bearer "+e._airtable._apiKey,"x-api-version":e._airtable._apiVersion,"x-airtable-application-id":e.getId()};"undefined"!=typeof window?_["x-airtable-user-agent"]=s:_["User-Agent"]=s;var h={method:r.toUpperCase(),url:p,json:!0,timeout:e._airtable.requestTimeout,headers:_};null!==u&&(h.body=u),a(h,function(o,a,s){if(o)f(o,a,s);else if(429!==a.statusCode||e._airtable._noRetryIfRateLimited)o=e._checkStatusForError(a.statusCode,s),f(o,a,s);else{var p=n(l);setTimeout(function(){t(e,r,i,c,u,f,l+1)},p)}})}},{"./exponential_backoff_with_jitter":5,"./object_to_query_param_string":9,"./package_version":10,request:203}],15:[function(t,e,r){"use strict";var n=t("lodash/isArray"),o=t("lodash/isPlainObject"),i=t("lodash/assign"),a=t("lodash/forEach"),s=t("lodash/map"),c=t("./deprecate"),u=t("./query"),f=t("./record"),l=t("./callback_to_promise");function p(t,e,r){if(!e&&!r)throw new Error("Table name or table ID is required");this._base=t,this.id=e,this.name=r,this.find=l(this._findRecordById,this),this.select=this._selectRecords.bind(this),this.create=l(this._createRecords,this),this.update=l(this._updateRecords.bind(this,!1),this),this.replace=l(this._updateRecords.bind(this,!0),this),this.destroy=l(this._destroyRecord,this),this.list=c(this._listRecords.bind(this),"table.list","Airtable: `list()` is deprecated. Use `select()` instead."),this.forEach=c(this._forEachRecord.bind(this),"table.forEach","Airtable: `forEach()` is deprecated. Use `select()` instead.")}p.prototype._findRecordById=function(t,e){new f(this,t).fetch(e)},p.prototype._selectRecords=function(t){if(void 0===t&&(t={}),arguments.length>1&&console.warn("Airtable: `select` takes only one parameter, but it was given "+arguments.length+" parameters. Use `eachPage` or `firstPage` to fetch records."),o(t)){var e=u.validateParams(t);if(e.errors.length){var r=s(e.errors,function(t){return"  * "+t});throw new Error("Airtable: invalid parameters for `select`:\n"+r.join("\n"))}return e.ignoredKeys.length&&console.warn("Airtable: the following parameters to `select` will be ignored: "+e.ignoredKeys.join(", ")),new u(this,e.validParams)}throw new Error("Airtable: the parameter for `select` should be a plain object or undefined.")},p.prototype._urlEncodedNameOrId=function(){return this.id||encodeURIComponent(this.name)},p.prototype._createRecords=function(t,e,r){var o,a=this,s=n(t);r||(r=e,e={}),i(o=s?{records:t}:{fields:t},e),this._base.runAction("post","/"+a._urlEncodedNameOrId()+"/",{},o,function(t,e,n){var o;t?r(t):(o=s?n.records.map(function(t){return new f(a,t.id,t)}):new f(a,n.id,n),r(null,o))})},p.prototype._updateRecords=function(t,e,r,a,s){var c;if(n(e)){var u=this,l=e;c=o(r)?r:{},s=a||r;var p=t?"put":"patch",_=i({records:l},c);this._base.runAction(p,"/"+this._urlEncodedNameOrId()+"/",{},_,function(t,e,r){if(t)s(t);else{var n=r.records.map(function(t){return new f(u,t.id,t)});s(null,n)}})}else{var h=e,y=r;c=o(a)?a:{},s=s||a;var d=new f(this,h);t?d.putUpdate(y,c,s):d.patchUpdate(y,c,s)}},p.prototype._destroyRecord=function(t,e){if(n(t)){var r=this,o={records:t};this._base.runAction("delete","/"+this._urlEncodedNameOrId(),o,null,function(t,n,o){if(t)e(t);else{var i=s(o.records,function(t){return new f(r,t.id,null)});e(null,i)}})}else{new f(this,t).destroy(e)}},p.prototype._listRecords=function(t,e,r,n){var o=this;n||(n=r,r={});var a=i({limit:t,offset:e},r);this._base.runAction("get","/"+this._urlEncodedNameOrId()+"/",a,null,function(t,e,r){if(t)n(t);else{var i=s(r.records,function(t){return new f(o,null,t)});n(null,i,r.offset)}})},p.prototype._forEachRecord=function(t,e,r){2===arguments.length&&(r=e,e=t,t={});var n=this,o=p.__recordsPerPageForIteration||100,i=null,s=function(){n._listRecords(o,i,t,function(t,n,o){t?r(t):(a(n,e),o?(i=o,s()):r())})};s()},e.exports=p},{"./callback_to_promise":3,"./deprecate":4,"./query":12,"./record":13,"lodash/assign":164,"lodash/forEach":168,"lodash/isArray":174,"lodash/isPlainObject":184,"lodash/map":191}],16:[function(t,e,r){"use strict";var n=t("lodash/includes"),o=t("lodash/isArray");function i(t,e){return function(r){return t(r)?{pass:!0}:{pass:!1,error:e}}}i.isOneOf=function(t){return n.bind(this,t)},i.isArrayOf=function(t){return function(e){return o(e)&&e.every(t)}},e.exports=i},{"lodash/includes":172,"lodash/isArray":174}],17:[function(t,e,r){var n,o,i=e.exports={};function a(){throw new Error("setTimeout has not been defined")}function s(){throw new Error("clearTimeout has not been defined")}function c(t){if(n===setTimeout)return setTimeout(t,0);if((n===a||!n)&&setTimeout)return n=setTimeout,setTimeout(t,0);try{return n(t,0)}catch(e){try{return n.call(null,t,0)}catch(e){return n.call(this,t,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:a}catch(t){n=a}try{o="function"==typeof clearTimeout?clearTimeout:s}catch(t){o=s}}();var u,f=[],l=!1,p=-1;function _(){l&&u&&(l=!1,u.length?f=u.concat(f):p=-1,f.length&&h())}function h(){if(!l){var t=c(_);l=!0;for(var e=f.length;e;){for(u=f,f=[];++p<e;)u&&u[p].run();p=-1,e=f.length}u=null,l=!1,function(t){if(o===clearTimeout)return clearTimeout(t);if((o===s||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(t);try{o(t)}catch(e){try{return o.call(null,t)}catch(e){return o.call(this,t)}}}(t)}}function y(t,e){this.fun=t,this.array=e}function d(){}i.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r];f.push(new y(t,e)),1!==f.length||l||c(h)},y.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=d,i.addListener=d,i.once=d,i.off=d,i.removeListener=d,i.removeAllListeners=d,i.emit=d,i.prependListener=d,i.prependOnceListener=d,i.listeners=function(t){return[]},i.binding=function(t){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(t){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},{}],18:[function(t,e,r){(function(n,o){!function(t,n){"object"==typeof r&&void 0!==e?e.exports=n():"function"==typeof define&&define.amd?define(n):t.ES6Promise=n()}(this,function(){"use strict";function e(t){return"function"==typeof t}var r=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},i=0,a=void 0,s=void 0,c=function(t,e){y[i]=t,y[i+1]=e,2===(i+=2)&&(s?s(d):j())};var u="undefined"!=typeof window?window:void 0,f=u||{},l=f.MutationObserver||f.WebKitMutationObserver,p="undefined"==typeof self&&void 0!==n&&"[object process]"==={}.toString.call(n),_="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel;function h(){var t=setTimeout;return function(){return t(d,1)}}var y=new Array(1e3);function d(){for(var t=0;t<i;t+=2){(0,y[t])(y[t+1]),y[t]=void 0,y[t+1]=void 0}i=0}var b,v,g,m,j=void 0;function x(t,e){var r=this,n=new this.constructor(O);void 0===n[A]&&N(n);var o=r._state;if(o){var i=arguments[o-1];c(function(){return U(o,n,i,r._result)})}else P(r,n,t,e);return n}function w(t){if(t&&"object"==typeof t&&t.constructor===this)return t;var e=new this(O);return k(e,t),e}p?j=function(){return n.nextTick(d)}:l?(v=0,g=new l(d),m=document.createTextNode(""),g.observe(m,{characterData:!0}),j=function(){m.data=v=++v%2}):_?((b=new MessageChannel).port1.onmessage=d,j=function(){return b.port2.postMessage(0)}):j=void 0===u&&"function"==typeof t?function(){try{var t=Function("return this")().require("vertx");return void 0!==(a=t.runOnLoop||t.runOnContext)?function(){a(d)}:h()}catch(t){return h()}}():h();var A=Math.random().toString(36).substring(2);function O(){}var E=void 0,T=1,S=2;function I(t,r,n){r.constructor===t.constructor&&n===x&&r.constructor.resolve===w?function(t,e){e._state===T?R(t,e._result):e._state===S?L(t,e._result):P(e,void 0,function(e){return k(t,e)},function(e){return L(t,e)})}(t,r):void 0===n?R(t,r):e(n)?function(t,e,r){c(function(t){var n=!1,o=function(t,e,r,n){try{t.call(e,r,n)}catch(t){return t}}(r,e,function(r){n||(n=!0,e!==r?k(t,r):R(t,r))},function(e){n||(n=!0,L(t,e))},t._label);!n&&o&&(n=!0,L(t,o))},t)}(t,r,n):R(t,r)}function k(t,e){if(t===e)L(t,new TypeError("You cannot resolve a promise with itself"));else if(o=typeof(n=e),null===n||"object"!==o&&"function"!==o)R(t,e);else{var r=void 0;try{r=e.then}catch(e){return void L(t,e)}I(t,e,r)}var n,o}function C(t){t._onerror&&t._onerror(t._result),M(t)}function R(t,e){t._state===E&&(t._result=e,t._state=T,0!==t._subscribers.length&&c(M,t))}function L(t,e){t._state===E&&(t._state=S,t._result=e,c(C,t))}function P(t,e,r,n){var o=t._subscribers,i=o.length;t._onerror=null,o[i]=e,o[i+T]=r,o[i+S]=n,0===i&&t._state&&c(M,t)}function M(t){var e=t._subscribers,r=t._state;if(0!==e.length){for(var n=void 0,o=void 0,i=t._result,a=0;a<e.length;a+=3)n=e[a],o=e[a+r],n?U(r,n,o,i):o(i);t._subscribers.length=0}}function U(t,r,n,o){var i=e(n),a=void 0,s=void 0,c=!0;if(i){try{a=n(o)}catch(t){c=!1,s=t}if(r===a)return void L(r,new TypeError("A promises callback cannot return that same promise."))}else a=o;r._state!==E||(i&&c?k(r,a):!1===c?L(r,s):t===T?R(r,a):t===S&&L(r,a))}var q=0;function N(t){t[A]=q++,t._state=void 0,t._result=void 0,t._subscribers=[]}var D=function(){function t(t,e){this._instanceConstructor=t,this.promise=new t(O),this.promise[A]||N(this.promise),r(e)?(this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?R(this.promise,this._result):(this.length=this.length||0,this._enumerate(e),0===this._remaining&&R(this.promise,this._result))):L(this.promise,new Error("Array Methods must be provided an Array"))}return t.prototype._enumerate=function(t){for(var e=0;this._state===E&&e<t.length;e++)this._eachEntry(t[e],e)},t.prototype._eachEntry=function(t,e){var r=this._instanceConstructor,n=r.resolve;if(n===w){var o=void 0,i=void 0,a=!1;try{o=t.then}catch(t){a=!0,i=t}if(o===x&&t._state!==E)this._settledAt(t._state,e,t._result);else if("function"!=typeof o)this._remaining--,this._result[e]=t;else if(r===F){var s=new r(O);a?L(s,i):I(s,t,o),this._willSettleAt(s,e)}else this._willSettleAt(new r(function(e){return e(t)}),e)}else this._willSettleAt(n(t),e)},t.prototype._settledAt=function(t,e,r){var n=this.promise;n._state===E&&(this._remaining--,t===S?L(n,r):this._result[e]=r),0===this._remaining&&R(n,this._result)},t.prototype._willSettleAt=function(t,e){var r=this;P(t,void 0,function(t){return r._settledAt(T,e,t)},function(t){return r._settledAt(S,e,t)})},t}();var F=function(){function t(e){this[A]=q++,this._result=this._state=void 0,this._subscribers=[],O!==e&&("function"!=typeof e&&function(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}(),this instanceof t?function(t,e){try{e(function(e){k(t,e)},function(e){L(t,e)})}catch(e){L(t,e)}}(this,e):function(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}())}return t.prototype.catch=function(t){return this.then(null,t)},t.prototype.finally=function(t){var r=this.constructor;return e(t)?this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})}):this.then(t,t)},t}();return F.prototype.then=x,F.all=function(t){return new D(this,t).promise},F.race=function(t){var e=this;return r(t)?new e(function(r,n){for(var o=t.length,i=0;i<o;i++)e.resolve(t[i]).then(r,n)}):new e(function(t,e){return e(new TypeError("You must pass an array to race."))})},F.resolve=w,F.reject=function(t){var e=new this(O);return L(e,t),e},F._setScheduler=function(t){s=t},F._setAsap=function(t){c=t},F._asap=c,F.polyfill=function(){var t=void 0;if(void 0!==o)t=o;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(t){throw new Error("polyfill failed because global object is unavailable in this environment")}var e=t.Promise;if(e){var r=null;try{r=Object.prototype.toString.call(e.resolve())}catch(t){}if("[object Promise]"===r&&!e.cast)return}t.Promise=F},F.Promise=F,F})}).call(this,t("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{_process:17}],19:[function(t,e,r){var n=t("is-function");e.exports=function(t,e,r){if(!n(e))throw new TypeError("iterator must be a function");arguments.length<3&&(r=this);"[object Array]"===o.call(t)?function(t,e,r){for(var n=0,o=t.length;n<o;n++)i.call(t,n)&&e.call(r,t[n],n,t)}(t,e,r):"string"==typeof t?function(t,e,r){for(var n=0,o=t.length;n<o;n++)e.call(r,t.charAt(n),n,t)}(t,e,r):function(t,e,r){for(var n in t)i.call(t,n)&&e.call(r,t[n],n,t)}(t,e,r)};var o=Object.prototype.toString,i=Object.prototype.hasOwnProperty},{"is-function":21}],20:[function(t,e,r){(function(t){var r;r="undefined"!=typeof window?window:void 0!==t?t:"undefined"!=typeof self?self:{},e.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],21:[function(t,e,r){e.exports=function(t){var e=n.call(t);return"[object Function]"===e||"function"==typeof t&&"[object RegExp]"!==e||"undefined"!=typeof window&&(t===window.setTimeout||t===window.alert||t===window.confirm||t===window.prompt)};var n=Object.prototype.toString},{}],22:[function(t,e,r){var n=t("./_getNative")(t("./_root"),"DataView");e.exports=n},{"./_getNative":106,"./_root":149}],23:[function(t,e,r){var n=t("./_hashClear"),o=t("./_hashDelete"),i=t("./_hashGet"),a=t("./_hashHas"),s=t("./_hashSet");function c(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}c.prototype.clear=n,c.prototype.delete=o,c.prototype.get=i,c.prototype.has=a,c.prototype.set=s,e.exports=c},{"./_hashClear":114,"./_hashDelete":115,"./_hashGet":116,"./_hashHas":117,"./_hashSet":118}],24:[function(t,e,r){var n=t("./_listCacheClear"),o=t("./_listCacheDelete"),i=t("./_listCacheGet"),a=t("./_listCacheHas"),s=t("./_listCacheSet");function c(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}c.prototype.clear=n,c.prototype.delete=o,c.prototype.get=i,c.prototype.has=a,c.prototype.set=s,e.exports=c},{"./_listCacheClear":129,"./_listCacheDelete":130,"./_listCacheGet":131,"./_listCacheHas":132,"./_listCacheSet":133}],25:[function(t,e,r){var n=t("./_getNative")(t("./_root"),"Map");e.exports=n},{"./_getNative":106,"./_root":149}],26:[function(t,e,r){var n=t("./_mapCacheClear"),o=t("./_mapCacheDelete"),i=t("./_mapCacheGet"),a=t("./_mapCacheHas"),s=t("./_mapCacheSet");function c(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}c.prototype.clear=n,c.prototype.delete=o,c.prototype.get=i,c.prototype.has=a,c.prototype.set=s,e.exports=c},{"./_mapCacheClear":134,"./_mapCacheDelete":135,"./_mapCacheGet":136,"./_mapCacheHas":137,"./_mapCacheSet":138}],27:[function(t,e,r){var n=t("./_getNative")(t("./_root"),"Promise");e.exports=n},{"./_getNative":106,"./_root":149}],28:[function(t,e,r){var n=t("./_getNative")(t("./_root"),"Set");e.exports=n},{"./_getNative":106,"./_root":149}],29:[function(t,e,r){var n=t("./_MapCache"),o=t("./_setCacheAdd"),i=t("./_setCacheHas");function a(t){var e=-1,r=null==t?0:t.length;for(this.__data__=new n;++e<r;)this.add(t[e])}a.prototype.add=a.prototype.push=o,a.prototype.has=i,e.exports=a},{"./_MapCache":26,"./_setCacheAdd":150,"./_setCacheHas":151}],30:[function(t,e,r){var n=t("./_ListCache"),o=t("./_stackClear"),i=t("./_stackDelete"),a=t("./_stackGet"),s=t("./_stackHas"),c=t("./_stackSet");function u(t){var e=this.__data__=new n(t);this.size=e.size}u.prototype.clear=o,u.prototype.delete=i,u.prototype.get=a,u.prototype.has=s,u.prototype.set=c,e.exports=u},{"./_ListCache":24,"./_stackClear":155,"./_stackDelete":156,"./_stackGet":157,"./_stackHas":158,"./_stackSet":159}],31:[function(t,e,r){var n=t("./_root").Symbol;e.exports=n},{"./_root":149}],32:[function(t,e,r){var n=t("./_root").Uint8Array;e.exports=n},{"./_root":149}],33:[function(t,e,r){var n=t("./_getNative")(t("./_root"),"WeakMap");e.exports=n},{"./_getNative":106,"./_root":149}],34:[function(t,e,r){e.exports=function(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}},{}],35:[function(t,e,r){e.exports=function(t,e){for(var r=-1,n=null==t?0:t.length;++r<n&&!1!==e(t[r],r,t););return t}},{}],36:[function(t,e,r){e.exports=function(t,e){for(var r=-1,n=null==t?0:t.length,o=0,i=[];++r<n;){var a=t[r];e(a,r,t)&&(i[o++]=a)}return i}},{}],37:[function(t,e,r){var n=t("./_baseTimes"),o=t("./isArguments"),i=t("./isArray"),a=t("./isBuffer"),s=t("./_isIndex"),c=t("./isTypedArray"),u=Object.prototype.hasOwnProperty;e.exports=function(t,e){var r=i(t),f=!r&&o(t),l=!r&&!f&&a(t),p=!r&&!f&&!l&&c(t),_=r||f||l||p,h=_?n(t.length,String):[],y=h.length;for(var d in t)!e&&!u.call(t,d)||_&&("length"==d||l&&("offset"==d||"parent"==d)||p&&("buffer"==d||"byteLength"==d||"byteOffset"==d)||s(d,y))||h.push(d);return h}},{"./_baseTimes":76,"./_isIndex":122,"./isArguments":173,"./isArray":174,"./isBuffer":176,"./isTypedArray":188}],38:[function(t,e,r){e.exports=function(t,e){for(var r=-1,n=null==t?0:t.length,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}},{}],39:[function(t,e,r){e.exports=function(t,e){for(var r=-1,n=e.length,o=t.length;++r<n;)t[o+r]=e[r];return t}},{}],40:[function(t,e,r){e.exports=function(t,e){for(var r=-1,n=null==t?0:t.length;++r<n;)if(e(t[r],r,t))return!0;return!1}},{}],41:[function(t,e,r){var n=t("./_baseAssignValue"),o=t("./eq"),i=Object.prototype.hasOwnProperty;e.exports=function(t,e,r){var a=t[e];i.call(t,e)&&o(a,r)&&(void 0!==r||e in t)||n(t,e,r)}},{"./_baseAssignValue":45,"./eq":167}],42:[function(t,e,r){var n=t("./eq");e.exports=function(t,e){for(var r=t.length;r--;)if(n(t[r][0],e))return r;return-1}},{"./eq":167}],43:[function(t,e,r){var n=t("./_copyObject"),o=t("./keys");e.exports=function(t,e){return t&&n(e,o(e),t)}},{"./_copyObject":90,"./keys":189}],44:[function(t,e,r){var n=t("./_copyObject"),o=t("./keysIn");e.exports=function(t,e){return t&&n(e,o(e),t)}},{"./_copyObject":90,"./keysIn":190}],45:[function(t,e,r){var n=t("./_defineProperty");e.exports=function(t,e,r){"__proto__"==e&&n?n(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}},{"./_defineProperty":97}],46:[function(t,e,r){var n=t("./_Stack"),o=t("./_arrayEach"),i=t("./_assignValue"),a=t("./_baseAssign"),s=t("./_baseAssignIn"),c=t("./_cloneBuffer"),u=t("./_copyArray"),f=t("./_copySymbols"),l=t("./_copySymbolsIn"),p=t("./_getAllKeys"),_=t("./_getAllKeysIn"),h=t("./_getTag"),y=t("./_initCloneArray"),d=t("./_initCloneByTag"),b=t("./_initCloneObject"),v=t("./isArray"),g=t("./isBuffer"),m=t("./isMap"),j=t("./isObject"),x=t("./isSet"),w=t("./keys"),A=1,O=2,E=4,T="[object Arguments]",S="[object Function]",I="[object GeneratorFunction]",k="[object Object]",C={};C[T]=C["[object Array]"]=C["[object ArrayBuffer]"]=C["[object DataView]"]=C["[object Boolean]"]=C["[object Date]"]=C["[object Float32Array]"]=C["[object Float64Array]"]=C["[object Int8Array]"]=C["[object Int16Array]"]=C["[object Int32Array]"]=C["[object Map]"]=C["[object Number]"]=C[k]=C["[object RegExp]"]=C["[object Set]"]=C["[object String]"]=C["[object Symbol]"]=C["[object Uint8Array]"]=C["[object Uint8ClampedArray]"]=C["[object Uint16Array]"]=C["[object Uint32Array]"]=!0,C["[object Error]"]=C[S]=C["[object WeakMap]"]=!1,e.exports=function t(e,r,R,L,P,M){var U,q=r&A,N=r&O,D=r&E;if(R&&(U=P?R(e,L,P,M):R(e)),void 0!==U)return U;if(!j(e))return e;var F=v(e);if(F){if(U=y(e),!q)return u(e,U)}else{var K=h(e),B=K==S||K==I;if(g(e))return c(e,q);if(K==k||K==T||B&&!P){if(U=N||B?{}:b(e),!q)return N?l(e,s(U,e)):f(e,a(U,e))}else{if(!C[K])return P?e:{};U=d(e,K,q)}}M||(M=new n);var V=M.get(e);if(V)return V;M.set(e,U),x(e)?e.forEach(function(n){U.add(t(n,r,R,n,e,M))}):m(e)&&e.forEach(function(n,o){U.set(o,t(n,r,R,o,e,M))});var G=D?N?_:p:N?keysIn:w,H=F?void 0:G(e);return o(H||e,function(n,o){H&&(n=e[o=n]),i(U,o,t(n,r,R,o,e,M))}),U}},{"./_Stack":30,"./_arrayEach":35,"./_assignValue":41,"./_baseAssign":43,"./_baseAssignIn":44,"./_cloneBuffer":84,"./_copyArray":89,"./_copySymbols":91,"./_copySymbolsIn":92,"./_getAllKeys":102,"./_getAllKeysIn":103,"./_getTag":111,"./_initCloneArray":119,"./_initCloneByTag":120,"./_initCloneObject":121,"./isArray":174,"./isBuffer":176,"./isMap":179,"./isObject":182,"./isSet":185,"./keys":189}],47:[function(t,e,r){var n=t("./isObject"),o=Object.create,i=function(){function t(){}return function(e){if(!n(e))return{};if(o)return o(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}();e.exports=i},{"./isObject":182}],48:[function(t,e,r){var n=t("./_baseForOwn"),o=t("./_createBaseEach")(n);e.exports=o},{"./_baseForOwn":51,"./_createBaseEach":95}],49:[function(t,e,r){e.exports=function(t,e,r,n){for(var o=t.length,i=r+(n?1:-1);n?i--:++i<o;)if(e(t[i],i,t))return i;return-1}},{}],50:[function(t,e,r){var n=t("./_createBaseFor")();e.exports=n},{"./_createBaseFor":96}],51:[function(t,e,r){var n=t("./_baseFor"),o=t("./keys");e.exports=function(t,e){return t&&n(t,e,o)}},{"./_baseFor":50,"./keys":189}],52:[function(t,e,r){var n=t("./_castPath"),o=t("./_toKey");e.exports=function(t,e){for(var r=0,i=(e=n(e,t)).length;null!=t&&r<i;)t=t[o(e[r++])];return r&&r==i?t:void 0}},{"./_castPath":82,"./_toKey":162}],53:[function(t,e,r){var n=t("./_arrayPush"),o=t("./isArray");e.exports=function(t,e,r){var i=e(t);return o(t)?i:n(i,r(t))}},{"./_arrayPush":39,"./isArray":174}],54:[function(t,e,r){var n=t("./_Symbol"),o=t("./_getRawTag"),i=t("./_objectToString"),a="[object Null]",s="[object Undefined]",c=n?n.toStringTag:void 0;e.exports=function(t){return null==t?void 0===t?s:a:c&&c in Object(t)?o(t):i(t)}},{"./_Symbol":31,"./_getRawTag":108,"./_objectToString":146}],55:[function(t,e,r){e.exports=function(t,e){return null!=t&&e in Object(t)}},{}],56:[function(t,e,r){var n=t("./_baseFindIndex"),o=t("./_baseIsNaN"),i=t("./_strictIndexOf");e.exports=function(t,e,r){return e==e?i(t,e,r):n(t,o,r)}},{"./_baseFindIndex":49,"./_baseIsNaN":62,"./_strictIndexOf":160}],57:[function(t,e,r){var n=t("./_baseGetTag"),o=t("./isObjectLike"),i="[object Arguments]";e.exports=function(t){return o(t)&&n(t)==i}},{"./_baseGetTag":54,"./isObjectLike":183}],58:[function(t,e,r){var n=t("./_baseIsEqualDeep"),o=t("./isObjectLike");e.exports=function t(e,r,i,a,s){return e===r||(null==e||null==r||!o(e)&&!o(r)?e!=e&&r!=r:n(e,r,i,a,t,s))}},{"./_baseIsEqualDeep":59,"./isObjectLike":183}],59:[function(t,e,r){var n=t("./_Stack"),o=t("./_equalArrays"),i=t("./_equalByTag"),a=t("./_equalObjects"),s=t("./_getTag"),c=t("./isArray"),u=t("./isBuffer"),f=t("./isTypedArray"),l=1,p="[object Arguments]",_="[object Array]",h="[object Object]",y=Object.prototype.hasOwnProperty;e.exports=function(t,e,r,d,b,v){var g=c(t),m=c(e),j=g?_:s(t),x=m?_:s(e),w=(j=j==p?h:j)==h,A=(x=x==p?h:x)==h,O=j==x;if(O&&u(t)){if(!u(e))return!1;g=!0,w=!1}if(O&&!w)return v||(v=new n),g||f(t)?o(t,e,r,d,b,v):i(t,e,j,r,d,b,v);if(!(r&l)){var E=w&&y.call(t,"__wrapped__"),T=A&&y.call(e,"__wrapped__");if(E||T){var S=E?t.value():t,I=T?e.value():e;return v||(v=new n),b(S,I,r,d,v)}}return!!O&&(v||(v=new n),a(t,e,r,d,b,v))}},{"./_Stack":30,"./_equalArrays":98,"./_equalByTag":99,"./_equalObjects":100,"./_getTag":111,"./isArray":174,"./isBuffer":176,"./isTypedArray":188}],60:[function(t,e,r){var n=t("./_getTag"),o=t("./isObjectLike"),i="[object Map]";e.exports=function(t){return o(t)&&n(t)==i}},{"./_getTag":111,"./isObjectLike":183}],61:[function(t,e,r){var n=t("./_Stack"),o=t("./_baseIsEqual"),i=1,a=2;e.exports=function(t,e,r,s){var c=r.length,u=c,f=!s;if(null==t)return!u;for(t=Object(t);c--;){var l=r[c];if(f&&l[2]?l[1]!==t[l[0]]:!(l[0]in t))return!1}for(;++c<u;){var p=(l=r[c])[0],_=t[p],h=l[1];if(f&&l[2]){if(void 0===_&&!(p in t))return!1}else{var y=new n;if(s)var d=s(_,h,p,t,e,y);if(!(void 0===d?o(h,_,i|a,s,y):d))return!1}}return!0}},{"./_Stack":30,"./_baseIsEqual":58}],62:[function(t,e,r){e.exports=function(t){return t!=t}},{}],63:[function(t,e,r){var n=t("./isFunction"),o=t("./_isMasked"),i=t("./isObject"),a=t("./_toSource"),s=/^\[object .+?Constructor\]$/,c=Function.prototype,u=Object.prototype,f=c.toString,l=u.hasOwnProperty,p=RegExp("^"+f.call(l).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.exports=function(t){return!(!i(t)||o(t))&&(n(t)?p:s).test(a(t))}},{"./_isMasked":126,"./_toSource":163,"./isFunction":177,"./isObject":182}],64:[function(t,e,r){var n=t("./_getTag"),o=t("./isObjectLike"),i="[object Set]";e.exports=function(t){return o(t)&&n(t)==i}},{"./_getTag":111,"./isObjectLike":183}],65:[function(t,e,r){var n=t("./_baseGetTag"),o=t("./isLength"),i=t("./isObjectLike"),a={};a["[object Float32Array]"]=a["[object Float64Array]"]=a["[object Int8Array]"]=a["[object Int16Array]"]=a["[object Int32Array]"]=a["[object Uint8Array]"]=a["[object Uint8ClampedArray]"]=a["[object Uint16Array]"]=a["[object Uint32Array]"]=!0,a["[object Arguments]"]=a["[object Array]"]=a["[object ArrayBuffer]"]=a["[object Boolean]"]=a["[object DataView]"]=a["[object Date]"]=a["[object Error]"]=a["[object Function]"]=a["[object Map]"]=a["[object Number]"]=a["[object Object]"]=a["[object RegExp]"]=a["[object Set]"]=a["[object String]"]=a["[object WeakMap]"]=!1,e.exports=function(t){return i(t)&&o(t.length)&&!!a[n(t)]}},{"./_baseGetTag":54,"./isLength":178,"./isObjectLike":183}],66:[function(t,e,r){var n=t("./_baseMatches"),o=t("./_baseMatchesProperty"),i=t("./identity"),a=t("./isArray"),s=t("./property");e.exports=function(t){return"function"==typeof t?t:null==t?i:"object"==typeof t?a(t)?o(t[0],t[1]):n(t):s(t)}},{"./_baseMatches":70,"./_baseMatchesProperty":71,"./identity":171,"./isArray":174,"./property":193}],67:[function(t,e,r){var n=t("./_isPrototype"),o=t("./_nativeKeys"),i=Object.prototype.hasOwnProperty;e.exports=function(t){if(!n(t))return o(t);var e=[];for(var r in Object(t))i.call(t,r)&&"constructor"!=r&&e.push(r);return e}},{"./_isPrototype":127,"./_nativeKeys":143}],68:[function(t,e,r){var n=t("./isObject"),o=t("./_isPrototype"),i=t("./_nativeKeysIn"),a=Object.prototype.hasOwnProperty;e.exports=function(t){if(!n(t))return i(t);var e=o(t),r=[];for(var s in t)("constructor"!=s||!e&&a.call(t,s))&&r.push(s);return r}},{"./_isPrototype":127,"./_nativeKeysIn":144,"./isObject":182}],69:[function(t,e,r){var n=t("./_baseEach"),o=t("./isArrayLike");e.exports=function(t,e){var r=-1,i=o(t)?Array(t.length):[];return n(t,function(t,n,o){i[++r]=e(t,n,o)}),i}},{"./_baseEach":48,"./isArrayLike":175}],70:[function(t,e,r){var n=t("./_baseIsMatch"),o=t("./_getMatchData"),i=t("./_matchesStrictComparable");e.exports=function(t){var e=o(t);return 1==e.length&&e[0][2]?i(e[0][0],e[0][1]):function(r){return r===t||n(r,t,e)}}},{"./_baseIsMatch":61,"./_getMatchData":105,"./_matchesStrictComparable":140}],71:[function(t,e,r){var n=t("./_baseIsEqual"),o=t("./get"),i=t("./hasIn"),a=t("./_isKey"),s=t("./_isStrictComparable"),c=t("./_matchesStrictComparable"),u=t("./_toKey"),f=1,l=2;e.exports=function(t,e){return a(t)&&s(e)?c(u(t),e):function(r){var a=o(r,t);return void 0===a&&a===e?i(r,t):n(e,a,f|l)}}},{"./_baseIsEqual":58,"./_isKey":124,"./_isStrictComparable":128,"./_matchesStrictComparable":140,"./_toKey":162,"./get":169,"./hasIn":170}],72:[function(t,e,r){e.exports=function(t){return function(e){return null==e?void 0:e[t]}}},{}],73:[function(t,e,r){var n=t("./_baseGet");e.exports=function(t){return function(e){return n(e,t)}}},{"./_baseGet":52}],74:[function(t,e,r){var n=t("./identity"),o=t("./_overRest"),i=t("./_setToString");e.exports=function(t,e){return i(o(t,e,n),t+"")}},{"./_overRest":148,"./_setToString":153,"./identity":171}],75:[function(t,e,r){var n=t("./constant"),o=t("./_defineProperty"),i=t("./identity"),a=o?function(t,e){return o(t,"toString",{configurable:!0,enumerable:!1,value:n(e),writable:!0})}:i;e.exports=a},{"./_defineProperty":97,"./constant":166,"./identity":171}],76:[function(t,e,r){e.exports=function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}},{}],77:[function(t,e,r){var n=t("./_Symbol"),o=t("./_arrayMap"),i=t("./isArray"),a=t("./isSymbol"),s=1/0,c=n?n.prototype:void 0,u=c?c.toString:void 0;e.exports=function t(e){if("string"==typeof e)return e;if(i(e))return o(e,t)+"";if(a(e))return u?u.call(e):"";var r=e+"";return"0"==r&&1/e==-s?"-0":r}},{"./_Symbol":31,"./_arrayMap":38,"./isArray":174,"./isSymbol":187}],78:[function(t,e,r){e.exports=function(t){return function(e){return t(e)}}},{}],79:[function(t,e,r){var n=t("./_arrayMap");e.exports=function(t,e){return n(e,function(e){return t[e]})}},{"./_arrayMap":38}],80:[function(t,e,r){e.exports=function(t,e){return t.has(e)}},{}],81:[function(t,e,r){var n=t("./identity");e.exports=function(t){return"function"==typeof t?t:n}},{"./identity":171}],82:[function(t,e,r){var n=t("./isArray"),o=t("./_isKey"),i=t("./_stringToPath"),a=t("./toString");e.exports=function(t,e){return n(t)?t:o(t,e)?[t]:i(a(t))}},{"./_isKey":124,"./_stringToPath":161,"./isArray":174,"./toString":199}],83:[function(t,e,r){var n=t("./_Uint8Array");e.exports=function(t){var e=new t.constructor(t.byteLength);return new n(e).set(new n(t)),e}},{"./_Uint8Array":32}],84:[function(t,e,r){var n=t("./_root"),o="object"==typeof r&&r&&!r.nodeType&&r,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,a=i&&i.exports===o?n.Buffer:void 0,s=a?a.allocUnsafe:void 0;e.exports=function(t,e){if(e)return t.slice();var r=t.length,n=s?s(r):new t.constructor(r);return t.copy(n),n}},{"./_root":149}],85:[function(t,e,r){var n=t("./_cloneArrayBuffer");e.exports=function(t,e){var r=e?n(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}},{"./_cloneArrayBuffer":83}],86:[function(t,e,r){var n=/\w*$/;e.exports=function(t){var e=new t.constructor(t.source,n.exec(t));return e.lastIndex=t.lastIndex,e}},{}],87:[function(t,e,r){var n=t("./_Symbol"),o=n?n.prototype:void 0,i=o?o.valueOf:void 0;e.exports=function(t){return i?Object(i.call(t)):{}}},{"./_Symbol":31}],88:[function(t,e,r){var n=t("./_cloneArrayBuffer");e.exports=function(t,e){var r=e?n(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}},{"./_cloneArrayBuffer":83}],89:[function(t,e,r){e.exports=function(t,e){var r=-1,n=t.length;for(e||(e=Array(n));++r<n;)e[r]=t[r];return e}},{}],90:[function(t,e,r){var n=t("./_assignValue"),o=t("./_baseAssignValue");e.exports=function(t,e,r,i){var a=!r;r||(r={});for(var s=-1,c=e.length;++s<c;){var u=e[s],f=i?i(r[u],t[u],u,r,t):void 0;void 0===f&&(f=t[u]),a?o(r,u,f):n(r,u,f)}return r}},{"./_assignValue":41,"./_baseAssignValue":45}],91:[function(t,e,r){var n=t("./_copyObject"),o=t("./_getSymbols");e.exports=function(t,e){return n(t,o(t),e)}},{"./_copyObject":90,"./_getSymbols":109}],92:[function(t,e,r){var n=t("./_copyObject"),o=t("./_getSymbolsIn");e.exports=function(t,e){return n(t,o(t),e)}},{"./_copyObject":90,"./_getSymbolsIn":110}],93:[function(t,e,r){var n=t("./_root")["__core-js_shared__"];e.exports=n},{"./_root":149}],94:[function(t,e,r){var n=t("./_baseRest"),o=t("./_isIterateeCall");e.exports=function(t){return n(function(e,r){var n=-1,i=r.length,a=i>1?r[i-1]:void 0,s=i>2?r[2]:void 0;for(a=t.length>3&&"function"==typeof a?(i--,a):void 0,s&&o(r[0],r[1],s)&&(a=i<3?void 0:a,i=1),e=Object(e);++n<i;){var c=r[n];c&&t(e,c,n,a)}return e})}},{"./_baseRest":74,"./_isIterateeCall":123}],95:[function(t,e,r){var n=t("./isArrayLike");e.exports=function(t,e){return function(r,o){if(null==r)return r;if(!n(r))return t(r,o);for(var i=r.length,a=e?i:-1,s=Object(r);(e?a--:++a<i)&&!1!==o(s[a],a,s););return r}}},{"./isArrayLike":175}],96:[function(t,e,r){e.exports=function(t){return function(e,r,n){for(var o=-1,i=Object(e),a=n(e),s=a.length;s--;){var c=a[t?s:++o];if(!1===r(i[c],c,i))break}return e}}},{}],97:[function(t,e,r){var n=t("./_getNative"),o=function(){try{var t=n(Object,"defineProperty");return t({},"",{}),t}catch(t){}}();e.exports=o},{"./_getNative":106}],98:[function(t,e,r){var n=t("./_SetCache"),o=t("./_arraySome"),i=t("./_cacheHas"),a=1,s=2;e.exports=function(t,e,r,c,u,f){var l=r&a,p=t.length,_=e.length;if(p!=_&&!(l&&_>p))return!1;var h=f.get(t);if(h&&f.get(e))return h==e;var y=-1,d=!0,b=r&s?new n:void 0;for(f.set(t,e),f.set(e,t);++y<p;){var v=t[y],g=e[y];if(c)var m=l?c(g,v,y,e,t,f):c(v,g,y,t,e,f);if(void 0!==m){if(m)continue;d=!1;break}if(b){if(!o(e,function(t,e){if(!i(b,e)&&(v===t||u(v,t,r,c,f)))return b.push(e)})){d=!1;break}}else if(v!==g&&!u(v,g,r,c,f)){d=!1;break}}return f.delete(t),f.delete(e),d}},{"./_SetCache":29,"./_arraySome":40,"./_cacheHas":80}],99:[function(t,e,r){var n=t("./_Symbol"),o=t("./_Uint8Array"),i=t("./eq"),a=t("./_equalArrays"),s=t("./_mapToArray"),c=t("./_setToArray"),u=1,f=2,l="[object Boolean]",p="[object Date]",_="[object Error]",h="[object Map]",y="[object Number]",d="[object RegExp]",b="[object Set]",v="[object String]",g="[object Symbol]",m="[object ArrayBuffer]",j="[object DataView]",x=n?n.prototype:void 0,w=x?x.valueOf:void 0;e.exports=function(t,e,r,n,x,A,O){switch(r){case j:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case m:return!(t.byteLength!=e.byteLength||!A(new o(t),new o(e)));case l:case p:case y:return i(+t,+e);case _:return t.name==e.name&&t.message==e.message;case d:case v:return t==e+"";case h:var E=s;case b:var T=n&u;if(E||(E=c),t.size!=e.size&&!T)return!1;var S=O.get(t);if(S)return S==e;n|=f,O.set(t,e);var I=a(E(t),E(e),n,x,A,O);return O.delete(t),I;case g:if(w)return w.call(t)==w.call(e)}return!1}},{"./_Symbol":31,"./_Uint8Array":32,"./_equalArrays":98,"./_mapToArray":139,"./_setToArray":152,"./eq":167}],100:[function(t,e,r){var n=t("./_getAllKeys"),o=1,i=Object.prototype.hasOwnProperty;e.exports=function(t,e,r,a,s,c){var u=r&o,f=n(t),l=f.length;if(l!=n(e).length&&!u)return!1;for(var p=l;p--;){var _=f[p];if(!(u?_ in e:i.call(e,_)))return!1}var h=c.get(t);if(h&&c.get(e))return h==e;var y=!0;c.set(t,e),c.set(e,t);for(var d=u;++p<l;){var b=t[_=f[p]],v=e[_];if(a)var g=u?a(v,b,_,e,t,c):a(b,v,_,t,e,c);if(!(void 0===g?b===v||s(b,v,r,a,c):g)){y=!1;break}d||(d="constructor"==_)}if(y&&!d){var m=t.constructor,j=e.constructor;m!=j&&"constructor"in t&&"constructor"in e&&!("function"==typeof m&&m instanceof m&&"function"==typeof j&&j instanceof j)&&(y=!1)}return c.delete(t),c.delete(e),y}},{"./_getAllKeys":102}],101:[function(t,e,r){(function(t){var r="object"==typeof t&&t&&t.Object===Object&&t;e.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],102:[function(t,e,r){var n=t("./_baseGetAllKeys"),o=t("./_getSymbols"),i=t("./keys");e.exports=function(t){return n(t,i,o)}},{"./_baseGetAllKeys":53,"./_getSymbols":109,"./keys":189}],103:[function(t,e,r){var n=t("./_baseGetAllKeys"),o=t("./_getSymbolsIn"),i=t("./keysIn");e.exports=function(t){return n(t,i,o)}},{"./_baseGetAllKeys":53,"./_getSymbolsIn":110,"./keysIn":190}],104:[function(t,e,r){var n=t("./_isKeyable");e.exports=function(t,e){var r=t.__data__;return n(e)?r["string"==typeof e?"string":"hash"]:r.map}},{"./_isKeyable":125}],105:[function(t,e,r){var n=t("./_isStrictComparable"),o=t("./keys");e.exports=function(t){for(var e=o(t),r=e.length;r--;){var i=e[r],a=t[i];e[r]=[i,a,n(a)]}return e}},{"./_isStrictComparable":128,"./keys":189}],106:[function(t,e,r){var n=t("./_baseIsNative"),o=t("./_getValue");e.exports=function(t,e){var r=o(t,e);return n(r)?r:void 0}},{"./_baseIsNative":63,"./_getValue":112}],107:[function(t,e,r){var n=t("./_overArg")(Object.getPrototypeOf,Object);e.exports=n},{"./_overArg":147}],108:[function(t,e,r){var n=t("./_Symbol"),o=Object.prototype,i=o.hasOwnProperty,a=o.toString,s=n?n.toStringTag:void 0;e.exports=function(t){var e=i.call(t,s),r=t[s];try{t[s]=void 0;var n=!0}catch(t){}var o=a.call(t);return n&&(e?t[s]=r:delete t[s]),o}},{"./_Symbol":31}],109:[function(t,e,r){var n=t("./_arrayFilter"),o=t("./stubArray"),i=Object.prototype.propertyIsEnumerable,a=Object.getOwnPropertySymbols,s=a?function(t){return null==t?[]:(t=Object(t),n(a(t),function(e){return i.call(t,e)}))}:o;e.exports=s},{"./_arrayFilter":36,"./stubArray":194}],110:[function(t,e,r){var n=t("./_arrayPush"),o=t("./_getPrototype"),i=t("./_getSymbols"),a=t("./stubArray"),s=Object.getOwnPropertySymbols?function(t){for(var e=[];t;)n(e,i(t)),t=o(t);return e}:a;e.exports=s},{"./_arrayPush":39,"./_getPrototype":107,"./_getSymbols":109,"./stubArray":194}],111:[function(t,e,r){var n=t("./_DataView"),o=t("./_Map"),i=t("./_Promise"),a=t("./_Set"),s=t("./_WeakMap"),c=t("./_baseGetTag"),u=t("./_toSource"),f=u(n),l=u(o),p=u(i),_=u(a),h=u(s),y=c;(n&&"[object DataView]"!=y(new n(new ArrayBuffer(1)))||o&&"[object Map]"!=y(new o)||i&&"[object Promise]"!=y(i.resolve())||a&&"[object Set]"!=y(new a)||s&&"[object WeakMap]"!=y(new s))&&(y=function(t){var e=c(t),r="[object Object]"==e?t.constructor:void 0,n=r?u(r):"";if(n)switch(n){case f:return"[object DataView]";case l:return"[object Map]";case p:return"[object Promise]";case _:return"[object Set]";case h:return"[object WeakMap]"}return e}),e.exports=y},{"./_DataView":22,"./_Map":25,"./_Promise":27,"./_Set":28,"./_WeakMap":33,"./_baseGetTag":54,"./_toSource":163}],112:[function(t,e,r){e.exports=function(t,e){return null==t?void 0:t[e]}},{}],113:[function(t,e,r){var n=t("./_castPath"),o=t("./isArguments"),i=t("./isArray"),a=t("./_isIndex"),s=t("./isLength"),c=t("./_toKey");e.exports=function(t,e,r){for(var u=-1,f=(e=n(e,t)).length,l=!1;++u<f;){var p=c(e[u]);if(!(l=null!=t&&r(t,p)))break;t=t[p]}return l||++u!=f?l:!!(f=null==t?0:t.length)&&s(f)&&a(p,f)&&(i(t)||o(t))}},{"./_castPath":82,"./_isIndex":122,"./_toKey":162,"./isArguments":173,"./isArray":174,"./isLength":178}],114:[function(t,e,r){var n=t("./_nativeCreate");e.exports=function(){this.__data__=n?n(null):{},this.size=0}},{"./_nativeCreate":142}],115:[function(t,e,r){e.exports=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}},{}],116:[function(t,e,r){var n=t("./_nativeCreate"),o="__lodash_hash_undefined__",i=Object.prototype.hasOwnProperty;e.exports=function(t){var e=this.__data__;if(n){var r=e[t];return r===o?void 0:r}return i.call(e,t)?e[t]:void 0}},{"./_nativeCreate":142}],117:[function(t,e,r){var n=t("./_nativeCreate"),o=Object.prototype.hasOwnProperty;e.exports=function(t){var e=this.__data__;return n?void 0!==e[t]:o.call(e,t)}},{"./_nativeCreate":142}],118:[function(t,e,r){var n=t("./_nativeCreate"),o="__lodash_hash_undefined__";e.exports=function(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=n&&void 0===e?o:e,this}},{"./_nativeCreate":142}],119:[function(t,e,r){var n=Object.prototype.hasOwnProperty;e.exports=function(t){var e=t.length,r=new t.constructor(e);return e&&"string"==typeof t[0]&&n.call(t,"index")&&(r.index=t.index,r.input=t.input),r}},{}],120:[function(t,e,r){var n=t("./_cloneArrayBuffer"),o=t("./_cloneDataView"),i=t("./_cloneRegExp"),a=t("./_cloneSymbol"),s=t("./_cloneTypedArray"),c="[object Boolean]",u="[object Date]",f="[object Map]",l="[object Number]",p="[object RegExp]",_="[object Set]",h="[object String]",y="[object Symbol]",d="[object ArrayBuffer]",b="[object DataView]",v="[object Float32Array]",g="[object Float64Array]",m="[object Int8Array]",j="[object Int16Array]",x="[object Int32Array]",w="[object Uint8Array]",A="[object Uint8ClampedArray]",O="[object Uint16Array]",E="[object Uint32Array]";e.exports=function(t,e,r){var T=t.constructor;switch(e){case d:return n(t);case c:case u:return new T(+t);case b:return o(t,r);case v:case g:case m:case j:case x:case w:case A:case O:case E:return s(t,r);case f:return new T;case l:case h:return new T(t);case p:return i(t);case _:return new T;case y:return a(t)}}},{"./_cloneArrayBuffer":83,"./_cloneDataView":85,"./_cloneRegExp":86,"./_cloneSymbol":87,"./_cloneTypedArray":88}],121:[function(t,e,r){var n=t("./_baseCreate"),o=t("./_getPrototype"),i=t("./_isPrototype");e.exports=function(t){return"function"!=typeof t.constructor||i(t)?{}:n(o(t))}},{"./_baseCreate":47,"./_getPrototype":107,"./_isPrototype":127}],122:[function(t,e,r){var n=9007199254740991,o=/^(?:0|[1-9]\d*)$/;e.exports=function(t,e){var r=typeof t;return!!(e=null==e?n:e)&&("number"==r||"symbol"!=r&&o.test(t))&&t>-1&&t%1==0&&t<e}},{}],123:[function(t,e,r){var n=t("./eq"),o=t("./isArrayLike"),i=t("./_isIndex"),a=t("./isObject");e.exports=function(t,e,r){if(!a(r))return!1;var s=typeof e;return!!("number"==s?o(r)&&i(e,r.length):"string"==s&&e in r)&&n(r[e],t)}},{"./_isIndex":122,"./eq":167,"./isArrayLike":175,"./isObject":182}],124:[function(t,e,r){var n=t("./isArray"),o=t("./isSymbol"),i=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,a=/^\w*$/;e.exports=function(t,e){if(n(t))return!1;var r=typeof t;return!("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=t&&!o(t))||a.test(t)||!i.test(t)||null!=e&&t in Object(e)}},{"./isArray":174,"./isSymbol":187}],125:[function(t,e,r){e.exports=function(t){var e=typeof t;return"string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t}},{}],126:[function(t,e,r){var n,o=t("./_coreJsData"),i=(n=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||""))?"Symbol(src)_1."+n:"";e.exports=function(t){return!!i&&i in t}},{"./_coreJsData":93}],127:[function(t,e,r){var n=Object.prototype;e.exports=function(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||n)}},{}],128:[function(t,e,r){var n=t("./isObject");e.exports=function(t){return t==t&&!n(t)}},{"./isObject":182}],129:[function(t,e,r){e.exports=function(){this.__data__=[],this.size=0}},{}],130:[function(t,e,r){var n=t("./_assocIndexOf"),o=Array.prototype.splice;e.exports=function(t){var e=this.__data__,r=n(e,t);return!(r<0||(r==e.length-1?e.pop():o.call(e,r,1),--this.size,0))}},{"./_assocIndexOf":42}],131:[function(t,e,r){var n=t("./_assocIndexOf");e.exports=function(t){var e=this.__data__,r=n(e,t);return r<0?void 0:e[r][1]}},{"./_assocIndexOf":42}],132:[function(t,e,r){var n=t("./_assocIndexOf");e.exports=function(t){return n(this.__data__,t)>-1}},{"./_assocIndexOf":42}],133:[function(t,e,r){var n=t("./_assocIndexOf");e.exports=function(t,e){var r=this.__data__,o=n(r,t);return o<0?(++this.size,r.push([t,e])):r[o][1]=e,this}},{"./_assocIndexOf":42}],134:[function(t,e,r){var n=t("./_Hash"),o=t("./_ListCache"),i=t("./_Map");e.exports=function(){this.size=0,this.__data__={hash:new n,map:new(i||o),string:new n}}},{"./_Hash":23,"./_ListCache":24,"./_Map":25}],135:[function(t,e,r){var n=t("./_getMapData");e.exports=function(t){var e=n(this,t).delete(t);return this.size-=e?1:0,e}},{"./_getMapData":104}],136:[function(t,e,r){var n=t("./_getMapData");e.exports=function(t){return n(this,t).get(t)}},{"./_getMapData":104}],137:[function(t,e,r){var n=t("./_getMapData");e.exports=function(t){return n(this,t).has(t)}},{"./_getMapData":104}],138:[function(t,e,r){var n=t("./_getMapData");e.exports=function(t,e){var r=n(this,t),o=r.size;return r.set(t,e),this.size+=r.size==o?0:1,this}},{"./_getMapData":104}],139:[function(t,e,r){e.exports=function(t){var e=-1,r=Array(t.size);return t.forEach(function(t,n){r[++e]=[n,t]}),r}},{}],140:[function(t,e,r){e.exports=function(t,e){return function(r){return null!=r&&r[t]===e&&(void 0!==e||t in Object(r))}}},{}],141:[function(t,e,r){var n=t("./memoize"),o=500;e.exports=function(t){var e=n(t,function(t){return r.size===o&&r.clear(),t}),r=e.cache;return e}},{"./memoize":192}],142:[function(t,e,r){var n=t("./_getNative")(Object,"create");e.exports=n},{"./_getNative":106}],143:[function(t,e,r){var n=t("./_overArg")(Object.keys,Object);e.exports=n},{"./_overArg":147}],144:[function(t,e,r){e.exports=function(t){var e=[];if(null!=t)for(var r in Object(t))e.push(r);return e}},{}],145:[function(t,e,r){var n=t("./_freeGlobal"),o="object"==typeof r&&r&&!r.nodeType&&r,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,a=i&&i.exports===o&&n.process,s=function(){try{var t=i&&i.require&&i.require("util").types;return t||a&&a.binding&&a.binding("util")}catch(t){}}();e.exports=s},{"./_freeGlobal":101}],146:[function(t,e,r){var n=Object.prototype.toString;e.exports=function(t){return n.call(t)}},{}],147:[function(t,e,r){e.exports=function(t,e){return function(r){return t(e(r))}}},{}],148:[function(t,e,r){var n=t("./_apply"),o=Math.max;e.exports=function(t,e,r){return e=o(void 0===e?t.length-1:e,0),function(){for(var i=arguments,a=-1,s=o(i.length-e,0),c=Array(s);++a<s;)c[a]=i[e+a];a=-1;for(var u=Array(e+1);++a<e;)u[a]=i[a];return u[e]=r(c),n(t,this,u)}}},{"./_apply":34}],149:[function(t,e,r){var n=t("./_freeGlobal"),o="object"==typeof self&&self&&self.Object===Object&&self,i=n||o||Function("return this")();e.exports=i},{"./_freeGlobal":101}],150:[function(t,e,r){var n="__lodash_hash_undefined__";e.exports=function(t){return this.__data__.set(t,n),this}},{}],151:[function(t,e,r){e.exports=function(t){return this.__data__.has(t)}},{}],152:[function(t,e,r){e.exports=function(t){var e=-1,r=Array(t.size);return t.forEach(function(t){r[++e]=t}),r}},{}],153:[function(t,e,r){var n=t("./_baseSetToString"),o=t("./_shortOut")(n);e.exports=o},{"./_baseSetToString":75,"./_shortOut":154}],154:[function(t,e,r){var n=800,o=16,i=Date.now;e.exports=function(t){var e=0,r=0;return function(){var a=i(),s=o-(a-r);if(r=a,s>0){if(++e>=n)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}},{}],155:[function(t,e,r){var n=t("./_ListCache");e.exports=function(){this.__data__=new n,this.size=0}},{"./_ListCache":24}],156:[function(t,e,r){e.exports=function(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}},{}],157:[function(t,e,r){e.exports=function(t){return this.__data__.get(t)}},{}],158:[function(t,e,r){e.exports=function(t){return this.__data__.has(t)}},{}],159:[function(t,e,r){var n=t("./_ListCache"),o=t("./_Map"),i=t("./_MapCache"),a=200;e.exports=function(t,e){var r=this.__data__;if(r instanceof n){var s=r.__data__;if(!o||s.length<a-1)return s.push([t,e]),this.size=++r.size,this;r=this.__data__=new i(s)}return r.set(t,e),this.size=r.size,this}},{"./_ListCache":24,"./_Map":25,"./_MapCache":26}],160:[function(t,e,r){e.exports=function(t,e,r){for(var n=r-1,o=t.length;++n<o;)if(t[n]===e)return n;return-1}},{}],161:[function(t,e,r){var n=t("./_memoizeCapped"),o=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,i=/\\(\\)?/g,a=n(function(t){var e=[];return 46===t.charCodeAt(0)&&e.push(""),t.replace(o,function(t,r,n,o){e.push(n?o.replace(i,"$1"):r||t)}),e});e.exports=a},{"./_memoizeCapped":141}],162:[function(t,e,r){var n=t("./isSymbol"),o=1/0;e.exports=function(t){if("string"==typeof t||n(t))return t;var e=t+"";return"0"==e&&1/t==-o?"-0":e}},{"./isSymbol":187}],163:[function(t,e,r){var n=Function.prototype.toString;e.exports=function(t){if(null!=t){try{return n.call(t)}catch(t){}try{return t+""}catch(t){}}return""}},{}],164:[function(t,e,r){var n=t("./_assignValue"),o=t("./_copyObject"),i=t("./_createAssigner"),a=t("./isArrayLike"),s=t("./_isPrototype"),c=t("./keys"),u=Object.prototype.hasOwnProperty,f=i(function(t,e){if(s(e)||a(e))o(e,c(e),t);else for(var r in e)u.call(e,r)&&n(t,r,e[r])});e.exports=f},{"./_assignValue":41,"./_copyObject":90,"./_createAssigner":94,"./_isPrototype":127,"./isArrayLike":175,"./keys":189}],165:[function(t,e,r){var n=t("./_baseClone"),o=4;e.exports=function(t){return n(t,o)}},{"./_baseClone":46}],166:[function(t,e,r){e.exports=function(t){return function(){return t}}},{}],167:[function(t,e,r){e.exports=function(t,e){return t===e||t!=t&&e!=e}},{}],168:[function(t,e,r){var n=t("./_arrayEach"),o=t("./_baseEach"),i=t("./_castFunction"),a=t("./isArray");e.exports=function(t,e){return(a(t)?n:o)(t,i(e))}},{"./_arrayEach":35,"./_baseEach":48,"./_castFunction":81,"./isArray":174}],169:[function(t,e,r){var n=t("./_baseGet");e.exports=function(t,e,r){var o=null==t?void 0:n(t,e);return void 0===o?r:o}},{"./_baseGet":52}],170:[function(t,e,r){var n=t("./_baseHasIn"),o=t("./_hasPath");e.exports=function(t,e){return null!=t&&o(t,e,n)}},{"./_baseHasIn":55,"./_hasPath":113}],171:[function(t,e,r){e.exports=function(t){return t}},{}],172:[function(t,e,r){var n=t("./_baseIndexOf"),o=t("./isArrayLike"),i=t("./isString"),a=t("./toInteger"),s=t("./values"),c=Math.max;e.exports=function(t,e,r,u){t=o(t)?t:s(t),r=r&&!u?a(r):0;var f=t.length;return r<0&&(r=c(f+r,0)),i(t)?r<=f&&t.indexOf(e,r)>-1:!!f&&n(t,e,r)>-1}},{"./_baseIndexOf":56,"./isArrayLike":175,"./isString":186,"./toInteger":197,"./values":200}],173:[function(t,e,r){var n=t("./_baseIsArguments"),o=t("./isObjectLike"),i=Object.prototype,a=i.hasOwnProperty,s=i.propertyIsEnumerable,c=n(function(){return arguments}())?n:function(t){return o(t)&&a.call(t,"callee")&&!s.call(t,"callee")};e.exports=c},{"./_baseIsArguments":57,"./isObjectLike":183}],174:[function(t,e,r){var n=Array.isArray;e.exports=n},{}],175:[function(t,e,r){var n=t("./isFunction"),o=t("./isLength");e.exports=function(t){return null!=t&&o(t.length)&&!n(t)}},{"./isFunction":177,"./isLength":178}],176:[function(t,e,r){var n=t("./_root"),o=t("./stubFalse"),i="object"==typeof r&&r&&!r.nodeType&&r,a=i&&"object"==typeof e&&e&&!e.nodeType&&e,s=a&&a.exports===i?n.Buffer:void 0,c=(s?s.isBuffer:void 0)||o;e.exports=c},{"./_root":149,"./stubFalse":195}],177:[function(t,e,r){var n=t("./_baseGetTag"),o=t("./isObject"),i="[object AsyncFunction]",a="[object Function]",s="[object GeneratorFunction]",c="[object Proxy]";e.exports=function(t){if(!o(t))return!1;var e=n(t);return e==a||e==s||e==i||e==c}},{"./_baseGetTag":54,"./isObject":182}],178:[function(t,e,r){var n=9007199254740991;e.exports=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=n}},{}],179:[function(t,e,r){var n=t("./_baseIsMap"),o=t("./_baseUnary"),i=t("./_nodeUtil"),a=i&&i.isMap,s=a?o(a):n;e.exports=s},{"./_baseIsMap":60,"./_baseUnary":78,"./_nodeUtil":145}],180:[function(t,e,r){e.exports=function(t){return null==t}},{}],181:[function(t,e,r){var n=t("./_baseGetTag"),o=t("./isObjectLike"),i="[object Number]";e.exports=function(t){return"number"==typeof t||o(t)&&n(t)==i}},{"./_baseGetTag":54,"./isObjectLike":183}],182:[function(t,e,r){e.exports=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}},{}],183:[function(t,e,r){e.exports=function(t){return null!=t&&"object"==typeof t}},{}],184:[function(t,e,r){var n=t("./_baseGetTag"),o=t("./_getPrototype"),i=t("./isObjectLike"),a="[object Object]",s=Function.prototype,c=Object.prototype,u=s.toString,f=c.hasOwnProperty,l=u.call(Object);e.exports=function(t){if(!i(t)||n(t)!=a)return!1;var e=o(t);if(null===e)return!0;var r=f.call(e,"constructor")&&e.constructor;return"function"==typeof r&&r instanceof r&&u.call(r)==l}},{"./_baseGetTag":54,"./_getPrototype":107,"./isObjectLike":183}],185:[function(t,e,r){var n=t("./_baseIsSet"),o=t("./_baseUnary"),i=t("./_nodeUtil"),a=i&&i.isSet,s=a?o(a):n;e.exports=s},{"./_baseIsSet":64,"./_baseUnary":78,"./_nodeUtil":145}],186:[function(t,e,r){var n=t("./_baseGetTag"),o=t("./isArray"),i=t("./isObjectLike"),a="[object String]";e.exports=function(t){return"string"==typeof t||!o(t)&&i(t)&&n(t)==a}},{"./_baseGetTag":54,"./isArray":174,"./isObjectLike":183}],187:[function(t,e,r){var n=t("./_baseGetTag"),o=t("./isObjectLike"),i="[object Symbol]";e.exports=function(t){return"symbol"==typeof t||o(t)&&n(t)==i}},{"./_baseGetTag":54,"./isObjectLike":183}],188:[function(t,e,r){var n=t("./_baseIsTypedArray"),o=t("./_baseUnary"),i=t("./_nodeUtil"),a=i&&i.isTypedArray,s=a?o(a):n;e.exports=s},{"./_baseIsTypedArray":65,"./_baseUnary":78,"./_nodeUtil":145}],189:[function(t,e,r){var n=t("./_arrayLikeKeys"),o=t("./_baseKeys"),i=t("./isArrayLike");e.exports=function(t){return i(t)?n(t):o(t)}},{"./_arrayLikeKeys":37,"./_baseKeys":67,"./isArrayLike":175}],190:[function(t,e,r){var n=t("./_arrayLikeKeys"),o=t("./_baseKeysIn"),i=t("./isArrayLike");e.exports=function(t){return i(t)?n(t,!0):o(t)}},{"./_arrayLikeKeys":37,"./_baseKeysIn":68,"./isArrayLike":175}],191:[function(t,e,r){var n=t("./_arrayMap"),o=t("./_baseIteratee"),i=t("./_baseMap"),a=t("./isArray");e.exports=function(t,e){return(a(t)?n:i)(t,o(e,3))}},{"./_arrayMap":38,"./_baseIteratee":66,"./_baseMap":69,"./isArray":174}],192:[function(t,e,r){var n=t("./_MapCache"),o="Expected a function";function i(t,e){if("function"!=typeof t||null!=e&&"function"!=typeof e)throw new TypeError(o);var r=function(){var n=arguments,o=e?e.apply(this,n):n[0],i=r.cache;if(i.has(o))return i.get(o);var a=t.apply(this,n);return r.cache=i.set(o,a)||i,a};return r.cache=new(i.Cache||n),r}i.Cache=n,e.exports=i},{"./_MapCache":26}],193:[function(t,e,r){var n=t("./_baseProperty"),o=t("./_basePropertyDeep"),i=t("./_isKey"),a=t("./_toKey");e.exports=function(t){return i(t)?n(a(t)):o(t)}},{"./_baseProperty":72,"./_basePropertyDeep":73,"./_isKey":124,"./_toKey":162}],194:[function(t,e,r){e.exports=function(){return[]}},{}],195:[function(t,e,r){e.exports=function(){return!1}},{}],196:[function(t,e,r){var n=t("./toNumber"),o=1/0,i=1.7976931348623157e308;e.exports=function(t){return t?(t=n(t))===o||t===-o?(t<0?-1:1)*i:t==t?t:0:0===t?t:0}},{"./toNumber":198}],197:[function(t,e,r){var n=t("./toFinite");e.exports=function(t){var e=n(t),r=e%1;return e==e?r?e-r:e:0}},{"./toFinite":196}],198:[function(t,e,r){var n=t("./isObject"),o=t("./isSymbol"),i=NaN,a=/^\s+|\s+$/g,s=/^[-+]0x[0-9a-f]+$/i,c=/^0b[01]+$/i,u=/^0o[0-7]+$/i,f=parseInt;e.exports=function(t){if("number"==typeof t)return t;if(o(t))return i;if(n(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=n(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(a,"");var r=c.test(t);return r||u.test(t)?f(t.slice(2),r?2:8):s.test(t)?i:+t}},{"./isObject":182,"./isSymbol":187}],199:[function(t,e,r){var n=t("./_baseToString");e.exports=function(t){return null==t?"":n(t)}},{"./_baseToString":77}],200:[function(t,e,r){var n=t("./_baseValues"),o=t("./keys");e.exports=function(t){return null==t?[]:n(t,o(t))}},{"./_baseValues":79,"./keys":189}],201:[function(t,e,r){var n=t("trim"),o=t("for-each");e.exports=function(t){if(!t)return{};var e={};return o(n(t).split("\n"),function(t){var r,o=t.indexOf(":"),i=n(t.slice(0,o)).toLowerCase(),a=n(t.slice(o+1));void 0===e[i]?e[i]=a:(r=e[i],"[object Array]"===Object.prototype.toString.call(r)?e[i].push(a):e[i]=[e[i],a])}),e}},{"for-each":19,trim:202}],202:[function(t,e,r){(r=e.exports=function(t){return t.replace(/^\s*|\s*$/g,"")}).left=function(t){return t.replace(/^\s*/,"")},r.right=function(t){return t.replace(/\s*$/,"")}},{}],203:[function(t,e,r){"use strict";var n=t("global/window"),o=t("is-function"),i=t("parse-headers"),a=t("xtend");function s(t,e,r){var n=t;return o(e)?(r=e,"string"==typeof t&&(n={uri:t})):n=a(e,{uri:t}),n.callback=r,n}function c(t,e,r){return u(e=s(t,e,r))}function u(t){if(void 0===t.callback)throw new Error("callback argument missing");var e=!1,r=function(r,n,o){e||(e=!0,t.callback(r,n,o))};function n(){var t=void 0;if(t=f.response?f.response:f.responseText||function(t){if("document"===t.responseType)return t.responseXML;var e=204===t.status&&t.responseXML&&"parsererror"===t.responseXML.documentElement.nodeName;if(""===t.responseType&&!e)return t.responseXML;return null}(f),b)try{t=JSON.parse(t)}catch(t){}return t}function o(t){return clearTimeout(l),t instanceof Error||(t=new Error(""+(t||"Unknown XMLHttpRequest Error"))),t.statusCode=0,r(t,v)}function a(){if(!u){var e;clearTimeout(l),e=t.useXDR&&void 0===f.status?200:1223===f.status?204:f.status;var o=v,a=null;return 0!==e?(o={body:n(),statusCode:e,method:_,headers:{},url:p,rawRequest:f},f.getAllResponseHeaders&&(o.headers=i(f.getAllResponseHeaders()))):a=new Error("Internal XMLHttpRequest Error"),r(a,o,o.body)}}var s,u,f=t.xhr||null;f||(f=t.cors||t.useXDR?new c.XDomainRequest:new c.XMLHttpRequest);var l,p=f.url=t.uri||t.url,_=f.method=t.method||"GET",h=t.body||t.data,y=f.headers=t.headers||{},d=!!t.sync,b=!1,v={body:void 0,headers:{},statusCode:0,method:_,url:p,rawRequest:f};if("json"in t&&!1!==t.json&&(b=!0,y.accept||y.Accept||(y.Accept="application/json"),"GET"!==_&&"HEAD"!==_&&(y["content-type"]||y["Content-Type"]||(y["Content-Type"]="application/json"),h=JSON.stringify(!0===t.json?h:t.json))),f.onreadystatechange=function(){4===f.readyState&&a()},f.onload=a,f.onerror=o,f.onprogress=function(){},f.onabort=function(){u=!0},f.ontimeout=o,f.open(_,p,!d,t.username,t.password),d||(f.withCredentials=!!t.withCredentials),!d&&t.timeout>0&&(l=setTimeout(function(){if(!u){u=!0,f.abort("timeout");var t=new Error("XMLHttpRequest timeout");t.code="ETIMEDOUT",o(t)}},t.timeout)),f.setRequestHeader)for(s in y)y.hasOwnProperty(s)&&f.setRequestHeader(s,y[s]);else if(t.headers&&!function(t){for(var e in t)if(t.hasOwnProperty(e))return!1;return!0}(t.headers))throw new Error("Headers cannot be set on an XDomainRequest object");return"responseType"in t&&(f.responseType=t.responseType),"beforeSend"in t&&"function"==typeof t.beforeSend&&t.beforeSend(f),f.send(h||null),f}e.exports=c,c.XMLHttpRequest=n.XMLHttpRequest||function(){},c.XDomainRequest="withCredentials"in new c.XMLHttpRequest?c.XMLHttpRequest:n.XDomainRequest,function(t,e){for(var r=0;r<t.length;r++)e(t[r])}(["get","put","post","patch","head","delete"],function(t){c["delete"===t?"del":t]=function(e,r,n){return(r=s(e,r,n)).method=t.toUpperCase(),u(r)}})},{"global/window":20,"is-function":21,"parse-headers":201,xtend:204}],204:[function(t,e,r){e.exports=function(){for(var t={},e=0;e<arguments.length;e++){var r=arguments[e];for(var o in r)n.call(r,o)&&(t[o]=r[o])}return t};var n=Object.prototype.hasOwnProperty},{}],airtable:[function(t,e,r){var n=t("./base"),o=t("./record"),i=t("./table"),a=t("./airtable_error");function s(t){t=t||{};var e=s.default_config(),r=t.apiVersion||s.apiVersion||e.apiVersion;if(Object.defineProperties(this,{_apiKey:{value:t.apiKey||s.apiKey||e.apiKey},_endpointUrl:{value:t.endpointUrl||s.endpointUrl||e.endpointUrl},_apiVersion:{value:r},_apiVersionMajor:{value:r.split(".")[0]},_noRetryIfRateLimited:{value:t.noRetryIfRateLimited||s.noRetryIfRateLimited||e.noRetryIfRateLimited}}),this.requestTimeout=t.requestTimeout||e.requestTimeout,!this._apiKey)throw new Error("An API key is required to connect to Airtable")}s.prototype.base=function(t){return n.createFunctor(this,t)},s.default_config=function(){return{endpointUrl:"https://api.airtable.com",apiVersion:"0.1.0",apiKey:void 0,noRetryIfRateLimited:!1,requestTimeout:3e5}},s.configure=function(t){s.apiKey=t.apiKey,s.endpointUrl=t.endpointUrl,s.apiVersion=t.apiVersion,s.noRetryIfRateLimited=t.noRetryIfRateLimited},s.base=function(t){return(new s).base(t)},s.Base=n,s.Record=o,s.Table=i,s.Error=a,e.exports=s},{"./airtable_error":1,"./base":2,"./record":13,"./table":15}]},{},["airtable"]);
/*
Project Name: SPIKE Prime Web Interface
File name: ServiceDock_SPIKE.js
Author: Jeremy Jung
Last update: 11/5/2020
Description: HTML Element definition for <service-spike> to be used in ServiceDocks
Credits/inspirations:
History:
    Created by Jeremy on 7/16/20
    Fixed baudRate by Teddy on 10/11/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
TODO:
include bluetooth_button and main_button in PrimeHub() SPIKE APP functions
Remove all instances of getPortsInfo in example codes
implement get_color
*/

// import { Service_SPIKE } from "./Service_SPIKE.js";

class servicespike extends HTMLElement {   

    constructor () {
        super();

        var active = false; // whether the service was activated
        this.service = new Service_SPIKE(); // instantiate a service object ( one object per button )

        this.service.executeAfterDisconnect(function () {
            active = false;
            status.style.backgroundColor = "red";
        })

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

        //var imageRelPath = "./modules/views/SPIKE_button.png" // relative to the document in which a servicespike is created ( NOT this file )
        var length = 50; // for width and height of button
        var buttonBackgroundColor = "#A2E1EF" // background color of the button
        var buttonStyle = "width:" + length + "px; height:" + length + "px; background:" + "url('data:image/png;base64,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')" + " no-repeat; background-size: 50px 50px; background-color:" + buttonBackgroundColor
            + "; border: none; background-position: center; cursor: pointer; border-radius: 10px; position: relative; margin: 4px 0px; "
        button.setAttribute("style", buttonStyle);

        /* status circle definition and CSS */

        this.status = document.createElement("div");
        this.status.setAttribute("class", "status");
        var length = 20; // for width and height of circle
        var statusBackgroundColor = "red" // default background color of service (inactive color)
        var posLeft = 30;
        var posTop = 20;
        var statusStyle = "border-radius: 50%; height:" + length + "px; width:" + length + "px; background-color:" + statusBackgroundColor +
            "; position: relative; left:" + posLeft + "px; top:" + posTop + "px;";
        this.status.setAttribute("style", statusStyle);

        /* event listeners */
        
        button.addEventListener("mouseleave", function (event) {
            button.style.backgroundColor = "#A2E1EF";
            button.style.color = "#000000";
        });

        button.addEventListener("mouseenter", function (event) {
            button.style.backgroundColor = "#FFFFFF";
            button.style.color = "#000000";
        })

        // when ServiceDock button is double clicked
        this.addEventListener("click", async function () {
            // check active flag so once activated, the service doesnt reinit
            if (!active) {
                console.log("%cTuftsCEEO ", "color: #3ba336;", "activating service");
                var initSuccessful = await this.service.init();
                if (initSuccessful) {
                    active = true;
                    this.status.style.backgroundColor = "green";
                }
            } 
        });


        shadow.appendChild(wrapper);
        button.appendChild(this.status);
        wrapper.appendChild(button);

    }

    /* get the Service_SPIKE object */
    getService() {
        return this.service;
    }

    /* get whether the ServiceDock button was clicked */
    getClicked() {
        return this.active;
    }

}

// when defining custom element, the name must have at least one - dash 
window.customElements.define('service-spike', servicespike);

/*
Project Name: SPIKE Prime Web Interface
File name: Service_SPIKE.js
Author: Jeremy Jung
Last update: 7/22/20
Description: SPIKE Service Library (OOP)
Credits/inspirations:
    Based on code wrriten by Ethan Danahy, Chris Rogers
History:
    Created by Jeremy on 7/15/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/


/**
 * @class Service_SPIKE 
 * @classdesc
 * ServiceDock library for interfacing with LEGO® SPIKE™ Prime
 * @example
 * // if you're using ServiceDock 
 * var mySPIKE = document.getElemenyById("service_spike").getService();
 * mySPIKE.executeAfterInit(async function() {
 *     // write code here
 * })
 * 
 * // if you're not using ServiceDock
 * var mySPIKE = new Service_SPIKE();
 * mySPIKE.init();
 * 
 * 
 */
function Service_SPIKE() {

    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    /* private members */

    const VENDOR_ID = 0x0694; // LEGO SPIKE Prime Hub

    // common characters to send (for REPL/uPython on the Hub)
    const CONTROL_C = '\x03'; // CTRL-C character (ETX character)
    const CONTROL_D = '\x04'; // CTRL-D character (EOT character)
    const RETURN = '\x0D';	// RETURN key (enter, new line)

    /* using this filter in webserial setup will only take serial ports*/
    const filter = {
        usbVendorId: VENDOR_ID

    };

    // define for communication
    let port;
    let reader;
    let writer;
    let value;
    let done;
    let writableStreamClosed;

    //define for json concatenation
    let jsonline = "";

    // contains latest full json object from SPIKE readings
    let lastUJSONRPC;

    // object containing real-time info on devices connected to each port of SPIKE Prime 
    let ports =
    {
        "A": { "device": "none", "data": {} },
        "B": { "device": "none", "data": {} },
        "C": { "device": "none", "data": {} },
        "D": { "device": "none", "data": {} },
        "E": { "device": "none", "data": {} },
        "F": { "device": "none", "data": {} }
    };

    // object containing real-time info on hub sensor values
    /*
        !say the usb wire is the nose of the spike prime

        ( looks at which side of the hub is facing up)
        gyro[0] - up/down detector ( down: 1000, up: -1000, neutral: 0)
        gyro[1] - rightside/leftside detector ( leftside : 1000 , rightside: -1000, neutal: 0 )
        gyro[2] - front/back detector ( front: 1000, back: -1000, neutral: 0 )

        ( assume the usb wire port is the nose of the spike prime )
        accel[0] - roll acceleration (roll to right: -, roll to left: +)
        accel[1] - pitch acceleration (up: +, down: -)
        accel[2] - yaw acceleration (counterclockwise: +. clockwise: -)

        ()
        pos[0] - yaw angle
        pos[1] - pitch angle
        pos[2] - roll angle

    */
    let hub =
    {
        "gyro": [0, 0, 0],
        "accel": [0, 0, 0],
        "pos": [0, 0, 0]
    }

    let batteryAmount = 0; // battery [0-100]

    // string containing real-time info on hub events
    let hubFrontEvent;

    /*
        up: hub is upright/standing, with the display looking horizontally
        down: hub is upsidedown with the display, with the display looking horizontally
        front: hub's display facing towards the sky
        back: hub's display facing towards the earth
        leftside: hub rotated so that the side to the left of the display is facing the earth
        rightside: hub rotated so that the side to the right of the display is facing the earth
    */
    let lastHubOrientation; //PrimeHub orientation read from caught UJSONRPC 

    /*
        shake
        freefall
    */
    let hubGesture;

    // 
    let hubMainButton = { "pressed": false, "duration": 0 };

    let hubBluetoothButton = { "pressed": false, "duration": 0 };

    let hubLeftButton = { "pressed": false, "duration": 0 };

    let hubRightButton = { "pressed": false, "duration": 0 };

    /* PrimeHub data storage arrays for was_***() functions */
    let hubGestures = []; // array of hubGestures run since program started or since was_gesture() ran
    let hubButtonPresses = [];
    let hubName = undefined;

    /* SPIKE Prime Projects */

    let hubProjects = {
        "0": "None",
        "1": "None",
        "2": "None",
        "3": "None",
        "4": "None",
        "5": "None",
        "6": "None",
        "7": "None",
        "8": "None",
        "9": "None",
        "10": "None",
        "11": "None",
        "12": "None",
        "13": "None",
        "14": "None",
        "15": "None",
        "16": "None",
        "17": "None",
        "18": "None",
        "19": "None"
    };

    var colorDictionary = {
        0: "BLACK",
        1: "VIOLET",
        3: "BLUE",
        4: "AZURE",
        5: "GREEN",
        7: "YELLOW",
        9: "RED",
        1: "WHITE",
    };

    // true after Force Sensor is pressed, turned to false after reading it for the first time that it is released
    let ForceSensorWasPressed = false;

    var micropython_interpreter = false; // whether micropython was reached or not

    let serviceActive = false; //serviceActive flag

    var waitForNewOriFirst = true; //whether the wait_for_new_orientation method would be the first time called

    /* stored callback functions from wait_until functions and etc. */

    var funcAtInit = undefined; // function to call after init of SPIKE Service

    var funcAfterNewGesture = undefined;
    var funcAfterNewOrientation = undefined;

    var funcAfterLeftButtonPress = undefined;
    var funcAfterLeftButtonRelease = undefined;
    var funcAfterRightButtonPress = undefined;
    var funcAfterRightButtonRelease = undefined;

    var funcUntilColor = undefined;
    var funcAfterNewColor = undefined;

    var funcAfterForceSensorPress = undefined;
    var funcAfterForceSensorRelease = undefined;

    /* array that holds the pointers to callback functions to be executed after a UJSONRPC response */
    var responseCallbacks = [];

    // array of information needed for writing program
    var startWriteProgramCallback = undefined; // [message_id, function to execute ]
    var writePackageInformation = undefined; // [ message_id, remaining_data, transfer_id, blocksize]
    var writeProgramCallback = undefined; // callback function to run after a program was successfully written
    var writeProgramSetTimeout = undefined; // setTimeout object for looking for response to start_write_program

    /* callback functions added for Coding Rooms */
    
    var getFirmwareInfoCallback = undefined;

    var funcAfterPrint = undefined; // function to call for SPIKE python program print statements or errors
    var funcAfterError = undefined; // function to call for errors in ServiceDock

    var funcAfterDisconnect = undefined; // function to call after SPIKE Prime is disconnected

    var funcWithStream = undefined; // function to call after every parsed UJSONRPC package

    var triggerCurrentStateCallback = undefined;

    //////////////////////////////////////////
    //                                      //
    //          Public Functions            //
    //                                      //
    //////////////////////////////////////////

    /**  initialize SPIKE_service
     * <p> Makes prompt in Google Chrome ( Google Chrome Browser needs "Experimental Web Interface" enabled) </p>
     * <p> Starts streaming UJSONRPC </p>
     * <p> <em> this function needs to be executed after executeAfterInit but before all other public functions </em> </p>
     * @public
     * @returns {boolean} True if service was successsfully initialized, false otherwise
     */
    async function init() {

        console.log("%cTuftsCEEO ", "color: #3ba336;", "navigator.product is ", navigator.product);
        console.log("%cTuftsCEEO ", "color: #3ba336;", "navigator.appName is ", navigator.appName);
        // reinit variables in the case of hardware disconnection and Service reactivation
        reader = undefined;
        writer = undefined;

        // initialize web serial connection
        var webSerialConnected = await initWebSerial();

        if (webSerialConnected) {

            // start streaming UJSONRPC
            streamUJSONRPC();

            await sleep(1000);

            triggerCurrentState();
            serviceActive = true;

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

    /**  Get the callback function to execute after service is initialized.
     * <p> <em> This function needs to be executed before calling init() </em> </p>
     * @public
     * @param {function} callback Function to execute after initialization ( during init() )
     * @example
     * var motor = mySPIKE.Motor("A");
     * mySPIKE.executeAfterInit( async function () {
     *     var speed = await motor.get_speed();
     *     // do something with speed
     * })
     */
    function executeAfterInit(callback) {
        // Assigns global variable funcAtInit a pointer to callback function
        funcAtInit = callback;
    }

    /**  Get the callback function to execute after a print or error from SPIKE python program
     * @ignore
     * @param {function} callback 
     */
    function executeAfterPrint(callback) {
        funcAfterPrint = callback;
    }

    /**  Get the callback function to execute after Service Dock encounters an error
     * @ignore
     * @param {any} callback 
     */
    function executeAfterError(callback) {
        funcAfterError = callback;
    }


    /**  Execute a stack of functions continuously with SPIKE sensor feed
     * 
     * @public
     * @param {any} callback 
     * @example
     * var motor = new mySPIKE.Motor('A')
     * mySPIKE.executeWithStream( async function() {
     *      var speed = await motor.get_speed();
     *      // do something with motor speed
     * })
     */
    function executeWithStream(callback) {
        funcWithStream = callback;
    }

    /**  Get the callback function to execute after service is disconnected
     * @ignore
     * @param {any} callback 
     */
    function executeAfterDisconnect(callback) {
        funcAfterDisconnect = callback;
    }

    /**  Send command to the SPIKE Prime (UJSON RPC or Micropy depending on current interpreter)
     * <p> May make the SPIKE Prime do something </p>
     * @ignore
     * @param {string} command Command to send (or sequence of commands, separated by new lines)
     */
    async function sendDATA(command) {
        // look up the command to send
        var commands = command.split("\n"); // split on new line
        //commands = command
        console.log("%cTuftsCEEO ", "color: #3ba336;", "sendDATA: " + commands);

        // make sure ready to write to device
        setupWriter();

        // send it in micropy if micropy reached
        if (micropython_interpreter) {

            for (var i = 0; i < commands.length; i++) {
                // console.log("%cTuftsCEEO ", "color: #3ba336;", "commands.length", commands.length)

                // trim trailing, leading whitespaces
                var current = commands[i].trim();

                writer.write(current);
                writer.write(RETURN); // extra return at the end
            }
        }
        // expect json scripts if micropy not reached
        else {
            // go through each line of the command
            // trim it, send it, and send a return...
            for (var i = 0; i < commands.length; i++) {

                //console.log("%cTuftsCEEO ", "color: #3ba336;", "commands.length", commands.length)

                current = commands[i].trim();
                //console.log("%cTuftsCEEO ", "color: #3ba336;", "current", current);
                // turn string into JSON

                //string_current = (JSON.stringify(current));
                //myobj = JSON.parse(string_current);
                var myobj = await JSON.parse(current);

                // turn JSON back into string and write it out
                writer.write(JSON.stringify(myobj));
                writer.write(RETURN); // extra return at the end
            }
        }
    }


    /**  Send character sequences to reboot SPIKE Prime
     * <p> <em> Run this function to exit micropython interpreter </em> </p>
     * @public
     * @example
     * mySPIKE.rebootHub();
     */
    function rebootHub() {
        console.log("%cTuftsCEEO ", "color: #3ba336;", "rebooting")
        // make sure ready to write to device
        setupWriter();
        writer.write(CONTROL_C);
        writer.write(CONTROL_D);

        //toggle micropython_interpreter flag if its was active
        if (micropython_interpreter) {
            micropython_interpreter = false;
        }
    }

    /**  Get the information of all the ports and devices connected to them
     * @ignore
     * @returns {object} <p> An object with keys as port letters and values as objects of device type and info </p>
     * @example
     * // USAGE 
     * 
     * var portsInfo = await mySPIKE.getPortsInfo();
     * // ports.{yourPortLetter}.device --returns--> device type (ex. "smallMotor" or "ultrasonic") </p>
     * // ports.{yourPortLetter}.data --returns--> device info (ex. {"speed": 0, "angle":0, "uAngle": 0, "power":0} ) </p>
     * 
     * // Motor on port A
     * var motorSpeed = portsInfo["A"]["speed"]; // motor speed
     * var motorDegreesCounted = portsInfo["A"]["angle"]; // motor angle
     * var motorPosition = portsInfo["A"]["uAngle"]; // motor angle in unit circle ( -180 ~ 180 )
     * var motorPower = portsInfo["A"]["power"]; // motor power
     * 
     * // Ultrasonic Sensor on port A
     * var distance = portsInfo["A"]["distance"] // distance value from ultrasonic sensor
     * 
     * // Color Sensor on port A
     * var reflectedLight = portsInfo["A"]["reflected"]; // reflected light
     * var ambientLight = portsInfo["A"]["ambient"]; // ambient light
     * var RGB = portsInfo["A"]["RGB"]; // [R, G, B]
     * 
     * // Force Sensor on port A
     * var forceNewtons = portsInfo["A"]["force"]; // Force in Newtons ( 1 ~ 10 ) 
     * var pressedBool = portsInfo["A"]["pressed"] // whether pressed or not ( true or false )
     * var forceSensitive = portsInfo["A"]["forceSensitive"] // More sensitive force output( 0 ~ 900 )
     */
    async function getPortsInfo() {
        return ports;
    }

    /**  get the info of a single port
     * @ignore
     * @param {string} letter Port on the SPIKE hub
     * @returns {object} Keys as device and info as value
     */
    async function getPortInfo(letter) {
        return ports[letter];
    }

    /**  Get battery status
     * @ignore
     * @returns {integer} battery percentage
     */
    async function getBatteryStatus() {
        return batteryAmount;
    }

    /**  Get info of the hub
     * @ignore
     * @returns {object} Info of the hub
     * @example
     * var hubInfo = await mySPIKE.getHubInfo();
     * 
     * var upDownDetector = hubInfo["gyro"][0];
     * var rightSideLeftSideDetector = hubInfo["gyro"][1];
     * var frontBackDetector = hubInfo["gyro"][2];
     * 
     * var rollAcceleration = hubInfo["pos"][0];  
     * var pitchAcceleration = hubInfo["pos"][1]; 
     * var yawAcceleration = hubInfo["pos"][2];   
     * 
     * var yawAngle = hubInfo["pos"][0];
     * var pitchAngle = hubInfo["pos"][1];
     * var rollAngle = hubInfo["pos"][2];
     * 
     * 
     */
    async function getHubInfo() {
        return hub;
    }

    /**  Get the name of the hub
     * 
     * @public
     * @returns name of hub
     */
    async function getHubName() {
        return hubName;
    }

    /**
     * @ignore
     * @param {any} callback 
     */
    async function getFirmwareInfo(callback) {

        UJSONRPC.getFirmwareInfo(callback);

    }


    /**  get projects in all the slots of SPIKE Prime hub
     * 
     * @ignore
     * @returns {object}
     */
    async function getProjects() {

        UJSONRPC.getStorageStatus();

        await sleep(2000);

        return hubProjects
    }

    /**  Reach the micropython interpreter beneath UJSON RPC
     * <p> Note: Stops UJSON RPC stream </p>
     * <p> hub needs to be rebooted to return to UJSONRPC stream</p>
     * @ignore
     * @example
     * mySPIKE.reachMicroPy();
     * mySPIKE.sendDATA("from spike import PrimeHub");
     * mySPIKE.sendDATA("hub = PrimeHub()");
     * mySPIKE.sendDATA("hub.light_matrix.show_image('HAPPY')");
     */
    function reachMicroPy() {
        console.log("%cTuftsCEEO ", "color: #3ba336;", "starting micropy interpreter");
        setupWriter();
        writer.write(CONTROL_C);
        micropython_interpreter = true;
    }

    /**  Get the latest complete line of UJSON RPC from stream
     * @ignore
     * @returns {string} Represents a JSON object from UJSON RPC
     */
    async function getLatestUJSON() {

        try {
            var parsedUJSON = await JSON.parse(lastUJSONRPC)
        }
        catch (error) {
            //console.log("%cTuftsCEEO ", "color: #3ba336;", '[retrieveData] ERROR', error);
        }

        return lastUJSONRPC
    }

    /** Get whether the Service was initialized or not
     * @public
     * @returns {boolean} True if service initialized, false otherwise
     * @example
     * if (mySPIKE.isActive()) {
     *      // do something
     * }
     */
    function isActive() {
        return serviceActive;
    }

    /**  Get the most recently detected event on the display of the hub
     * @public
     * @returns {string} ['tapped','doubletapped']
     * var event = await mySPIKE.getHubEvent();
     * if (event == "tapped" ) {
     *      console.log("SPIKE is tapped");
     * }
     */
    async function getHubEvent() {
        return hubFrontEvent;
    }

    /**  Get the most recently detected gesture of the hub
     * @public
     * @returns {string} ['shake', 'freefall']
     * @example
     * var gesture = await mySPIKE.getHubGesture();
     * if (gesture == "shake") {
     *      console.log("SPIKE is being shaked");
     * }
     */
    async function getHubGesture() {
        return hubGesture;
    }

    /**  Get the most recently detected orientation of the hub
     * @public
     * @returns {string} ['up','down','front','back','leftside','rightside']
     * @example
     * var orientation = await mySPIKE.getHubOrientation();
     * if (orientation == "front") {
     *      console.log("SPIKE is facing up");
     * }
     */
    async function getHubOrientation() {
        return lastHubOrientation;
    }


    /**  Get the latest press event information on the "connect" button
     * @ignore
     * @returns {object} { "pressed": BOOLEAN, "duration": NUMBER } 
     * @example
     * var bluetoothButtonInfo = await mySPIKE.getBluetoothButton();
     * var pressedBool = bluetoothButtonInfo["pressed"];
     * var pressedDuration = bluetoothButtonInfo["duration"]; // duration is miliseconds the button was pressed until release
     */
    async function getBluetoothButton() {
        return hubBluetoothButton;
    }

    /**  Get the latest press event information on the "center" button
     * @ignore
     * @returns {object} { "pressed": BOOLEAN, "duration": NUMBER }
     * @example
     * var mainButtonInfo = await mySPIKE.getMainButton();
     * var pressedBool = mainButtonInfo["pressed"];
     * var pressedDuration = mainButtonInfo["duration"]; // duration is miliseconds the button was pressed until release
     * 
     */
    async function getMainButton() {
        return hubMainButton;
    }

    /**  Get the latest press event information on the "left" button
     * @ignore
     * @returns {object} { "pressed": BOOLEAN, "duration": NUMBER } 
     * @example
     * var leftButtonInfo = await mySPIKE.getLeftButton();
     * var pressedBool = leftButtonInfo["pressed"];
     * var pressedDuration = leftButtonInfo["duration"]; // duration is miliseconds the button was pressed until release
     * 
     */
    async function getLeftButton() {
        return hubLeftButton;
    }

    /**  Get the latest press event information on the "right" button
     * @ignore
     * @returns {object} { "pressed": BOOLEAN, "duration": NUMBER } 
     * @example
     * var rightButtonInfo = await mySPIKE.getRightButton();
     * var pressedBool = rightButtonInfo["pressed"];
     * var pressedDuration = rightButtonInfo["duration"]; // duration is miliseconds the button was pressed until release
     */
    async function getRightButton() {
        return hubRightButton;
    }

    /**  Get the letters of ports connected to any kind of Motors
     * @public
     * @returns {(string|Array)} Ports that are connected to Motors
     */
    async function getMotorPorts() {

        var portsInfo = ports;
        var motorPorts = [];
        for (var key in portsInfo) {
            if (portsInfo[key].device == "smallMotor" || portsInfo[key].device == "bigMotor") {
                motorPorts.push(key);
            }
        }
        return motorPorts;

    }

    /**  Get the letters of ports connected to Small Motors
     * @public
     * @returns {(string|Array)} Ports that are connected to Small Motors
     */
    async function getSmallMotorPorts() {

        var portsInfo = ports;
        var motorPorts = [];
        for (var key in portsInfo) {
            if (portsInfo[key].device == "smallMotor") {
                motorPorts.push(key);
            }
        }
        return motorPorts;

    }

    /**  Get the letters of ports connected to Big Motors
     * @public
     * @returns {(string|Array)} Ports that are connected to Big Motors
     */
    async function getBigMotorPorts() {
        var portsInfo = ports;
        var motorPorts = [];
        for (var key in portsInfo) {
            if (portsInfo[key].device == "bigMotor") {
                motorPorts.push(key);
            }
        }
        return motorPorts;
    }

    /**  Get the letters of ports connected to Distance Sensors
     * @public
     * @returns {(string|Array)} Ports that are connected to Distance Sensors
     */
    async function getUltrasonicPorts() {

        var portsInfo = await this.getPortsInfo();
        var ultrasonicPorts = [];

        for (var key in portsInfo) {
            if (portsInfo[key].device == "ultrasonic") {
                ultrasonicPorts.push(key);
            }
        }

        return ultrasonicPorts;

    }

    /**  Get the letters of ports connected to Color Sensors
     * @public
     * @returns {(string|Array)} Ports that are connected to Color Sensors
     */
    async function getColorPorts() {

        var portsInfo = await this.getPortsInfo();
        var colorPorts = [];

        for (var key in portsInfo) {
            if (portsInfo[key].device == "color") {
                colorPorts.push(key);
            }
        }

        return colorPorts;

    }

    /**  Get the letters of ports connected to Force Sensors
     * @public
     * @returns {(string|Array)} Ports that are connected to Force Sensors
     */
    async function getForcePorts() {

        var portsInfo = await this.getPortsInfo();
        var forcePorts = [];

        for (var key in portsInfo) {
            if (portsInfo[key].device == "force") {
                forcePorts.push(key);
            }
        }

        return forcePorts;

    }

    /**  Get all motor objects currently connected to SPIKE
     * 
     * @public
     * @returns {object} All connected Motor objects
     * @example
     * var motors = await mySPIKE.getMotors();
     * var myMotor = motors["A"]  
     */
    async function getMotors() {
        var portsInfo = ports;
        var motors = {};
        for (var key in portsInfo) {
            if (portsInfo[key].device == "smallMotor" || portsInfo[key].device == "bigMotor") {
                motors[key] = new Motor(key);
            }
        }
        return motors;
    }

    /**  Get all distance sensor objects currently connected to SPIKE
     * 
     * @public
     * @returns {object} All connected DistanceSensor objects
     * @example
     * var distanceSensors = await mySPIKE.getDistanceSensors();
     * var mySensor = distanceSensors["A"];
     */
    async function getDistanceSensors() {
        var portsInfo = ports;
        var distanceSensors = {};
        for (var key in portsInfo) {
            if (portsInfo[key].device == "ultrasonic") {
                distanceSensors[key] = new DistanceSensor(key);
            }
        }
        return distanceSensors;
    }

    /**  Get all color sensor objects currently connected to SPIKE
     * 
     * @public
     * @returns {object} All connected ColorSensor objects
     * @example
     * var colorSensors = await mySPIKE.getColorSensors();
     * var mySensor = colorSensors["A"];
     */
    async function getColorSensors() {
        var portsInfo = ports;
        var colorSensors = {};
        for (var key in portsInfo) {
            if (portsInfo[key].device == "color") {
                colorSensors[key] = new ColorSensor(key);
            }
        }
        return colorSensors;
    }

    /**  Get all force sensor objects currently connected to SPIKE
     * 
     * @public
     * @returns {object} All connected ForceSensor objects
     * @example
     * var forceSensors = await mySPIKE.getForceSensors();
     * var mySensor = forceSensors["A"];
     */
    async function getForceSensors() {
        var portsInfo = ports;
        var forceSensors = {};
        for (var key in portsInfo) {
            if (portsInfo[key].device == "force") {
                forceSensors[key] = new ForceSensor(key);
            }
        }
        return forceSensors;
    }


    /**  Terminate currently running micropy progra
     * @ignore
     */
    function stopCurrentProgram() {
        UJSONRPC.programTerminate();
    }

    /** Push micropython code that retrieves all JS global variables and local variables at the scope in which
     * this function was called
     * @public
     * @param {integer} slotid 
     * @param {string} program program to write must be in TEMPLATE LITERAL
     * @example
     * mySPIKE.micropython(10, `
     *from spike import PrimeHub, LightMatrix, Motor, MotorPair
     *from spike.control import wait_for_seconds, wait_until, Timer
     *
     *hub = PrimeHub()
     *
     *hub.light_matrix.write(run_for_seconds(2))
     *
     *run_for_seconds(3)
     * `)
     */
    function micropython(slotid, program) {
        // initialize microPyUtils
        micropyUtils.init();

        /* add local variables of the caller of this function */
        // get the function definition of caller
        /* parse and add all local variable declarations to micropyUtils.storedVariables
    
        var aString = "hi" or var aString = 'hi' > {aString: "hi"}
    
        */
        var thisFunction = arguments.callee.caller.toString();

        // split function scope by newlines
        var newLineRule = /\n/g
        var arrayLines = thisFunction.split(newLineRule);

        // filter lines that dont contain var, or contains function
        var arrayVarLines = [];
        for (var index in arrayLines) {
            if (arrayLines[index].indexOf("var") > -1) {
                // filter out functions and objects
                if (arrayLines[index].indexOf("function") == -1 && arrayLines[index].indexOf("{") == -1 && arrayLines[index].indexOf("}") == -1) {
                    arrayVarLines.push(arrayLines[index]);
                }
            }
        }

        var parseRule = /[[ ]/g
        for (var index in arrayVarLines) {
            // process line
            var processedLine = micropyUtils.processString(arrayVarLines[index]);

            // get [datatype] object = value format
            var listParsedLine = processedLine.split(parseRule);
            //listParsedLine = listParsedLine.split(/[=]/g)

            var keyValue = micropyUtils.checkString(listParsedLine);

            // insert into variables 
            for (var name in keyValue) {
                micropyUtils.storedVariables[name] = keyValue[name];
            }
        }

        /* generate lines of micropy variable declarations */
        var lines = [];
        for (var name in micropyUtils.storedVariables) {
            var variableName = name;
            if (typeof micropyUtils.storedVariables[name] !== "function" && typeof micropyUtils.storedVariables[name] !== "object") {
                var variableValue = micropyUtils.convertToString(micropyUtils.storedVariables[name]);
                lines.push("" + variableName + " = " + variableValue);

            }
        }

        // do add new lines to every line
        var linesChunk = ""
        for (var index in lines ) {
            var linePiece = lines[index];
            linesChunk = linesChunk + linePiece + "\n";
        }

        var programToWrite = linesChunk + program;
        writeProgram("micropython", programToWrite, slotid, function() {
            console.log("micropy program write complete")
        })
    }

    /**  write a micropy program into a slot of the SPIKE Prime
     * 
     * @ignore
     * @param {string} projectName name of the project to register
     * @param {string} data the micropy code to send (expecting an <input type="text">.value)
     * @param {integer} slotid slot number to assign the program in [0-9]
     * @param {function} callback callback to run after program is written
     */
    async function writeProgram(projectName, data, slotid, callback) {

        // reinit witeProgramTimeout
        if (writeProgramSetTimeout != undefined) {
            clearTimeout(writeProgramSetTimeout);
            writeProgramSetTimeout = undefined;
        }

        // template of python file that needs to be concatenated
        var firstPart = "from runtime import VirtualMachine\n\n# Stack for execution:\nasync def stack_1(vm, stack):\n"
        var secondPart = "# Setup for execution:\ndef setup(rpc, system, stop):\n\n    # Initialize VM:\n    vm = VirtualMachine(rpc, system, stop, \"Target__1\")\n\n    # Register stack on VM:\n    vm.register_on_start(\"stack_1\", stack_1)\n\n    return vm"

        // stringify data and strip trailing and leading quotation marks
        var stringifiedData = JSON.stringify(data);
        stringifiedData = stringifiedData.substring(1, stringifiedData.length - 1);

        var result = ""; // string to which the final code will be appended

        var splitData = stringifiedData.split(/\\n/); // split the code by every newline

        // add a tab before every newline (this is syntactically needed for concatenating with the template)
        for (var index in splitData) {

            var addedTab = "    " + splitData[index] + "\n";

            result = result + addedTab;
        }

        // replace tab characters
        result = result.replace(/\\t/g, "    ");

        stringifiedData = firstPart + result + secondPart;

        writeProgramCallback = callback;

        // begin the write program process
        UJSONRPC.startWriteProgram(projectName, "python", stringifiedData, slotid);

    }

    /**  Execute a program in a slot
     * 
     * @ignore
     * @param {integer} slotid slot of program to execute [0-9]
     */
    function executeProgram(slotid) {
        UJSONRPC.programExecute(slotid)
    }

    //////////////////////////////////////////
    //                                      //
    //         SPIKE APP Functions          //
    //                                      //
    //////////////////////////////////////////

    /** PrimeHub object
    * @ignore
    * @memberof Service_SPIKE
    * @returns {classes} 
    * <p> left_button </p>
    * <p> right_button </p>
    * <p> motion_sensor </p>
    * <p> light_matrix </p>
    */
    PrimeHub = function () {
        var newOrigin = 0;

        /** The left button on the hub
        * @class
        * @returns {functions} - functions from PrimeHub.left_button
        * @example
        * var hub = mySPIKE.PrimeHub();
        * var left_button = hub.left_button();
        * // do something with left_button
        */
        var left_button = {};

        /** execute callback after this button is pressed
        * @param {function} callback
        */
        left_button.wait_until_pressed = function wait_until_pressed(callback) {
            funcAfterLeftButtonPress = callback;
        }
        /** execute callback after this button is released
         *
         * @param {function} callback
         */
        left_button.wait_until_released = function wait_until_released(callback) {
            funcAfterLeftButtonRelease = callback;
        }
        /** Tests to see whether the button has been pressed since the last time this method called.
         *
         * @returns {boolean} - True if was pressed, false otherwise
         */
        left_button.was_pressed = function was_pressed() {
            if (hubLeftButton.duration > 0) {
                hubLeftButton.duration = 0;
                return true;
            } else {
                return false;
            }
        }

        /** Tests to see whether the button is pressed
        *
        * @returns {boolean} True if pressed, false otherwise
        */
        left_button.is_pressed = function is_pressed() {
            if (hubLeftButton.pressed) {
                return true;
            }
            else {
                return false;
            }
        }

        /** The right button on the hub
         * @class
         * @returns {functions} functions from PrimeHub.right_button
         * @example
         * var hub = mySPIKE.PrimeHub();
         * var right_button = hub.right_button();
         * // do something with right_button
         */
        var right_button = {};

        /** execute callback after this button is pressed
        *
        * @param {function} callback
        * @example
        * var hub = new mySPIKE.PrimeHub();
        * var right_button = hub.right_button;
        * right_button.wait_until_pressed ( function () {
        *     console.log("right_button was pressed");
        * })
        */
        right_button.wait_until_pressed = function wait_until_pressed(callback) {

            funcAfterRightButtonPress = callback;
        }

        /** execute callback after this button is released
         * 
         * @param {function} callback 
         * @example
         * var hub = new mySPIKE.PrimeHub();
         * var right_button = hub.right_button;
         * right_button.wait_until_released ( function () {
         *     console.log("right_button was released");
         * })
         */
        right_button.wait_until_released = function wait_until_released(callback) {

            functAfterRightButtonRelease = callback;
        }

        /** Tests to see whether the button has been pressed since the last time this method called.
         * 
         * @returns {boolean} - True if was pressed, false otherwise
         * @example
         * var hub = new mySPIKE.PrimeHub();
         * if ( hub.right_button.was_pressed() ) {
         *     console.log("right_button was pressed");
         * }
         */
        right_button.was_pressed = function was_pressed() {
            if (hubRightButton.duration > 0) {
                hubRightButton.duration = 0;
                return true;
            } else {
                return false;
            }
        }

        /** Tests to see whether the button is pressed
         * 
         * @returns {boolean} True if pressed, false otherwise
         */
        right_button.is_pressed = function is_pressed() {
            if (hubRightButton.pressed) {
                return true;
            }
            else {
                return false;
            }
        }

        /** Hub's light matrix
         * @class
         * @returns {functions} - functions from PrimeHub.light_matrix
         * @example
         * var hub = mySPIKE.PrimeHub();
         * var light_matrix = hub.light_matrix();
         * // do something with light_matrix
         */
        var light_matrix = {};

        /**
         * @todo Implement this function
         * @param {string}
         */
        light_matrix.show_image = function show_image(image) {

        }
        /** Sets the brightness of one pixel (one of the 25 LED) on the Light Matrix.
         * 
         * @param {integer} x [0 to 4]
         * @param {integer} y [0 to 4]
         * @param {integer} brightness [0 to 100]
         */
        light_matrix.set_pixel = function set_pixel(x, y, brightness = 100) {
            UJSONRPC.displaySetPixel(x, y, brightness);

        }
        /** Writes text on the Light Matrix, one letter at a time, scrolling from right to left.
         * 
         * @param {string} message 
         */
        light_matrix.write = function write(message) {
            UJSONRPC.displayText(message);
        }
        /** Turns off all the pixels on the Light Matrix.
         * 
         */
        light_matrix.off = function off() {
            UJSONRPC.displayClear();
        }

        /** Hub's speaker
         * @class
         * @returns {functions} functions from Primehub.speaker
         * @example
         * var hub = mySPIKE.PrimeHub();
         * var speaker = hub.speaker();
         * // do something with speaker
         */
        var speaker = {};

        speaker.volume = 100;

        /** Plays a beep on the Hub.
         * 
         * @param {integer} note The MIDI note number [44 to 123 (60 is middle C note)]
         * @param {number} seconds The duration of the beep in seconds
         */
        speaker.beep = function beep(note, seconds) {
            UJSONRPC.soundBeep(speaker.volume, note);
            setTimeout(function () { UJSONRPC.soundStop() }, seconds * 1000);
        }

        /** Starts playing a beep.
         * 
         * @param {integer} note The MIDI note number [44 to 123 (60 is middle C note)]
         */
        speaker.start_beep = function start_beep(note) {
            UJSONRPC.soundBeep(speaker.volume, note)
        }

        /** Stops any sound that is playing.
         * 
         */
        speaker.stop = function stop() {
            UJSONRPC.soundStop();
        }

        /** Retrieves the value of the speaker volume.
         * @returns {number} The current volume [0 to 100]
         */
        speaker.get_volume = function get_volume() {
            return speaker.volume;
        }

        /** Sets the speaker volume.
         * 
         * @param {integer} newVolume 
         */
        speaker.set_volume = function set_volume(newVolume) {
            speaker.volume = newVolume
        }

        /** Hub's motion sensor
         * @class
         * @returns {functions} functions from PrimeHub.motion_sensor
         * @example
         * var hub = mySPIKE.PrimeHub();
         * var motion_sensor = hub.motion_sensor();
         * // do something with motion_sensor
         */
        var motion_sensor = {};

        /** Sees whether a gesture has occurred since the last time was_gesture() 
         * was used or since the beginning of the program (for the first use).
         * 
         * @param  {string} gesture
         * @returns {boolean} true if the gesture was made, false otherwise
         */
        motion_sensor.was_gesture = function was_gesture(gesture) {

            var gestureWasMade = false;

            // iterate over the hubGestures array
            for (index in hubGestures) {

                // pick a gesture from the array
                var oneGesture = hubGestures[index];

                // switch the flag that gesture existed
                if (oneGesture == gesture) {
                    gestureWasMade = true;
                    break;
                }
            }
            // reinitialize hubGestures so it only holds gestures that occurred after this was_gesture() execution
            hubGestures = [];

            return gestureWasMade;

        }

        /** Executes callback when a new gesture happens
         * 
         * @param  {function(string)} callback - A callback whose signature is name of the gesture
         */
        motion_sensor.wait_for_new_gesture = function wait_for_new_gesture(callback) {

            funcAfterNewGesture = callback;

        }

        /** Executes callback when the orientation of the Hub changes or when function was first called
         * 
         * @param  {function(string)} callback - A callback whose signature is name of the orientation
         */
        motion_sensor.wait_for_new_orientation = function wait_for_new_orientation(callback) {
            // immediately return current orientation if the method was called for the first time
            if (waitForNewOriFirst) {
                waitForNewOriFirst = false;
                callback(lastHubOrientation);
            }
            // for future executions, wait until new orientation
            else {
                funcAfterNewOrientation = callback;
            }

        }

        /** “Yaw” is the rotation around the front-back (vertical) axis.
         * 
         * @returns {integer} yaw angle
         */
        motion_sensor.get_yaw_angle = function get_yaw_angle() {
            var currPos = hub.pos[0];

            return currPos;
        }

        /** “Pitch” the is rotation around the left-right (transverse) axis.
         * 
         * @returns {integer} pitch angle
         */
        motion_sensor.get_pitch_angle = function get_pitch_angle() {
            return hub.pos[1];
        }

        /** “Roll” the is rotation around the front-back (longitudinal) axis.
         * 
         * @returns {integer} roll angle
         */
        motion_sensor.get_roll_angle = function get_roll_angle() {
            return hub.pos[2];
        }

        /** Gets the acceleration of the SPIKE's yaw axis
         * 
         * @returns {integer} acceleration
         */
        motion_sensor.get_yaw_acceleration = function get_yaw_acceleration() {
            return hub.pos[2];
        }

        /**  Gets the acceleration of the SPIKE's pitch axis
         * 
         * @returns {integer} acceleration
         */
        motion_sensor.get_pitch_acceleration = function get_pitch_acceleration() {
            return hub.pos[1];
        }

        /** Gets the acceleration of the SPIKE's roll axis
         * 
         * @returns {integer} acceleration
         */
        motion_sensor.get_roll_acceleration = function get_roll_acceleration() {
            return hub.pos[0];
        }

        /** Retrieves the most recently detected gesture.
         * 
         * @returns {string} the name of gesture
         */
        motion_sensor.get_gesture = function get_gesture() {
            return hubGesture;
        }

        /** Retrieves the most recently detected orientation
         * Note: Hub does not detect orientation of when it was connected
         * 
         * @returns {string} the name of orientation
         */
        motion_sensor.get_orientation = function get_orientation() {
            return lastHubOrientation;
        }

        return {
            motion_sensor: motion_sensor,
            light_matrix: light_matrix,
            left_button: left_button,
            right_button: right_button,
            speaker: speaker
        }
    }

    /** Motor
     * @class
     * @param {string} Port
     * @memberof Service_SPIKE
     * @returns {functions}
     */
    Motor = function (port) {

        var motor = ports[port]; // get the motor info by port

        // default settings
        var defaultSpeed = 100;
        var stopMethod = false; // stop method doesnt seem to work in this current ujsonrpc config
        var stallSetting = true;

        // check if device is a motor
        if (motor.device != "smallMotor" && motor.device != "bigMotor") {
            throw new Error("No motor detected at port " + port);
        }

        /** Get current speed of the motor
         *  
         * @returns {number} speed of motor [-100 to 100]
         */
        function get_speed() {
            var motor = ports[port]; // get the motor info by port
            var motorInfo = motor.data;
            return motorInfo.speed;

        }

        /** Get current position of the motor
         * 
         * @returns {number} position of motor [0 to 359]
         */
        function get_position() {
            var motor = ports[port]; // get the motor info by port
            var motorInfo = motor.data;
            return motorInfo.angle;
        }

        /** Get current degrees counted of the motor
         * 
         * @returns {number} counted degrees of the motor [any number]
         */
        function get_degrees_counted() {
            var motor = ports[port]; // get the motor info by port
            var motorInfo = motor.data;
            return motorInfo.uAngle;
        }

        /** Get the power of the motor
         * 
         * @returns {number} motor power
         */
        function get_power() {
            var motor = ports[port]; // get the motor info by port
            var motorInfo = motor.data;
            return motorInfo.power;
        }

        /** Get the default speed of this motor
         * 
         * @returns {number} motor default speed [-100 to 100]
         */
        function get_default_speed() {
            return defaultSpeed;
        }

        /** Set the default speed for this motor
         * 
         * @param {number} speed [-100 to 100]
         */
        function set_default_speed(speed) {
            if (typeof speed == "number") {
                defaultSpeed = speed;
            }
        }

        /** Turns stall detection on or off.
         * Stall detection senses when a motor has been blocked and can’t move.
         * If stall detection has been enabled and a motor is blocked, the motor will be powered off
         * after two seconds and the current motor command will be interrupted. If stall detection has been
         * disabled, the motor will keep trying to run and programs will “get stuck” until the motor is no
         * longer blocked.
         * @param {boolean} boolean - true if to detect stall, false otherwise
         */
        function set_stall_detection(boolean) {
            if (typeof boolean == "boolean") {
                stallSetting = boolean;
            }
        }

        /** Runs the motor to an absolute position.
         * 
         * @param {integer} degrees [0 to 359]
         * @param {integer} speed [-100 to 100]
         * @param {function} [callback==undefined] Parameters:"stalled" or "done"
         */
        function run_to_position(degrees, speed, callback = undefined) {
            if (speed !== undefined && typeof speed == "number") {
                UJSONRPC.motorGoRelPos(port, degrees, speed, stallSetting, stopMethod, callback);
            }
            else {
                UJSONRPC.motorGoRelPos(port, degrees, defaultSpeed, stallSetting, stopMethod, callback);
            }
        }

        /** Start the motor at some power
         * 
         * @param {integer} power [-100 to 100]
         */
        function start_at_power(power) {
            UJSONRPC.motorPwm(port, power, stallSetting);
        }


        /** Start the motor at some speed
         * 
         * @param {integer} speed [-100 to 100]
         */
        function start(speed = defaultSpeed) {
            // if (speed !== undefined && typeof speed == "number") {
            // UJSONRPC.motorStart (port, speed, stallSetting);
            // }
            // else {
            // UJSONRPC.motorStart(port, defaultSpeed, stallSetting);
            // }

            UJSONRPC.motorStart(port, speed, stallSetting);
        }

        /** Run the motor for some seconds
         * 
         * @param {integer} seconds 
         * @param {integer} speed [-100 to 100]
         * @param {function} [callback==undefined] Parameters:"stalled" or "done"
         */
        function run_for_seconds(seconds, speed, callback = undefined) {
            if (speed !== undefined && typeof speed == "number") {
                UJSONRPC.motorRunTimed(port, seconds, speed, stallSetting, stopMethod, callback)
            }
            else {
                UJSONRPC.motorRunTimed(port, seconds, defaultSpeed, stallSetting, stopMethod, callback)
            }
        }

        /** Run the motor for some degrees
         * 
         * @param {integer} degrees 
         * @param {integer} speed [-100 to 100]
         * @param {function} [callback==undefined] Parameters:"stalled" or "done"
         */
        function run_for_degrees(degrees, speed, callback = undefined) {
            if (speed !== undefined && typeof speed == "number") {
                UJSONRPC.motorRunDegrees(port, degrees, speed, stallSetting, stopMethod, callback);
            }
            else {
                UJSONRPC.motorRunDegrees(port, degrees, defaultSpeed, stallSetting, stopMethod, callback);
            }
        }

        /** Stop the motor
         * 
         */
        function stop() {
            UJSONRPC.motorPwm(port, 0, stallSetting);
        }

        return {
            run_to_position: run_to_position,
            start_at_power: start_at_power,
            start: start,
            stop: stop,
            run_for_degrees: run_for_degrees,
            run_for_seconds: run_for_seconds,
            set_default_speed: set_default_speed,
            set_stall_detection: set_stall_detection,
            get_power: get_power,
            get_degrees_counted: get_degrees_counted,
            get_position: get_position,
            get_speed: get_speed,
            get_default_speed: get_default_speed
        }
    }

    /** ColorSensor
     * @class
     * @param {string} Port
     * @memberof Service_SPIKE
     * @returns {functions}
     */
    ColorSensor = function (port) {
        var waitForNewColorFirst = false;

        var colorsensor = ports[port]; // get the color sensor info by port
        var colorsensorData = colorsensor.data;

        // check if device is a color sensor
        if (colorsensor.device != "color") {
            throw new Error("No Color Sensor detected at port " + port);
        }

        /** Get the name of the detected color
         * @returns {string} 'black','violet','blue','cyan','green','yellow','red','white',None
         */
        function get_color() {
            var colorsensor = ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            var color = colorsensorData.color;

            return color;
        }

        /** Retrieves the intensity of the ambient light.
         * @ignore
         * @returns {number} The ambient light intensity. [0 to 100]
         */
        function get_ambient_light() {
            var colorsensor = ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            return colorsensorData.Cambient;
        }

        /** Retrieves the intensity of the reflected light.
         * 
         * @returns {number} The reflected light intensity. [0 to 100]
         */
        function get_reflected_light() {
            var colorsensor = ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            return colorsensorData.Creflected;
        }

        /** Retrieves the red, green, blue, and overall color intensity.
         * @todo Implement overall intensity
         * @ignore
         * @returns {(number|Array)} Red, green, blue, and overall intensity (0-1024)
         */
        function get_rgb_intensity() {
            var colorsensor = ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            var toReturn = [];
            toReturn.push(colorsensorData.Cr);
            toReturn.push(colorsensorData.Cg);
            toReturn.push(colorsensorData.Cb)
            toReturn.push("TODO: unimplemented");;
        }

        /** Retrieves the red color intensity.
         * 
        * @returns {number} [0 to 1024]
         */
        function get_red() {
            var colorsensor = ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            return colorsensorData.RGB[0];
        }

        /** Retrieves the green color intensity.
         * 
         * @returns {number} [0 to 1024]
         */
        function get_green() {
            var colorsensor = ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            return colorsensorData.RGB[1];
        }

        /** Retrieves the blue color intensity.
         * 
         * @returns {number} [0 to 1024]
         */
        function get_blue() {
            var colorsensor = ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            return colorsensorData.RGB[2];
        }


        /** Waits until the Color Sensor detects the specified color.
         * @ignore
         * @todo Implement this function
         */
        function wait_until_color(color) {
            var color = get_color();
            console.log(color);
        }


        /** Execute callback when Color Sensor detects a new color.
         * The first time this method is called, it returns immediately the detected color. 
         * After that, it waits until the Color Sensor detects a color that is different from the color that
         * was detected the last time this method was used.
         * @ignore
         * @todo Implement this function
         * @param {function(string)} callback  
         */
        function wait_for_new_color(callback) {

            // check if this method has been executed after start of program
            if (waitForNewColorFirst) {
                waitForNewColorFirst = true;

                var currentColor = get_color();
                callback(currentColor)
            }
            funcAfterNewColor = callback;
        }

        return {
            get_color: get_color,
            get_ambient_light: get_ambient_light,
            get_reflected_light: get_reflected_light,
            get_rgb_intensity: get_rgb_intensity,
            get_red: get_red,
            get_green: get_green,
            get_blue: get_blue
        }

    }

    /** DistanceSensor
     * @class
     * @param {string} Port
     * @memberof Service_SPIKE
     * @returns {functions}
     */
    DistanceSensor = function (port) {

        var distanceSensor = ports[port] // get the distance sensor info by port
        var distanceSensorData = distanceSensor.data;

        // check if device is a distance sensor
        if (distanceSensor.device != "ultrasonic") {
            throw new Error("No Distance Sensor detected at port " + port);
        }

        /** Retrieves the measured distance in centimeters.
         * @param {boolean} short_range Whether to use or not the short range mode.
         * @returns {number} [0 to 200]
         * @todo find the short_range handling ujsonrpc script
         */
        function get_distance_cm(short_range) {
            var distanceSensor = ports[port] // get the distance sensor info by port
            var distanceSensorData = distanceSensor.data;

            return distanceSensorData.distance;
        }

        /** Retrieves the measured distance in inches.
         * 
         * @param {boolean} short_range Whether to use or not the short range mode.
         * @returns {number} [0 to 79]
         * @todo find the short_range handling ujsonrpc script
         */
        function get_distance_inches(short_range) {
            var distanceSensor = ports[port] // get the distance sensor info by port
            var distanceSensorData = distanceSensor.data;

            var inches = distanceSensorData.distance * 0.393701;
            return inches;
        }

        /** Retrieves the measured distance in percent.
         * 
         * @param {boolean} short_range Whether to use or not the short range mode.
         * @returns {number/string} [0 to 100] or 'none' if can't read distance
         * @todo find the short_range handling ujsonrpc script
         */
        function get_distance_percentage(short_range) {
            var distanceSensor = ports[port] // get the distance sensor info by port
            var distanceSensorData = distanceSensor.data;

            if (distanceSensorData.distance == null) {
                return "none"
            }
            var percentage = distanceSensorData.distance / 200;
            return percentage;
        }

        /** Waits until the measured distance is greater than distance.
         * 
         * @param {integer} distance 
         * @param {string} unit 'cm','in','%'
         * @param {integer} short_range 
         * @todo Implement this function
         */
        function wait_for_distance_farther_than(distance, unit, short_range) {

        }

        /** xWaits until the measured distance is less than distance.
         * 
         * @param {any} distance 
         * @param {any} unit 'cm','in','%'
         * @param {any} short_range 
         * @todo Implement this function
         */
        function wait_for_distance_closer_than(distance, unit, short_range) {

        }

        return {
            get_distance_cm: get_distance_cm,
            get_distance_inches: get_distance_inches,
            get_distance_percentage: get_distance_percentage
        }

    }

    /** ForceSensor
     * @class
     * @param {string} Port
     * @memberof Service_SPIKE
     * @returns {functions}
     */
    ForceSensor = function (port) {

        var sensor = ports[port]; // get the force sensor info by port

        if (sensor.device != "force") {
            throw new Error("No Force Sensor detected at port " + port);
        }

        /** Tests whether the button on the sensor is pressed.
         * 
         * @returns {boolean} true if force sensor is pressed, false otherwise
         */
        function is_pressed() {
            var sensor = ports[port]; // get the force sensor info by port
            var ForceSensorData = sensor.data;

            return ForceSensorData.pressed;
        }

        /** Retrieves the measured force, in newtons.
         * 
         * @returns {number}  Force in newtons [0 to 10]
         */
        function get_force_newton() {
            var sensor = ports[port]; // get the force sensor info by port
            var ForceSensorData = sensor.data;

            return ForceSensorData.force;
        }

        /** Retrieves the measured force as a percentage of the maximum force.
         * 
         * @returns {number} percentage [0 to 100]
         */
        function get_force_percentage() {
            var sensor = ports[port]; // get the force sensor info by port
            var ForceSensorData = sensor.data;

            var denominator = 704 - 384 // highest detected - lowest detected forceSensitive values
            var numerator = ForceSensorData.forceSensitive - 384 // 384 is the forceSensitive value when not pressed
            var percentage = Math.round((numerator / denominator) * 100);
            return percentage;
        }

        /** Executes callback when Force Sensor is pressed
         * The function is executed in updateHubPortsInfo()'s Force Sensor part
         * 
         * @param {function} callback 
         */
        function wait_until_pressed(callback) {
            funcAfterForceSensorPress = callback;
        }

        /** Executes callback when Force Sensor is released
         * The function is executed in updateHubPortsInfo()'s Force Sensor part
         * @param {function} callback 
         */
        function wait_until_released(callback) {
            funcAfterForceSensorRelease = callback;
        }

        return {
            is_pressed: is_pressed,
            get_force_newton: get_force_newton,
            get_force_percentage: get_force_percentage,
            wait_until_pressed: wait_until_pressed,
            wait_until_released: wait_until_released
        }

    }

    /** MotorPair
     * @class
     * @param {string} leftPort
     * @param {string} rightPort
     * @memberof Service_SPIKE
     * @returns {functions}
     * @todo implement the rest (what is differential (tank) steering? )
     */
    MotorPair = function (leftPort, rightPort) {
        // settings 
        var defaultSpeed = 100;

        var leftMotor = ports[leftPort];
        var rightMotor = ports[rightPort];

        var DistanceTravelToRevolutionRatio = 17.6;

        // check if device is a motor
        if (leftMotor.device != "smallMotor" && leftMotor.device != "bigMotor") {
            throw new Error("No motor detected at port " + port);
        }
        if (rightMotor.device != "smallMotor" && rightMotor.device != "bigMotor") {
            throw new Error("No motor detected at port " + port);
        }

        /** Sets the ratio of one motor rotation to the distance traveled.
         * 
         * If there are no gears used between the motors and the wheels of the Driving Base, 
         * then amount is the circumference of one wheel.
         * 
         * Calling this method does not affect the Driving Base if it is already currently running. 
         * It will only have an effect the next time one of the move or start methods is used.
         * 
         * @param {number} amount 
         * @param {string} unit 'cm','in'
         */
        function set_motor_rotation(amount, unit) {

            // assume unit is 'cm' when undefined
            if (unit == "cm" || unit !== undefined) {
                DistanceTravelToRevolutionRatio = amount;
            }
            else if (unit == "in") {
                // convert to cm
                DistanceTravelToRevolutionRatio = amount * 2.54;
            }
        }

        /** Starts moving the Driving Base
         * 
         * @param {integer} left_speed [-100 to 100]
         * @param {integer} right_speed [-100 to 100]
         */
        function start_tank(left_speed, right_speed) {
            UJSONRPC.moveTankSpeeds(left_speed, right_speed, leftPort, rightPort);
        }

        // /** Starts moving the Driving Base without speed control.
        //  * 
        //  * @param {any} power 
        //  * @param {any} steering 
        //  * @todo Implement this function
        //  */
        // function start_at_power (power, steering) {

        // }

        /** Starts moving the Driving Base
         * 
         * @param {integer} leftPower 
         * @param {integer} rightPower  
         */
        function start_tank_at_power(leftPower, rightPower) {
            UJSONRPC.moveTankPowers(leftPower, rightPower, leftPort, rightPort);
        }

        /** Stops the 2 motors simultaneously, which will stop a Driving Base.
         * 
         */
        function stop() {
            UJSONRPC.moveTankPowers(0, 0, leftPort, rightPort);
        }

        return {
            stop: stop,
            set_motor_rotation: set_motor_rotation,
            start_tank: start_tank,
            start_tank_at_power: start_tank_at_power
        }

    }

    //////////////////////////////////////////
    //                                      //
    //          UJSONRPC Functions          //
    //                                      //
    //////////////////////////////////////////

    /** Low Level UJSONRPC Commands
     * @ignore
     * @namespace UJSONRPC
     */
    var UJSONRPC = {};

    /**
     * 
     * @memberof! UJSONRPC
     * @param {string} text 
     */
    UJSONRPC.displayText = async function displayText(text) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.display_text", "p": {"text":' + '"' + text + '"' + '} }'
        sendDATA(command);
    }

    /**
     * @memberof! UJSONRPC
     * @param {integer} x [0 to 4]
     * @param {integer} y [0 to 4]
     * @param {integer} brightness [1 to 100]
     */
    UJSONRPC.displaySetPixel = async function displaySetPixel(x, y, brightness) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.display_set_pixel", "p": {"x":' + x +
            ', "y":' + y + ', "brightness":' + brightness + '} }';
        sendDATA(command);
    }

    /**
     * @memberof! UJSONRPC
     */
    UJSONRPC.displayClear = async function displayClear() {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.display_clear" }';
        sendDATA(command);
    }

    /**
     * @memberof! UJSONRPC
     * @param {string} port 
     * @param {integer} speed 
     * @param {integer} stall 
     */
    UJSONRPC.motorStart = async function motorStart(port, speed, stall) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.motor_start", "p": {"port":'
            + '"' + port + '"' +
            ', "speed":' + speed +
            ', "stall":' + stall +
            '} }';
        sendDATA(command);
    }

    /** moves motor to a position
     * 
     * @memberof! UJSONRPC
     * @param {string} port 
     * @param {integer} position 
     * @param {integer} speed 
     * @param {boolean} stall 
     * @param {boolean} stop 
     * @param {function} callback
     */
    UJSONRPC.motorGoRelPos = async function motorGoRelPos(port, position, speed, stall, stop, callback) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.motor_go_to_relative_position"' +
            ', "p": {' +
            '"port":' + '"' + port + '"' +
            ', "position":' + position +
            ', "speed":' + speed +
            ', "stall":' + stall +
            ', "stop":' + stop +
            '} }';
        if (callback != undefined) {
            pushResponseCallback(randomId, callback);
        }
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {string} port 
     * @param {integer} time 
     * @param {integer} speed 
     * @param {integer} stall 
     * @param {boolean} stop
     * @param {function} callback
     */
    UJSONRPC.motorRunTimed = async function motorRunTimed(port, time, speed, stall, stop, callback) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.motor_run_timed"' +
            ', "p": {' +
            '"port":' + '"' + port + '"' +
            ', "time":' + time +
            ', "speed":' + speed +
            ', "stall":' + stall +
            ', "stop":' + stop +
            '} }';
        if (callback != undefined) {
            pushResponseCallback(randomId, callback);
        }
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {string} port 
     * @param {integer} degrees 
     * @param {integer} speed 
     * @param {integer} stall 
     * @param {boolean} stop
     * @param {function} callback
     */
    UJSONRPC.motorRunDegrees = async function motorRunDegrees(port, degrees, speed, stall, stop, callback) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.motor_run_for_degrees"' +
            ', "p": {' +
            '"port":' + '"' + port + '"' +
            ', "degrees":' + degrees +
            ', "speed":' + speed +
            ', "stall":' + stall +
            ', "stop":' + stop +
            '} }';
        if ( callback != undefined ) {
            pushResponseCallback(randomId, callback);
        }
        sendDATA(command);
    }

    /**
     * @memberof! UJSONRPC
     * @param {integer} time 
     * @param {integer} lspeed 
     * @param {integer} rspeed 
     * @param {string} lmotor 
     * @param {string} rmotor 
     * @param {boolean} stop
     * @param {function} callback
     */
    UJSONRPC.moveTankTime = async function moveTankTime(time, lspeed, rspeed, lmotor, rmotor, stop, callback) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.move_tank_time"' +
            ', "p": {' +
            '"time":' + time +
            ', "lspeed":' + lspeed +
            ', "rspeed":' + rspeed +
            ', "lmotor":' + '"' + lmotor + '"' +
            ', "rmotor":' + '"' + rmotor + '"' +
            ', "stop":' + stop +
            '} }';
        if (callback != undefined) {
            pushResponseCallback(randomId, callback);
        }
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {integer} degrees 
     * @param {integer} lspeed 
     * @param {integer} rspeed 
     * @param {string} lmotor 
     * @param {string} rmotor 
     * @param {boolean} stop
     * @param {function} callback
     */
    UJSONRPC.moveTankDegrees = async function moveTankDegrees(degrees, lspeed, rspeed, lmotor, rmotor, stop, callback) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.move_tank_degrees"' +
            ', "p": {' +
            '"degrees":' + degrees +
            ', "lspeed":' + lspeed +
            ', "rspeed":' + rspeed +
            ', "lmotor":' + '"' + lmotor + '"' +
            ', "rmotor":' + '"' + rmotor + '"' +
            ', "stop":' + stop +
            '} }';
        if (callback != undefined) {
            pushResponseCallback(randomId, callback);
        }
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {integer} lspeed 
     * @param {integer} rspeed 
     * @param {string} lmotor 
     * @param {string} rmotor 
     * @param {function} callback
     */
    UJSONRPC.moveTankSpeeds = async function moveTankSpeeds(lspeed, rspeed, lmotor, rmotor, callback) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.move_start_speeds"' +
            ', "p": {' +
            '"lspeed":' + lspeed +
            ', "rspeed":' + rspeed +
            ', "lmotor":' + '"' + lmotor + '"' +
            ', "rmotor":' + '"' + rmotor + '"' +
            '} }';
        if (callback != undefined) {
            pushResponseCallback(randomId, callback);
        }
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {integer} lpower 
     * @param {integer} rpower 
     * @param {string} lmotor 
     * @param {string} rmotor 
     * @param {function} callback
     */
    UJSONRPC.moveTankPowers = async function moveTankPowers(lpower, rpower, lmotor, rmotor, callback) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.move_start_powers"' +
            ', "p": {' +
            '"lpower":' + lpower +
            ', "rpower":' + rpower +
            ', "lmotor":' + '"' + lmotor + '"' +
            ', "rmotor":' + '"' + rmotor + '"' +
            '} }';
        if (callback != undefined) {
            pushResponseCallback(randomId, callback);
        }
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {integer} volume 
     * @param {integer} note 
     */
    UJSONRPC.soundBeep = async function soundBeep(volume, note) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.sound_beep"' +
            ', "p": {' +
            '"volume":' + volume +
            ', "note":' + note +
            '} }';
        sendDATA(command);
    }

    /**
     * @memberof! UJSONRPC
     */
    UJSONRPC.soundStop = async function soundStop() {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.sound_off"' +
            '}';
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {string} port 
     * @param {integer} power 
     * @param {integer} stall 
     */
    UJSONRPC.motorPwm = async function motorPwm(port, power, stall) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.motor_pwm", "p": {"port":' + '"' + port + '"' +
            ', "power":' + power + ', "stall":' + stall + '} }';
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {function} callback
     */
    UJSONRPC.getFirmwareInfo = async function getFirmwareInfo(callback) {
        var randomId = generateId();

        var command = '{"i":' + '"' + randomId + '"' + ', "m": "get_hub_info" ' + '}';
        sendDATA(command);
        if (callback != undefined) {
            getFirmwareInfoCallback = [randomId, callback];
        }
    }

    /**
     * @memberof! UJSONRPC
     * @param {function} callback 
     */
    UJSONRPC.triggerCurrentState = async function triggerCurrentState(callback) {
        var randomId = generateId();

        var command = '{"i":' + '"' + randomId + '"' + ', "m": "trigger_current_state" ' + '}';
        sendDATA(command);
        if (callback != undefined) {
            triggerCurrentStateCallback = callback;
        }
    }

    /** 
     * 
     * @memberof! UJSONRPC
     * @param {integer} slotid 
     */
    UJSONRPC.programExecute = async function programExecute(slotid) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' + ', "m": "program_execute", "p": {"slotid":' + slotid + '} }';
        sendDATA(command);
    }

    /**
     * @memberof! UJSONRPC
     */
    UJSONRPC.programTerminate = function programTerminate() {

        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "program_terminate"' +
            '}';

        sendDATA(command);
    }

    /**
     * @memberof! UJSONRPC
     * @param {string} projectName name of the project
     * @param {integer} type type of data (micropy or scratch)
     * @param {string} data entire data to send in ASCII
     * @param {integer} slotid slot to which to assign the program
     */
    UJSONRPC.startWriteProgram = async function startWriteProgram(projectName, type, data, slotid) {

        console.log("%cTuftsCEEO ", "color: #3ba336;", "in startWriteProgram...");
        console.log("%cTuftsCEEO ", "color: #3ba336;", "constructing start_write_program script...");

        if (type == "python") {
            var typeInt = 0;
        }

        // construct the UJSONRPC packet to start writing program

        var dataSize = (new TextEncoder().encode(data)).length;

        var randomId = generateId();

        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "start_write_program", "p": {' +
            '"meta": {' +
            '"created": ' + parseInt(Date.now()) +
            ', "modified": ' + parseInt(Date.now()) +
            ', "name": ' + '"' + btoa(projectName) + '"' +
            ', "type": ' + typeInt +
            ', "project_id":' + Math.floor(Math.random() * 1000) +
            '}' +
            ', "fname": ' + '"' + projectName + '"' +
            ', "size": ' + dataSize +
            ', "slotid": ' + slotid +
            '} }';

        console.log("%cTuftsCEEO ", "color: #3ba336;", "constructed start_write_program script...");

        // assign function to start sending packets after confirming blocksize and transferid
        startWriteProgramCallback = [randomId, writePackageFunc];

        console.log("%cTuftsCEEO ", "color: #3ba336;", "sending start_write_program script");

        sendDATA(command);

        // check if start_write_program received a response after 5 seconds
        writeProgramSetTimeout = setTimeout(function () {
            if (startWriteProgramCallback != undefined) {
                if (funcAfterError != undefined) {
                    funcAfterError("5 seconds have passed without response... Please reboot the hub and try again.")
                }
            }
        }, 5000)

        // function to write the first packet of data
        function writePackageFunc(blocksize, transferid) {

            console.log("%cTuftsCEEO ", "color: #3ba336;", "in writePackageFunc...");

            console.log("%cTuftsCEEO ", "color: #3ba336;", "stringified the entire data to send: ", data);

            // when data's length is less than the blocksize limit of sending data
            if (data.length <= blocksize) {
                console.log("%cTuftsCEEO ", "color: #3ba336;", "data's length is less than the blocksize of ", blocksize);

                // if the data's length is not zero (not empty)
                if (data.length != 0) {

                    var dataToSend = data.substring(0, data.length); // get the entirety of data

                    console.log("%cTuftsCEEO ", "color: #3ba336;", "data's length is not zero, sending the entire data: ", dataToSend);

                    var base64data = btoa(dataToSend); // encode the packet to base64

                    UJSONRPC.writePackage(base64data, transferid); // send the packet

                    // writeProgram's callback defined by the user
                    if (writeProgramCallback != undefined) {
                        writeProgramCallback();
                    }

                }
                // the package to send is empty, so throw error
                else {
                    throw new Error("package to send is initially empty");
                }

            }
            // if the length of data to send is larger than the blocksize, send only a blocksize amount
            // and save the remaining data to send packet by packet
            else if (data.length > blocksize) {

                console.log("%cTuftsCEEO ", "color: #3ba336;", "data's length is more than the blocksize of ", blocksize);

                var dataToSend = data.substring(0, blocksize); // get the first block of packet

                console.log("%cTuftsCEEO ", "color: #3ba336;", "sending the blocksize amount of data: ", dataToSend);

                var base64data = btoa(dataToSend); // encode the packet to base64

                var msgID = UJSONRPC.writePackage(base64data, transferid); // send the packet

                var remainingData = data.substring(blocksize, data.length); // remove the portion just sent from data

                console.log("%cTuftsCEEO ", "color: #3ba336;", "reassigning writePackageInformation with message ID: ", msgID);
                console.log("%cTuftsCEEO ", "color: #3ba336;", "reassigning writePackageInformation with remainingData: ", remainingData);

                // update package information to be used for sending remaining packets
                writePackageInformation = [msgID, remainingData, transferid, blocksize];

            }

        }

    }



    /**
     * 
     * @memberof! UJSONRPC
     * @param {string} base64data base64 encoded data to send
     * @param {string} transferid transferid of this program write process
     * @returns {string} the randomly generated message id used to send this UJSONRPC script
     */
    UJSONRPC.writePackage = function writePackage(base64data, transferid) {

        var randomId = generateId();
        var writePackageCommand = '{"i":' + '"' + randomId + '"' +
            ', "m": "write_package", "p": {' +
            '"data": ' + '"' + base64data + '"' +
            ', "transferid": ' + '"' + transferid + '"' +
            '} }';

        sendDATA(writePackageCommand);

        return randomId;

    }

    /**
     * @memberof! UJSONRPC
     */
    UJSONRPC.getStorageStatus = function getStorageStatus() {

        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "get_storage_status"' +
            '}';

        sendDATA(command);

    }

    /**
     * @memberof! UJSONRPC
     * @param {string} slotid 
     */
    UJSONRPC.removeProject = function removeProject(slotid) {

        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "remove_project", "p": {' +
            '"slotid": ' + slotid +
            '} }';

        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {string} oldslotid 
     * @param {string} newslotid 
     */
    UJSONRPC.moveProject = function moveProject(oldslotid, newslotid) {

        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "move_project", "p": {' +
            '"old_slotid": ' + oldslotid +
            ', "new_slotid: ' + newslotid +
            '} }';

        sendDATA(command);

    }


    //////////////////////////////////////////
    //                                      //
    //          Private Functions           //
    //                                      //
    //////////////////////////////////////////
    
    /**
    * @private
    * @param {function} callback 
    */
    async function triggerCurrentState(callback) {

        UJSONRPC.triggerCurrentState(callback);
    }

    /** 
     * 
     * @private
     * @param {string} id 
     * @param {string} funcName 
     */
    function pushResponseCallback(id, funcName) {

        var toPush = []; // [ ujson string id, function pointer ]

        toPush.push(id);
        toPush.push(funcName);

        // responseCallbacks has elements in it
        if (responseCallbacks.length > 0) {

            var emptyFound = false; // empty index was found flag

            // insert the pointer to the function where index is empty
            for (var index in responseCallbacks) {
                if (responseCallbacks[index] == undefined) {
                    responseCallbacks[index] = toPush;
                    emptyFound = true;
                }
            }

            // if all indices were full, push to the back
            if (!emptyFound) {
                responseCallbacks.push(toPush);
            }

        }
        // responseCallbacks current has no elements in it
        else {
            responseCallbacks.push(toPush);
        }

    }

    /**  Sleep function
     * @private
     * @param {number} ms Miliseconds to sleep
     * @returns {Promise} 
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**  generate random id for UJSONRPC messages
     * @private
     * @returns {string}
     */
    function generateId() {
        var generatedID = ""
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 4; i++) {
            var randomIndex = Math.floor(Math.random() * characters.length);
            generatedID = generatedID + characters[randomIndex];
        }

        return generatedID;
    }

    /**  Prompt user to select web serial port and make connection to SPIKE Prime
     * <p> Effect Makes prompt in Google Chrome ( Google Chrome Browser needs "Experimental Web Interface" enabled) </p>
     * <p> Note: </p>
     * <p> This function is to be executed before reading in JSON RPC streams from the hub </p>
     * <p> This function needs to be called when system is handling a user gesture (like button click) </p>
     * @private
     * @returns {boolean} True if web serial initialization is successful, false otherwise
     */
    async function initWebSerial() {
        try {
            var success = false;

            port = await navigator.serial.getPorts();
            console.log("%cTuftsCEEO ", "color: #3ba336;", "ports:", port);
            // select device
            port = await navigator.serial.requestPort({
                // filters:[filter]
            });
            // wait for the port to open.
            try {
                await port.open({ baudRate: 115200 });
            }
            catch (er) {
                console.log("%cTuftsCEEO ", "color: #3ba336;", er);
                // check if system requires baudRate syntax
                if (er.message.indexOf("baudrate") > -1) {
                    console.log("%cTuftsCEEO ", "color: #3ba336;", "baudRate needs to be baudrate");
                    await port.open({ baudrate: 115200 });
                }
                // check if error is due to unsuccessful closing of previous port
                else if (er.message.indexOf("close") > -1) {
                    if (funcAfterError != undefined) {
                        funcAfterError(er + "\nPlease try again. If error persists, refresh this environment.");
                    }
                    await port.close();
                } else {
                    if (funcAfterError != undefined) {
                        funcAfterError(er + "\nPlease try again. If error persists, refresh this environment.");
                    }
                }
                await port.close();
            }

            if (port.readable) {
                success = true;
            }
            else {
                success = false;
            }

            return success;


        } catch (e) {
            console.log("%cTuftsCEEO ", "color: #3ba336;", "Cannot read port:", e);
            if (funcAfterError != undefined) {
                funcAfterError(e);
            }
            return false;
        }
    }

    /**  Initialize writer object before sending commands
     * @private
     * 
     */
    function setupWriter() {
        // if writer not yet defined:
        if (typeof writer === 'undefined') {
            // set up writer for the first time
            const encoder = new TextEncoderStream();
            writableStreamClosed = encoder.readable.pipeTo(port.writable);
            writer = encoder.writable.getWriter();
        }
    }

    /** clean the json_string for concatenation into jsonline
     * @private
     * 
     * @param {any} json_string 
     * @returns {string}
     */
    function cleanJsonString(json_string) {
        var cleanedJsonString = "";
        json_string = json_string.trim();

        let findEscapedQuotes = /\\"/g;

        cleanedJsonString = json_string.replace(findEscapedQuotes, '"');
        cleanedJsonString = cleanedJsonString.substring(1, cleanedJsonString.length - 1);
        // cleanedJsonString = cleanedJsonString.replace(findNewLines,'');

        return cleanedJsonString;
    }

    /** Process the UJSON RPC script
     * 
     * @private
     * @param {any} lastUJSONRPC 
     * @param {string} [json_string="undefined"] 
     * @param {boolean} [testing=false] 
     * @param {any} callback 
     */
    async function processFullUJSONRPC(lastUJSONRPC, json_string = "undefined", testing = false, callback) {
        try {

            var parseTest = await JSON.parse(lastUJSONRPC)

            if (testing) {
                console.log("%cTuftsCEEO ", "color: #3ba336;", "processing FullUJSONRPC line: ", lastUJSONRPC);
            }

            // update hub information using lastUJSONRPC
            if (parseTest["m"] == 0) {
                updateHubPortsInfo();
            }
            PrimeHubEventHandler();

            if (funcWithStream) {
                await funcWithStream();
            }

        }
        catch (e) {
            // don't throw error when failure of processing UJSONRPC is due to micropython
            if (lastUJSONRPC.indexOf("Traceback") == -1 && lastUJSONRPC.indexOf(">>>") == -1 && json_string.indexOf("Traceback") == -1 && json_string.indexOf(">>>") == -1) {
                if (funcAfterError != undefined) {
                    funcAfterError("Fatal Error: Please close any other window or program that is connected to your SPIKE Prime");
                }
            }
            console.log(e);
            console.log("%cTuftsCEEO ", "color: #3ba336;", "error parsing lastUJSONRPC: ", lastUJSONRPC);
            console.log("%cTuftsCEEO ", "color: #3ba336;", "current jsonline: ", jsonline);
            console.log("%cTuftsCEEO ", "color: #3ba336;", "current cleaned json_string: ", cleanedJsonString)
            console.log("%cTuftsCEEO ", "color: #3ba336;", "current json_string: ", json_string);
            console.log("%cTuftsCEEO ", "color: #3ba336;", "current value: ", value);

            if (callback != undefined) {
                callback();
            }

        }
    }

    /**  Process a packet in UJSONRPC
    * @private
    *
    */
    async function parsePacket(value, testing = false, callback) {

        // console.log("%cTuftsCEEO ", "color: #3ba336;", value);

        // stringify the packet to look for carriage return
        var json_string = await JSON.stringify(value);

        var cleanedJsonString = cleanJsonString(json_string);
        // cleanedJsonString = cleanedJsonString.replace(findNewLines,'');

        jsonline = jsonline + cleanedJsonString; // concatenate packet to data
        jsonline = jsonline.trim();

        // regex search for carriage return
        let pattern = /\\r/g;
        var carriageReIndex = jsonline.search(pattern);

        // there is at least one carriage return in this packet
        if (carriageReIndex > -1) {

            // the concatenated packets start with a left curly brace (start of JSON)
            if (jsonline[0] == "{") {

                lastUJSONRPC = jsonline.substring(0, carriageReIndex);

                // look for conjoined JSON packets: there's at least two carriage returns in jsonline
                if (jsonline.match(/\\r/g).length > 1) {

                    var conjoinedPacketsArray = jsonline.split(/\\r/); // array that split jsonline by \r

                    // last index only contains "" as it would be after \r
                    for (var i = 0; i < conjoinedPacketsArray.length ; i++) {

                        // for every JSON object in array except last, perform data handling
                        if ( i < conjoinedPacketsArray.length -1 ) {
                            lastUJSONRPC = conjoinedPacketsArray[i];

                            processFullUJSONRPC(lastUJSONRPC, json_string, testing, callback);
                        }
                        else {
                            jsonline = conjoinedPacketsArray[i];
                        }
                    }
                }
                // there are no conjoined packets in this jsonline
                else {
                    lastUJSONRPC = jsonline.substring(0, carriageReIndex);

                    processFullUJSONRPC(lastUJSONRPC, json_string, testing, callback);

                    jsonline = jsonline.substring(carriageReIndex + 2, jsonline.length);
                }

            }
            else {
                console.log("%cTuftsCEEO ", "color: #3ba336;", "jsonline needs reset: ", jsonline);

                jsonline = jsonline.substring(carriageReIndex + 2, jsonline.length);

                console.log("%cTuftsCEEO ", "color: #3ba336;", "jsonline was reset to:" + jsonline);

                // reset jsonline for next concatenation
                // jsonline = "";
            }
        }

    }


    /**  Continuously take UJSON RPC input from SPIKE Prime
     * @private
     */
    async function streamUJSONRPC() {
        try {
            var firstReading = true;
            // read when port is set up
            while (port.readable) {

                // initialize readers
                const decoder = new TextDecoderStream();
                const readableStreamClosed = port.readable.pipeTo(decoder.writable);
                reader = decoder.readable.getReader();

                // continuously get
                while (true) {
                    try {

                        if (firstReading) {
                            console.log("%cTuftsCEEO ", "color: #3ba336;", "##### READING FIRST UJSONRPC LINE ##### CHECKING VARIABLES");
                            console.log("%cTuftsCEEO ", "color: #3ba336;", "jsonline: ", jsonline);
                            console.log("%cTuftsCEEO ", "color: #3ba336;", "lastUJSONRPC: ", lastUJSONRPC);
                            firstReading = false;
                        }
                        // read UJSON RPC stream ( actual data in {value} )
                        ({ value, done } = await reader.read());

                        // log value
                        if (micropython_interpreter) {
                            console.log("%cTuftsCEEO ", "color: #3ba336;", value);
                        }

                        // console.log("%cTuftsCEEO ", "color: #3ba336;", value);

                        //concatenate UJSONRPC packets into complete JSON objects
                        if (value) {
                            parsePacket(value);
                        }
                        if (done) {
                            serviceActive = false;
                            // reader has been canceled.
                            console.log("%cTuftsCEEO ", "color: #3ba336;", "[readLoop] DONE", done);
                        }
                    }
                    // error handler
                    catch (error) {
                        console.log("%cTuftsCEEO ", "color: #3ba336;", '[readLoop] ERROR', error);

                        serviceActive = false;

                        if (funcAfterDisconnect != undefined) {
                            funcAfterDisconnect();
                        }

                        if (funcAfterError != undefined) {
                            funcAfterError("SPIKE Prime hub has been disconnected");
                        }

                        writer.close();
                        //await writer.releaseLock();
                        await writableStreamClosed;

                        reader.cancel();
                        //await reader.releaseLock();
                        await readableStreamClosed.catch(reason => { });

                        await port.close();

                        writer = undefined;
                        reader = undefined;
                        jsonline = "";
                        lastUJSONRPC = undefined;
                        json_string = undefined;
                        cleanedJsonString = undefined;

                        break; // stop trying to read
                    }
                } // end of: while (true) [reader loop]

                // release the lock
                reader.releaseLock();

            } // end of: while (port.readable) [checking if readable loop]
            console.log("%cTuftsCEEO ", "color: #3ba336;", "- port.readable is FALSE")
        } // end of: trying to open port
        catch (e) {
            serviceActive = false;
            // Permission to access a device was denied implicitly or explicitly by the user.
            console.log("%cTuftsCEEO ", "color: #3ba336;", 'ERROR trying to open:', e);
        }
    }

    /** Get the devices that are connected to each port on the SPIKE Prime
     * <p> Effect: </p>
     * <p> Modifies {ports} global variable </p>
     * <p> Modifies {hub} global variable </p>
     * @private
     */
    async function updateHubPortsInfo() {

        // if a complete ujson rpc line was read
        if (lastUJSONRPC) {
            var data_stream; //UJSON RPC info to be parsed

            //get a line from the latest JSON RPC stream and parse to devices info
            try {
                data_stream = await JSON.parse(lastUJSONRPC);
                data_stream = data_stream.p;
            }
            catch (e) {
                console.log("%cTuftsCEEO ", "color: #3ba336;", "error parsing lastUJSONRPC at updateHubPortsInfo", lastUJSONRPC);
                console.log("%cTuftsCEEO ", "color: #3ba336;", typeof lastUJSONRPC);
                console.log("%cTuftsCEEO ", "color: #3ba336;", lastUJSONRPC.p);

                if (funcAfterError != undefined) {
                    funcAfterError("Fatal Error: Please reboot the Hub and refresh this environment");
                }

            }

            var index_to_port = ["A", "B", "C", "D", "E", "F"]

            // iterate through each port and assign a device_type to {ports}
            for (var key = 0; key < 6; key++) {

                let device_value = { "device": "none", "data": {} }; // value to go in ports associated with the port letter keys

                try {
                    var letter = index_to_port[key]

                    // get SMALL MOTOR information
                    if (data_stream[key][0] == 48) {

                        // parse motor information
                        var Mspeed = await data_stream[key][1][0];
                        var Mangle = await data_stream[key][1][1];
                        var Muangle = await data_stream[key][1][2];
                        var Mpower = await data_stream[key][1][3];

                        // populate value object
                        device_value.device = "smallMotor";
                        device_value.data = { "speed": Mspeed, "angle": Mangle, "uAngle": Muangle, "power": Mpower };
                        ports[letter] = device_value;
                    }
                    // get BIG MOTOR information
                    else if (data_stream[key][0] == 49) {
                        // parse motor information
                        var Mspeed = await data_stream[key][1][0];
                        var Mangle = await data_stream[key][1][1];
                        var Muangle = await data_stream[key][1][2];
                        var Mpower = await data_stream[key][1][3];

                        // populate value object
                        device_value.device = "bigMotor";
                        device_value.data = { "speed": Mspeed, "angle": Mangle, "uAngle": Muangle, "power": Mpower };
                        ports[letter] = device_value;

                    }
                    // get ULTRASONIC sensor information
                    else if (data_stream[key][0] == 62) {

                        // parse ultrasonic sensor information
                        var Udist = await data_stream[key][1][0];

                        // populate value object
                        device_value.device = "ultrasonic";
                        device_value.data = { "distance": Udist };
                        ports[letter] = device_value;
                    }
                    // get FORCE sensor information
                    else if (data_stream[key][0] == 63) {

                        // parse force sensor information
                        var Famount = await data_stream[key][1][0];
                        var Fbinary = await data_stream[key][1][1];
                        var Fbigamount = await data_stream[key][1][2];

                        // convert the binary output to boolean for "pressed" key
                        if (Fbinary == 1) {
                            var Fboolean = true;
                        } else {
                            var Fboolean = false;
                        }
                        // execute callback from ForceSensor.wait_until_pressed() 
                        if (Fboolean) {
                            // execute call back from wait_until_pressed() if it is defined
                            funcAfterForceSensorPress !== undefined && funcAfterForceSensorPress();

                            // destruct callback function
                            funcAfterForceSensorPress = undefined;

                            // indicate that the ForceSensor was pressed
                            ForceSensorWasPressed = true;
                        }
                        // execute callback from ForceSensor.wait_until_released()
                        else {
                            // check if the Force Sensor was just released
                            if (ForceSensorWasPressed) {
                                ForceSensorWasPressed = false;
                                funcAfterForceSensorRelease !== undefined && funcAfterForceSensorRelease();
                                funcAfterForceSensorRelease = undefined;
                            }
                        }

                        // populate value object
                        device_value.device = "force";
                        device_value.data = { "force": Famount, "pressed": Fboolean, "forceSensitive": Fbigamount }
                        ports[letter] = device_value;
                    }
                    // get COLOR sensor information
                    else if (data_stream[key][0] == 61) {

                        // parse color sensor information
                        var Creflected = await data_stream[key][1][0];
                        var CcolorID = await data_stream[key][1][1];
                        var Ccolor = colorDictionary[CcolorID];
                        var Cr = await data_stream[key][1][2];
                        var Cg = await data_stream[key][1][3];
                        var Cb = await data_stream[key][1][4];
                        var rgb_array = [Cr, Cg, Cb];

                        // populate value object
                        device_value.device = "color";
                        device_value.data = { "reflected": Creflected, "color": Ccolor, "RGB": rgb_array };
                        ports[letter] = device_value;
                    }
                    /// NOTHING is connected
                    else if (data_stream[key][0] == 0) {
                        // populate value object
                        device_value.device = "none";
                        device_value.data = {};
                        ports[letter] = device_value;
                    }

                    //parse hub information
                    var gyro_x = data_stream[6][0];
                    var gyro_y = data_stream[6][1];
                    var gyro_z = data_stream[6][2];
                    var gyro = [gyro_x, gyro_y, gyro_z];
                    hub["gyro"] = gyro;

                    var newOri = setHubOrientation(gyro);
                    // see if currently detected orientation is different from the last detected orientation
                    if (newOri !== lastHubOrientation) {
                        lastHubOrientation = newOri;

                        typeof funcAfterNewOrientation == "function" && funcAfterNewOrientation(newOri);
                        funcAfterNewOrientation = undefined;
                    }

                    var accel_x = data_stream[7][0];
                    var accel_y = data_stream[7][1];
                    var accel_z = data_stream[7][2];
                    var accel = [accel_x, accel_y, accel_z];
                    hub["accel"] = accel;

                    var posi_x = data_stream[8][0];
                    var posi_y = data_stream[8][1];
                    var posi_z = data_stream[8][2];
                    var pos = [posi_x, posi_y, posi_z];
                    hub["pos"] = pos;

                } catch (e) { } //ignore errors
            }
        }
    }

    /**  Catch hub events in UJSONRPC
     * <p> Effect: </p>
     * <p> Logs in the console when some particular messages are caught </p>
     * <p> Assigns the hub events global variables </p>
     * @private
     */
    async function PrimeHubEventHandler() {

        var parsedUJSON = await JSON.parse(lastUJSONRPC);

        var messageType = parsedUJSON["m"];

        //catch runtime_error made at ujsonrpc level
        if (messageType == "runtime_error") {
            var decodedResponse = atob(parsedUJSON["p"][3]);

            decodedResponse = JSON.stringify(decodedResponse);

            console.log("%cTuftsCEEO ", "color: #3ba336;", decodedResponse);

            var splitData = decodedResponse.split(/\\n/); // split the code by every newline

            // execute function after print if defined (only print the last line of error message)
            if (funcAfterError != undefined) {
                var errorType = splitData[splitData.length - 2];

                // error is a syntax error
                if (errorType.indexOf("SyntaxError") > -1) {
                    /* get the error line number*/
                    var lineNumberLine = splitData[splitData.length - 3];
                    console.log("%cTuftsCEEO ", "color: #3ba336;", "lineNumberLine: ", lineNumberLine);
                    var indexLine = lineNumberLine.indexOf("line");
                    var lineNumberSubstring = lineNumberLine.substring(indexLine, lineNumberLine.length);
                    var numberPattern = /\d+/g;
                    var lineNumber = lineNumberSubstring.match(numberPattern)[0];
                    console.log("%cTuftsCEEO ", "color: #3ba336;", lineNumberSubstring.match(numberPattern));
                    console.log("%cTuftsCEEO ", "color: #3ba336;", "lineNumber:", lineNumber);
                    console.log("%cTuftsCEEO ", "color: #3ba336;", "typeof lineNumber:", typeof lineNumber);
                    var lineNumberInNumber = parseInt(lineNumber) - 5;
                    console.log("%cTuftsCEEO ", "color: #3ba336;", "typeof lineNumberInNumber:", typeof lineNumberInNumber);

                    funcAfterError("line " + lineNumberInNumber + ": " + errorType);
                }
                else {
                    funcAfterError(errorType);
                }
            }
        }
        else if (messageType == 0) {

        }
        // storage information
        else if (messageType == 1) {

            var storageInfo = parsedUJSON["p"]["slots"]; // get info of all the slots

            for (var slotid in storageInfo) {
                hubProjects[slotid] = storageInfo[slotid]; // reassign hubProjects global variable
            }

        }
        // battery status
        else if (messageType == 2) {
            batteryAmount = parsedUJSON["p"][1];
        }
        // give center button click, left, right (?)
        else if (messageType == 3) {
            console.log("%cTuftsCEEO ", "color: #3ba336;", lastUJSONRPC);
            if (parsedUJSON.p[0] == "center") {
                hubMainButton.pressed = true;

                if (parsedUJSON.p[1] > 0) {
                    hubMainButton.pressed = false;
                    hubMainButton.duration = parsedUJSON.p[1];
                }
            }
            else if (parsedUJSON.p[0] == "connect") {
                hubBluetoothButton.pressed = true;

                if (parsedUJSON.p[1] > 0) {
                    hubBluetoothButton.pressed = false;
                    hubBluetoothButton.duration = parsedUJSON.p[1];
                }
            }
            else if (parsedUJSON.p[0] == "left") {
                hubLeftButton.pressed = true;

                // execute callback for wait_until_pressed() if defined
                typeof funcAfterLeftButtonPress === "function" && funcAfterLeftButtonPress();
                funcAfterLeftButtonPress = undefined;

                if (parsedUJSON.p[1] > 0) {
                    hubLeftButton.pressed = false;
                    hubLeftButton.duration = parsedUJSON.p[1];

                    // execute callback for wait_until_released() if defined
                    typeof funcAfterLeftButtonRelease === "function" && funcAfterLeftButtonRelease();
                    funcAfterLeftButtonRelease = undefined;
                }

            }
            else if (parsedUJSON.p[0] == "right") {
                hubRightButton.pressed = true;

                // execute callback for wait_until_pressed() if defined
                typeof funcAfterRightButtonPress === "function" && funcAfterRightButtonPress();
                funcAfterRightButtonPress = undefined;

                if (parsedUJSON.p[1] > 0) {
                    hubRightButton.pressed = false;
                    hubRightButton.duration = parsedUJSON.p[1];

                    // execute callback for wait_until_released() if defined
                    typeof funcAfterRightButtonRelease === "function" && funcAfterRightButtonRelease();
                    funcAfterRightButtonRelease = undefined;
                }
            }

        }
        // gives orientation of the hub (leftside, up,..), tapping of hub, 
        else if (messageType == 4) {
            /* this data stream is about hub orientation */

            var newOrientation = parsedUJSON.p;
            if (newOrientation == "1") {
                lastHubOrientation = "up";
            }
            else if (newOrientation == "4") {
                lastHubOrientation = "down";
            }
            else if (newOrientation == "0") {
                lastHubOrientation = "front";
            }
            else if (newOrientation == "3") {
                lastHubOrientation = "back";
            }
            else if (newOrientation == "2") {
                lastHubOrientation = "leftSide";
            }
            else if (newOrientation == "5") {
                lastHubOrientation = "rightSide";
            }

            console.log("%cTuftsCEEO ", "color: #3ba336;", lastUJSONRPC);
        }
        else if (messageType == 7) {
            if (funcAfterPrint != undefined) {
                funcAfterPrint(">>> Program started!");
            }
        }
        else if (messageType == 8) {
            if (funcAfterPrint != undefined) {
                funcAfterPrint(">>> Program finished!");
            }
        }
        else if (messageType == 9) {
            var encodedName = parsedUJSON["p"];
            var decodedName = atob(encodedName);
            hubName = decodedName;

            if (triggerCurrentStateCallback != undefined) {
                triggerCurrentStateCallback();
            }
        }
        else if (messageType == 11) {
            console.log("%cTuftsCEEO ", "color: #3ba336;", lastUJSONRPC);
        }
        else if (messageType == 14) {
            var newGesture = parsedUJSON.p;

            if (newGesture == "3") {
                hubGesture = "freefall";
                hubGestures.push(newGesture);
            }
            else if (newGesture == "2") {
                hubGesture = "shake";
                hubGestures.push("shaken"); // the string is different at higher level
            }
            else if (newGesture == "1") {
                hubFrontEvent = "tapped";
                hubGestures.push(newGesture);
            }
            else if (newGesture == "0") {
                hubFrontEvent = "doubletapped";
                hubGestures.push(newGesture);
            }

            // execute funcAfterNewGesture callback that was taken at wait_for_new_gesture()
            if (typeof funcAfterNewGesture === "function") {
                funcAfterNewGesture(newGesture);
                funcAfterNewGesture = undefined;
            }

            console.log("%cTuftsCEEO ", "color: #3ba336;", lastUJSONRPC);

        }
        else if (messageType == "userProgram.print") {
            var printedMessage = parsedUJSON["p"]["value"];
            var NLindex = printedMessage.search(/\\n/);
            printedMessage = await printedMessage.substring(0, NLindex);

            console.log("%cTuftsCEEO ", "color: #3ba336;", atob(printedMessage));

            // execute function after print if defined
            if (funcAfterPrint != undefined) {
                funcAfterPrint(atob(printedMessage));
            }
        }
        else {

            // general parameters check
            if (parsedUJSON["r"]) {
                if (parsedUJSON["r"]["slots"]) {

                    var storageInfo = parsedUJSON["r"]["slots"]; // get info of all the slots

                    for (var slotid in storageInfo) {
                        hubProjects[slotid] = storageInfo[slotid]; // reassign hubProjects global variable
                    }

                }
            }

            // getFirmwareInfo callback check
            if (getFirmwareInfoCallback != undefined) {
                if (getFirmwareInfoCallback[0] == parsedUJSON["i"]) {
                    var version = parsedUJSON["r"]["runtime"]["version"];
                    var stringVersion = ""
                    for (var index in version) {
                        if (index < version.length - 1) {
                            stringVersion = stringVersion + version[index] + ".";
                        }
                        else {
                            stringVersion = stringVersion + version[index];
                        }
                    }
                    console.log("%cTuftsCEEO ", "color: #3ba336;", "firmware version: ", stringVersion);
                    getFirmwareInfoCallback[1](stringVersion);
                }
            }

            console.log("%cTuftsCEEO ", "color: #3ba336;", "received response: ", lastUJSONRPC);

            // iterate over responseCallbacks global variable
            for (var index in responseCallbacks) {

                var currCallbackInfo = responseCallbacks[index];

                // check if the message id of UJSONRPC corresponds to that of a response callback
                if (currCallbackInfo[0] == parsedUJSON["i"]) {

                    var response = "null";

                    if (parsedUJSON["r"] == 0) {
                        response = "done";
                    }
                    else if (parsedUJSON["r"] == 2) {
                        response = "stalled";
                    }

                    // execute callback with the response
                    currCallbackInfo[1](response);

                    // empty the index of which callback that was just executed
                    responseCallbacks[index] = undefined;
                }
            }

            // execute the callback function after sending start_write_program UJSONRPC
            if (startWriteProgramCallback != undefined) {

                console.log("%cTuftsCEEO ", "color: #3ba336;", "startWriteProgramCallback is defined. Looking for matching mesasage id...")

                // check if the message id of UJSONRPC corresponds to that of a response callback
                if (startWriteProgramCallback[0] == parsedUJSON["i"]) {

                    console.log("%cTuftsCEEO ", "color: #3ba336;", "matching message id detected with startWriteProgramCallback[0]: ", startWriteProgramCallback[0])

                    // get the information for the packet sending
                    var blocksize = parsedUJSON["r"]["blocksize"]; // maximum size of each packet to be sent in bytes
                    var transferid = parsedUJSON["r"]["transferid"]; // id to use for transferring this program

                    console.log("%cTuftsCEEO ", "color: #3ba336;", "executing writePackageFunc expecting transferID of ", transferid);

                    // execute callback
                    await startWriteProgramCallback[1](blocksize, transferid);

                    console.log("%cTuftsCEEO ", "color: #3ba336;", "deallocating startWriteProgramCallback");

                    // deallocate callback
                    startWriteProgramCallback = undefined;
                }

            }

            // check if the program should write packages for a program
            if (writePackageInformation != undefined) {

                console.log("%cTuftsCEEO ", "color: #3ba336;", "writePackageInformation is defined. Looking for matching mesasage id...")

                // check if the message id of UJSONRPC corresponds to that of the first write_package script that was sent
                if (writePackageInformation[0] == parsedUJSON["i"]) {

                    console.log("%cTuftsCEEO ", "color: #3ba336;", "matching message id detected with writePackageInformation[0]: ", writePackageInformation[0]);

                    // get the information for the package sending process
                    var remainingData = writePackageInformation[1];
                    var transferID = writePackageInformation[2];
                    var blocksize = writePackageInformation[3];

                    // the size of the remaining data to send is less than or equal to blocksize
                    if (remainingData.length <= blocksize) {
                        console.log("%cTuftsCEEO ", "color: #3ba336;", "remaining data's length is less than or equal to blocksize");

                        // the size of remaining data is not zero
                        if (remainingData.length != 0) {

                            var dataToSend = remainingData.substring(0, remainingData.length);

                            console.log("%cTuftsCEEO ", "color: #3ba336;", "reminaing data's length is not zero, sending entire remaining data: ", dataToSend);

                            var base64data = btoa(dataToSend);

                            UJSONRPC.writePackage(base64data, transferID);

                            console.log("%cTuftsCEEO ", "color: #3ba336;", "deallocating writePackageInforamtion")

                            if (writeProgramCallback != undefined) {

                                writeProgramCallback();
                            }


                            writePackageInformation = undefined;
                        }
                    }
                    // the size of remaining data is more than the blocksize
                    else if (remainingData.length > blocksize) {

                        console.log("%cTuftsCEEO ", "color: #3ba336;", "remaining data's length is more than blocksize");

                        var dataToSend = remainingData.substring(0, blocksize);

                        console.log("%cTuftsCEEO ", "color: #3ba336;", "sending blocksize amount of data: ", dataToSend)

                        var base64data = btoa(dataToSend);

                        var messageid = UJSONRPC.writePackage(base64data, transferID);

                        console.log("%cTuftsCEEO ", "color: #3ba336;", "expected response with message id of ", messageid);

                        var remainingData = remainingData.substring(blocksize, remainingData.length);

                        writePackageInformation = [messageid, remainingData, transferID, blocksize];
                    }
                }

            }

        }
    }

    /** Get the orientation of the hub based on gyroscope values
     * 
     * @private
     * @param {(number|Array)} gyro 
     */
    function setHubOrientation(gyro) {
        var newOrientation;
        if (gyro[0] < 500 && gyro[0] > -500) {
            if (gyro[1] < 500 && gyro[1] > -500) {

                if (gyro[2] > 500) {
                    newOrientation = "front";
                }
                else if (gyro[2] < -500) {
                    newOrientation = "back";
                }
            }
            else if (gyro[1] > 500) {
                newOrientation = "up";
            }
            else if (gyro[1] < -500) {
                newOrientation = "down";
            }
        } else if (gyro[0] > 500) {
            newOrientation = "leftSide";
        }
        else if (gyro[0] < -500) {
            newOrientation = "rightSide";
        }

        return newOrientation;
    }

    // public members
    return {
        init: init,
        sendDATA: sendDATA,
        rebootHub: rebootHub,
        reachMicroPy: reachMicroPy,
        executeAfterInit: executeAfterInit,
        executeAfterPrint: executeAfterPrint,
        executeAfterError: executeAfterError,
        executeAfterDisconnect: executeAfterDisconnect,
        executeWithStream: executeWithStream,
        getPortsInfo: getPortsInfo,
        getPortInfo: getPortInfo,
        getBatteryStatus: getBatteryStatus,
        getFirmwareInfo: getFirmwareInfo,
        getHubInfo: getHubInfo,
        getHubName: getHubName,
        getProjects: getProjects,
        isActive: isActive,
        getBigMotorPorts: getBigMotorPorts,
        getSmallMotorPorts: getSmallMotorPorts,
        getUltrasonicPorts: getUltrasonicPorts,
        getColorPorts: getColorPorts,
        getForcePorts: getForcePorts,
        getMotorPorts: getMotorPorts,
        getMotors: getMotors,
        getDistanceSensors: getDistanceSensors,
        getColorSensors: getColorSensors,
        getForceSensors: getForceSensors,
        getLatestUJSON: getLatestUJSON,
        getBluetoothButton: getBluetoothButton,
        getMainButton: getMainButton,
        getLeftButton: getLeftButton,
        getRightButton: getRightButton,
        getHubGesture: getHubGesture,
        getHubEvent: getHubEvent,
        getHubOrientation: getHubOrientation,
        Motor: Motor,
        PrimeHub: PrimeHub,
        ForceSensor: ForceSensor,
        DistanceSensor: DistanceSensor,
        ColorSensor: ColorSensor,
        MotorPair: MotorPair,
        writeProgram: writeProgram,
        stopCurrentProgram: stopCurrentProgram,
        executeProgram: executeProgram,
        micropython: micropython // for final projects
    };
}



/*
Project Name: SPIKE Prime Web Interface
File name: micropyUtils.js
Author: Jeremy Jung
Last update: 10/22/20
Description: utility class to convert javascript variables to python variablse 
            for EN1 Simple Robotics final projects
Credits/inspirations:
History:
    Created by Jeremy on 10/18/20
(C) Tufts Center for Engineering Education and Outreach (CEEO)
NOTE:
strings need to be in single quotes
*/

var micropyUtils = {};

micropyUtils.storedVariables = {}; // all variables declared in window
micropyUtils.beginVariables = {}; // all variables declared in window before code

// automatically initialize microPyUtils to exclude predeclared variables when window loads
// this initializes after global variable declarations but before hoisted functions in <script> are executed
window.onload = function () {
    console.log("onload")
    //micropyUtils.init();
}

// this initializes after global variable declarations but before hoisted functions in <script> are executed
// this runs earlier than onload
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMCONtent")
    //micropyUtils.init();
})
//////////////////////////////////////////
//                                      //
//           Public Functions           //
//                                      //
//////////////////////////////////////////

// remember global variables declared BEFORE user code
micropyUtils.remember = function () {
    for (var name in window) {
        micropyUtils.beginVariables[name] = window[name];
    }
    console.log("remembered predeclared variables ", micropyUtils.beginVariables)
}

/* parse and add all local variable declarations to micropyUtils.storedVariables

var aString = "hi" or var aString = 'hi' > {aString: "hi"}


*/
// micropyUtils.addLocalVariables = function() {
//     // get the function definition of caller
//     var thisFunction = arguments.callee.caller.toString();

//     console.log(thisFunction);

//     // split function scope by newlines
//     var newLineRule = /\n/g
//     var arrayLines = thisFunction.split(newLineRule);

//     // filter lines that dont contain var, or contains function
//     var arrayVarLines = [];
//     for ( var index in arrayLines ) {
//         if ( arrayLines[index].indexOf("var") > -1 ) {
//             // filter out functions and objects
//             if (arrayLines[index].indexOf("function") == -1 && arrayLines[index].indexOf("{") == -1 && arrayLines[index].indexOf("}") == -1) {
//                 arrayVarLines.push(arrayLines[index]);
//             }
//         }
//     }

//     var parseRule = /[[ ]/g
//     for ( var index in arrayVarLines ) {
//         // process line
//         var processedLine = micropyUtils.processString(arrayVarLines[index]);

//         // get [datatype] object = value format
//         var listParsedLine = processedLine.split(parseRule);
//         //listParsedLine = listParsedLine.split(/[=]/g)

//         var keyValue = micropyUtils.checkString(listParsedLine);

//         // insert into variables 
//         for ( var name in keyValue ) {
//             micropyUtils.storedVariables[name] = keyValue[name];
//         }
//     }

// }

// initialize utility object (find window variables to exclude from conversion)
micropyUtils.init = function () {
    var excludeVariables = {};

    // get variables to exclude
    for (var compare in micropyUtils.beginVariables) {
        // if variables found on remember() are defined, these are not user-generated variables, so flag them predeclared
        if (typeof micropyUtils.beginVariables[compare] !== "undefined") {
            excludeVariables[compare] = "predeclared"
        }
    }

    // append window variables to micropyUtils.storedVariables, but exclude those predeclared
    for (var name in window) {
        if (excludeVariables[name] != "predeclared") {
            micropyUtils.storedVariables[name] = window[name];
        }
    }
    console.log("stored Variabls in init: ", micropyUtils.storedVariables);
}

micropyUtils.makeMicroPyDeclarations = function () {
    // initialize microPyUtils
    micropyUtils.init();

    /* add local variables of the caller of this function */
    // get the function definition of caller
    /* parse and add all local variable declarations to micropyUtils.storedVariables

    var aString = "hi" or var aString = 'hi' > {aString: "hi"}


    */
    var thisFunction = arguments.callee.caller.toString();

    console.log(thisFunction);

    // split function scope by newlines
    var newLineRule = /\n/g
    var arrayLines = thisFunction.split(newLineRule);

    // filter lines that dont contain var, or contains function
    var arrayVarLines = [];
    for (var index in arrayLines) {
        if (arrayLines[index].indexOf("var") > -1) {
            // filter out functions and objects
            if (arrayLines[index].indexOf("function") == -1 && arrayLines[index].indexOf("{") == -1 && arrayLines[index].indexOf("}") == -1) {
                arrayVarLines.push(arrayLines[index]);
            }
        }
    }

    var parseRule = /[[ ]/g
    for (var index in arrayVarLines) {
        // process line
        var processedLine = micropyUtils.processString(arrayVarLines[index]);

        // get [datatype] object = value format
        var listParsedLine = processedLine.split(parseRule);
        //listParsedLine = listParsedLine.split(/[=]/g)

        var keyValue = micropyUtils.checkString(listParsedLine);

        // insert into variables 
        for (var name in keyValue) {
            micropyUtils.storedVariables[name] = keyValue[name];
        }
    }

    /* generate lines of micropy variable declarations */
    var lines = [];
    for (var name in micropyUtils.storedVariables) {
        var variableName = name;
        if (typeof micropyUtils.storedVariables[name] !== "function" && typeof micropyUtils.storedVariables[name] !== "object") {
            var variableValue = micropyUtils.convertToString(micropyUtils.storedVariables[name]);
            lines.push("" + variableName + " = " + variableValue);

        }
    }

    return lines
}

//////////////////////////////////////////
//                                      //
//          Private Functions           //
//                                      //
//////////////////////////////////////////

// add local variables in which scope the utility tool is being used
micropyUtils.addVariables = function (object) {
    for (var name in object) {
        micropyUtils.storedVariables[name] = object[name];
    }
}


// filter out unparsable variable declarations and process valid ones
micropyUtils.processString = function (input) {
    var result = input.trim();
    var removeRule = /[;]/g
    result = result.replace(removeRule, "");
    var doubleQuotes = /[",']/g
    result = result.replace(doubleQuotes, "");
    return result;
}

// return key value pair of variable declaration
micropyUtils.checkString = function (list) {
    var result = {}; // {variable name: variable value}
    // check if list starts with var
    if (list[0] == "var") {
        var variableName = list[1];
        // check assignment operator
        if (list[2] == "=") {
            // assume the right hand side of assignment operator is only one term
            var value = list[3];

            result[variableName] = micropyUtils.convertFromString(value);

            return result;
        }
        else {
            return undefined;
        }
    }
    else {
        return undefined;
    }
}

// convert string value to correct data type value
micropyUtils.convertFromString = function (value) {
    // value is not a number
    if (isNaN(parseInt(value))) {
        // value is a bool
        if (value.indexOf("true") > -1) {
            return true;
        }
        else if (value.indexOf("false") > -1) {
            return false;
        }
        // value is a string
        else {
            return value;
        }
    }
    else {
        // value is a number
        var number = Number(value);
        return number;
    }
}

// convert datatype value to string value
micropyUtils.convertToString = function (value) {
    // value is a string, enclose with single quots and return
    if (typeof value == "string") {
        return "'" + value + "'";
    }
    else {
        // value is a number
        if (Number(value)) {
            return "" + value;
        }
        // value is boolean
        else {
            if (value) {
                return "True";
            }
            else {
                return "False";
            }
        }
    }
}

//////////////////////////////////////////
//                                      //
//                  Main                //
//                                      //
//////////////////////////////////////////

// remember predeclared variables when this file is loaded
micropyUtils.remember();
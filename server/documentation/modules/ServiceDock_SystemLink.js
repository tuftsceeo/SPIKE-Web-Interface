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
        var imageRelPath = "./modules/views/systemlinkIcon.png" // relative to the document in which a servicesystemlink is created ( NOT this file )
        var length = 50; // for width and height of button
        var backgroundColor = "#A2E1EF" // background color of the button
        var buttonStyle = "width:" + length + "px; height:" + length + "px; background: url(" + imageRelPath + ") no-repeat; background-size: 50px 50px; background-color:" + backgroundColor 
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
 * // if you're not using ServiceDock
 * var mySL = new Service_SystemLink();
 * 
 * mySL.init();
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

    /** <h4> initialize SystemLink_Service </h4>
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

    /** <h4> Get the callback function to execute after service is initialized </h4>
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

    /** <h4> Return the tagsInfo global variable </h4>
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

    /** <h4> Change the current value of a tag on SystemLink cloud </h4>
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

    /** <h4> Get the current value of a tag on SystemLink cloud </h4>
     * 
     * @public
     * @param {string} tagName 
     * @returns {any} current value of tag
     */
    async function getTagValue(tagName) {

        var currentValue = tagsInfo[tagName].value;

        return currentValue;
    }

    /** <h4> Get whether the Service was initialized or not </h4>
     * 
     * @public
     * @returns {boolean} whether Service was initialized or not
     */
    function isActive() {
        return serviceActive;
    }

    /** <h4> Change the APIKey </h4>
     * @ignore
     * @param {string} APIKeyInput 
     */
    function setAPIKey(APIKeyInput) {
        // changes the global variable APIKey
        APIKey = APIKeyInput;
    }
    
    /** <h4> Create a new tag </h4>
     * 
     * @public
     * @param {string} tagName name of tag to create
     * @param {any} tagValue value to assign the tag after creation
     * @param {function} callback optional callback
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

    /** <h4> Delete tag </h4>
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

    /** <h4> Check if Systemlink API key is valid for use </h4>
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

    /** <h4> Assign list of tags existing in the cloud to {tagPaths} global variable </h4>
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

    /** <h4> Get the info of a tag in the cloud </h4>
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

    /** <h4> Send PUT request to SL cloud API and change the value of a tag </h4>
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

    /** <h4> Delete the tag on the System Link cloud </h4>
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

    /** <h4> Helper function for getting data types in systemlink format </h4>
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

    /** <h4> Helper function for converting values to correct type based on data type </h4>
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
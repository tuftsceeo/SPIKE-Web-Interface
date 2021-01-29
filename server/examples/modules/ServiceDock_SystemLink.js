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
                
                console.log("%cTuftsCEEO ", "color: #3ba336;", "Activating SystemLink Service");
                
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
        // if apikey was not given in attributes
        if (this.getAttribute("apikey") == undefined || this.getAttribute("apikey") == "") {
            var APIKeyResult = prompt("Please enter your System Link Cloud API Key:");
            
            // APIkey 
            if (APIKeyResult == null || APIKeyResult == "") {
                console.log("%cTuftsCEEO ", "color: #3ba336;", "You inserted no API key");
                APIKeyExists = false;
            }
            else {
                this.APIKey = APIKeyResult;
            }
        }
        else {
            var APIKeyResult = this.getAttribute("apikey");
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
        console.log("%cTuftsCEEO ", "color: #3ba336;", val);
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
 * // assuming you declared <service-systemlink> with the id, "service_systemlink"
 * var mySL = document.getElemenyById("service_systemlink").getService();
 * mySL.setAttribute("apikey", "YOUR API KEY");
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

    /** initialize SystemLink_Service
     * <p> Starts polling the System Link cloud </p>
     * <p> <em> this function needs to be executed after executeAfterInit but before all other public functions </em> </p>
     * 
     * @public
     * @param {string} APIKeyInput SYstemlink APIkey
     * @param {integer} pollIntervalInput interval at which to get tags from the cloud in MILISECONDS. Default value is 1000 ms.
     * @returns {boolean} True if service was successsfully initialized, false otherwise
     * @example
     * var SystemLinkElement = document.getElemenyById("service_systemlink");
     * var mySL = SystemLinkElement.getService();
     * mySL.init("APIKEY", 1000); // initialize SystemLink Service with a poll interval of 10 ms
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

                serviceActive = true;

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
     *     var tagsInfo = mySL.getTagsInfo();
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
     * var tagsInfo = mySL.getTagsInfo();
     * var astringValue = tagsInfo["astring"]["value"];
     * var astringType = tagsInfo["astring"]["type"];
     */
    function getTagsInfo() {
        return tagsInfo;
    }

    /** Change the current value of a tag on SystemLink cloud. 
     * 
     * @private
     * @param {string} name name of tag to update
     * @param {any} value new value's data type must match the Tag's data type.
     * @param {function} callback function to execute after tag is updated
     * @example
     * // set a string type Value of a Tag and display
     * mySL.setTagValue("message", "hello there", function () {
     *    let messageValue = mySL.getTagValue("message");
     *    console.log("message: ", messageValue); // display the updated value
     * })
     * // set value of a boolean Tag
     * mySL.setTagValue("aBoolean", true);
     *
     * // set value of an integer Tag
     * mySL.setTagValue("anInteger", 10);
     *
     * // set value of a double Tag
     * mySL.setTagValue("aDouble", 5.2);
     */
    function setTagValue(tagName, newValue, callback) {
        // changes the value of a tag on the cloud
        setTagValueStrict(tagName, newValue, callback);
    }

    /** Change the current value of a tag on SystemLink cloud with strict data types. Values will be implicitly converted
     * <br>
     * NotStrict property indicates that the data type of the Value supplied will be implicitly converted. For example, allowing for setting an INT tag's value with a string, "123" or a STRING tag's value with
     * a number. This method exists for convenience but please avoid using it extensively as it can lead to unpredictable outcomes.
     * @public
     * @param {any} tagName 
     * @param {any} newValue 
     * @param {any} callback 
     * // set a string type Value of a Tag and display
     * mySL.setTagValueNotStrict("message", 123, function () {
     *    let messageValue = mySL.getTagValue("message");
     *    console.log("message: ", messageValue); // display the updated value, which will be 123.
     * })
     * // set value of a boolean Tag
     * mySL.setTagValueNotStrict("aBoolean", true);
     *
     * // set value of an integer Tag
     * mySL.setTagValueNotStrict("anInteger", 10);
     * mySL.setTagValueNotStrict("anInteger", "10");
     *
     * // set value of a double Tag
     * mySL.setTagValueNotStrict("aDouble", 5.2);
     * mySL.setTagValueNotStrict("aDouble", "5.2");
     */
    function setTagValueNotStrict(tagName, newValue, callback) {
        // changes the value of a tag on the cloud
        changeValue(tagName, newValue, false, function (valueChanged) {
            if (valueChanged) {
                // wait for changed value to be retrieved
                setTimeout(function () {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }, 1000)
            }
        });
    }

    /** Change the current value of a tag on SystemLink cloud with strict data types. There will be no implicit data type conversions. E.g. Updating tags of INT type will only work with javascript number.
     * 
     * @public
     * @param {any} name name of tag to update
     * @param {any} value value to update tag to
     * @param {any} callback function to execute after tag is updated
     */
    function setTagValueStrict(tagName, newValue, callback) {
        // changes the value of a tag on the cloud
        changeValue(tagName, newValue, true, function (valueChanged) {
            if (valueChanged) {
                // wait for changed value to be retrieved
                setTimeout(function () {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }, 1000)
            }
        });
    }


    /** Get the current value of a tag on SystemLink cloud
     * 
     * @public
     * @param {string} tagName 
     * @returns {any} current value of tag
     * @example
     * messageValue = mySL.getTagValue("message");
     * console.log("message: ", messageValue);
     */
    function getTagValue(tagName) {

        var currentValue = tagsInfo[tagName].value;

        return currentValue;
    }

    /** Get whether the Service was initialized or not
     * 
     * @public
     * @returns {boolean} whether Service was initialized or not
     * @example
     * if (mySL.isActive() === true)
     *     // do something if SystemLink Service is active
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
    
    /** Create a new tag. The type of new tag is determined by the javascript data type of tagValue. 
     * @public
     * @param {string} tagName name of tag to create
     * @param {any} tagValue value to assign the tag after creation
     * @param {function} callback optional callback
     * @example
     * mySL.createTag("message", "hi", function () {
     *      mySL.setTagValue("message", "bye"); // change the value of 'message' from "hi" to "bye"
     * })
     */
    function createTag(tagName, tagValue, callback) {
        
        // get the SystemLink formatted data type of tag
        var valueType = getValueType(tagValue);

        // create a tag with the name and data type. If tag exists, it still returns successful response
        createNewTagHelper(tagName, valueType, function (newTagCreated) {
            
            // after tag is created, assign a value to it
            changeValue(tagName, tagValue, false, function (newTagValueAssigned) {

                // execute callback if successful
                if (newTagCreated) {
                    if (newTagValueAssigned) {
                        // wait for changed value to be retrieved
                        setTimeout( function() {
                            if (typeof callback == 'function') {
                                callback();
                            }
                        }, 1000)
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
     * @example
     * mySL.deleteTag("message", function () {
     *      let tagsInfo = mySL.getTagsInfo();
     *      console.log("tagsInfo: ", tagsInfo); // tags information will now not contain the 'message' tag
     * })
     */
    function deleteTag(tagName, callback) {
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
                    console.log("%cTuftsCEEO ", "color: #3ba336;", "APIkey is valid")
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

                console.log("%cTuftsCEEO ", "color: #3ba336;", this.response);

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
     * This function will receive a newValue of any kind of type. Before the POST request is sent,
     * the SL data type of the tag to convert must be found, and newValue must be in string format
     * @private
     * @param {string} tagPath string of the name of the tag
     * @param {any} newValue value to assign tag
     * @param {function} callback
     */
    async function changeValue(tagPath, newValue, strict, callback) {
        new Promise(async function (resolve, reject) {

            var URL = "https://api.systemlinkcloud.com/nitag/v2/tags/" + tagPath + "/values/current";

            // assume newValue is already in correct datatype and just give the data type in SystemLink format
            //var valueType = getValueType(newValue);
            var valueType;
            var newValueStringified;

            // if Tag to change does not yet exist (possibly due to it being created very recently)
            if (tagsInfo[tagPath] === undefined) {
                // refer to newValue's JS type to deduce Tag's data type
                valueType = getValueTypeStrict(newValue);
            }
            // Tag to change exists; find the SL data type of tag from locally stored tagsInfo
            else {
                if (strict === true) {
                    /* strict changeValue. So no implicit data type conversions. All newValue's types need to match the tag's type */

                    expectedValueType = tagsInfo[tagPath].type;
                    inputValueType = getValueTypeStrict(newValue);
                    console.log("%cTuftsCEEO ", "color: #3ba336;", expectedValueType, " vs ", inputValueType);
                    if (inputValueType !== expectedValueType) {
                        console.error("%cTuftsCEEO ", "color: #3ba336;", "Could not update value of tag on SystemLink Cloud. The given value is not of the data type defined for the tag in the database");
                        throw new Error("Could not update value of tag on SystemLink Cloud.The given value is not of the data type defined for the tag in the database");
                    }
                    else {
                        valueType = tagsInfo[tagPath].type;
                    }
                }
                else {
                    valueType = tagsInfo[tagPath].type;
                }
            }
            
            newValueStringified = changeToString(newValue);

            var data = { "value": { "type": valueType, "value": newValueStringified } };
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
                    console.log("%cTuftsCEEO ", "color: #3ba336;", this.status + " Error at changeValue: ", this.response)
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
                console.log("%cTuftsCEEO ", "color: #3ba336;", "Error at createNewTagHelper", request.response);
                reject(false);
            }

            // catch error
            request.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && (this.status != 200 && this.status != 201)) {
                    console.log("%cTuftsCEEO ", "color: #3ba336;", this.status + " Error at createNewTagHelper: ", this.response)
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
                console.log("%cTuftsCEEO ", "color: #3ba336;", "Error at deleteTagHelper", request.response);
                reject(false);
            }

            // catch error
            request.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && this.status != 200) {
                    console.log("%cTuftsCEEO ", "color: #3ba336;", this.status + " Error at deleteTagHelper: ", this.response)
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
                console.log("%cTuftsCEEO ", "color: #3ba336;", "error sending request:", request.response);
            }
        }

        return request;
    }

    /** Helper function for getting data types in systemlink format
     * 
     * @private
     * @param {any} new_value the variable containing the new value of a tag
     * @returns {any} data type of tag
     */
    function getValueType(new_value) {

        //if the value is not a number
        if (isNaN(new_value)) {
            //if the value is a boolean
            if (new_value === "true" || new_value === "false") {
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

    /**
     * @private
     * @param {any} new_value 
     * @returns {string} data type of tag 
     */
    function getValueTypeStrict(new_value) {
        //if the value is a boolean
        if (typeof new_value === "boolean") {
            return "BOOLEAN";
        }
        else if (typeof new_value === "string") {
            return "STRING";
        }
        else if (typeof new_value === "number") {
            if (Number.isInteger(parseFloat(new_value))) {
                return "INT"
            }
            //if value is a double
            else {
                return "DOUBLE"
            }
        }
    }


    /** stringify newValue
     * Note: for POST request
     * @private
     * @param {any} newValue 
     * @returns {string} newValue stringified
     */
    function changeToString(newValue) {
        var newValueConverted;

        // already a string
        if (typeof newValue == "string") {
            newValueConverted = newValue;
        }
        else {
            newValueConverted = JSON.stringify(newValue);
        }

        return newValueConverted;
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
        setTagValueNotStrict: setTagValueNotStrict,
        getTagValue: getTagValue,
        executeAfterInit: executeAfterInit,
        setAPIKey: setAPIKey,
        isActive: isActive,
        createTag: createTag,
        deleteTag: deleteTag
    }
}
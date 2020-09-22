/*
Project Name: SPIKE Prime Web Interface
File name: ServiceDock_Template.js
Author: Jeremy Jung
Last update: 7/20/20
Description: HTML Element definition for <service-template> to be used in ServiceDocks
Credits/inspirations:
History:
    Created by Jeremy on 7/20/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

/* ServiceDock HTML Element Definition */

class servicetemplate extends HTMLElement {

    constructor() {
        super();

        this.active = false; // whether the service was activated
        this.service = new Service_Template(); // instantiate a service object ( one object per button )
        this.proceed = false; // if there are credentials input

        // Create a shadow root
        var shadow = this.attachShadow({ mode: 'open' });

        /* wrapper definition and CSS */
        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');
        wrapper.setAttribute("style", "width: 50px; height: 50px; position: relative; margin-top: 10px;")

        /* ServiceDock button definition and CSS */

        var button = document.createElement("button");
        button.setAttribute("id", "template_button");
        button.setAttribute("class", "TEMPLATE_button");
        /* CSS */
        var imageRelPath = "./modules/views/icons8_question.png" // relative to the document in which a servicesystemlink is created ( NOT this file )
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

    /* Ask user for API credentials with an alert */
    // DEV: credentials will differ by service

    popUpBox() {
        // flags to check if users' input exists
        // DEV: add as many as needed
        var APIKeyExists = true;

        // prompt user for input
        // DEV: add as many as needed
        var APIKeyResult = prompt("Please enter your API Key:", "*********************");
        
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

        // proceed if user input an API Key field
        if (APIKeyExists) {
            this.proceed = true;
        }
    }

    /* allow credentials input through HTML attributes */
    // DEV: add more fields as needed
    
    // observe the attributes listed
    static get observedAttributes() {
        return ["apikey"];
    }

    /* getter and setter methods for credentials.*/
    get apikey() {
        return this.getAttribute("apikey");
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

    // change the API key 
    attributeChangedCallback(name, oldValue, newValue) {
        if (name = "apikey") {
            this.APIKey = newValue;
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
        var initSuccess = await this.service.init();
        if (initSuccess) {
            return true;
        }
        else {
            return false;
        }
    }

}

// when defining custom element, the name must have at least one - dash 
window.customElements.define('service-template', servicetemplate);

/* ServiceDock class Definition */

/**
 *
 * @class Service_Template
 * // if you're using ServiceDock
 * var mySL = document.getElemenyById("service_Template").getService();
 * // if you're not using ServiceDock
 * var myExampleService = new Service_Template();
 *
 * myExampleService.init();
 */
function Service_Template() {

    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    /* private members */

    let currentData= {}; // contains real-time information of the tags in the cloud

    /* DEV: API credentials, add or remove as needed for your API */
    let APIKey = "API KEY"; // default APIKey in case no APIKey is given on init

    let serviceActive = false; // set to true when service goes through init

    let pollInterval = 1000; // interval at which to continuously poll the external API

    var funcAtInit = undefined; // function to call after init

    //////////////////////////////////////////
    //                                      //
    //           Public Functions           //
    //                                      //
    //////////////////////////////////////////

    /** <h4> initialize Service_Template </h4>
     * <p> Starts polling the external API </p>
     * <p> <em> this function needs to be executed after executeAfterInit but before all other public functions </em> </p>
     * 
     * @public
     * @param {string} APIKeyInput API Key
     * @param {integer} pollIntervalInput interval at which to poll the cloud in MILISECONDS
     * @returns {boolean} True if service was successsfully initialized, false otherwise
     * 
     */
    async function init(APIKeyInput, pollIntervalInput) {

        // if an APIKey was specified, use the specified key
        if (APIKeyInput !== undefined) {
            APIKey = APIKeyInput;
        }

        // check if the given API credentials are valid
        var credentialsValid = await checkAPICredentials(APIKey);

        // if the credentials are valid authorization
        if (credentialsValid) {

            // change the rate at which ServiceDock polls/requests the external API
            if (pollIntervalInput !== undefined) {
                pollInterval = await pollIntervalInput;
            }

            // begin polling the external API to populate {currentData}
            beginDataStream(function () {

                serviceActive = true; // flag that the service is active

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

    /** <h4> Get the callback function to execute after service is initialized </h4>
     * <p> <em> This function needs to be executed before calling init() </em> </p>
     * 
     * @public
     * @param {function} callback function to execute after initialization
     * @example
     * mySL.executeAfterInit( function () {
     *     // your API code
     * })
     */
    function executeAfterInit(callback) {
        // Assigns global variable funcAtInit a pointer to callback function
        funcAtInit = callback;
    }

    /** <h4> Get real time data from external API </h4>
    *
    * @public
    * @returns {object} current data
    * @example
    * var info = await myTemplate.getCurrentData();
    * 
    */
    function getCurrentData() {
        return currentData;
    }


    /** <h4> Get whether the Service was initialized or not </h4>
    *
    * @public
    * @returns {boolean} whether Service was initialized or not
    * @example
    */
    function isActive() {
        return serviceActive;
    }


    //////////////////////////////////////////
    //                                      //
    //          Private Functions           //
    //                                      //
    //////////////////////////////////////////

    /** <h4> Check if API credentials are valid for use </h4>
    *
    * @private
    * @param {string} APIKeyInput
    * @returns {Promise} resolve(true) or reject(error)
    */
    async function checkAPICredentials(APIKeyInput) {
        return new Promise(async function (resolve, reject) {
            var apiKeyAuthURL = "api.example.com/authapikey";

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

    /* beginDataStream() - update the collectedData global variable
    * 
    * Effect:
    * modifies global variable {collectedData}
    * continuously send GET requests API (ASYNC INTERVAL)
    * 
    */
    async function beginDataStream() {
        setInterval(async function () {

            var response = await getInfoFromAPI();

            // if the object is defined and not boolean false
            if (response ) {
                // populate the collectedData global var
                collectedData = response;
            }

        }, pollInterval)
    }

    /* getInfoFromAPI() - get a piece of info from API
    * 
    * Return: 
    * {Promise} - if success: collectedAPIInfo
    *           - if fail: (error)
    *
    */
    async function getInfoFromAPI() {
        return new Promise(async function (resolve, reject) {

            var getInfoURL = "example API URL";

            // send request to API
            var request = await sendXMLHTTPRequest("GET", getInfoURL, APIKey);

            // when transaction is complete, parse response and update return value (collectedTagsInfo)
            request.onload = function () {

                // parse response (string) into JSON object
                var responseJSON = JSON.parse(this.response);
                var APIInfoArray = responseJSON.datalist;

                resolve(APIInfoArray)

            }
            request.onerror = function () {
                reject(new Error("Error at getInfoFromAPI"));
            }
        })
    }


    /* postNewDataToAPI() - send PUT request to SL cloud API and change the value of a tag
    *
    * Parameters:
    * {infoPath} - name of some variable to change
    * {newValue} - new value of the variable
    * 
    * Returns:
    * {Promise} - if success: true
    *           - if fail: error
    */
    async function postNewDataToAPI(infoPath, newValue) {

        return new Promise(async function (resolve, reject) {

            var postURL = "api.example.com/" + infoPath;
            var data = { "value": newValue };
            var requestBody = data;

            var request = await sendXMLHTTPRequest("POST", postURL, APIKey, requestBody);

            request.onload = function () {
                resolve(true);
            }

            request.onerror = function () {
                reject(new Error("Error at postNewDataToAPI"));
            }
        })

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

    /* public members */
    return {
        init: init,
        executeAfterInit, executeAfterInit,
        getCurrentData: getCurrentData,
        isActive: isActive
    }
}
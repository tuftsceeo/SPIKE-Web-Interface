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

class servicetemplate extends HTMLElement {

    constructor() {
        super();

        this.active = false; // whether the service was activated
        this.service = new Service_Template(); // instantiate a service object ( one object per button )

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

        button.addEventListener("mouseenter", function (event) {
            button.style.backgroundColor = "#FFFFFF";
            button.style.color = "#000000";
        })

        this.addEventListener("click", async function () {
            // check active flag so once activated, the service doesnt reinit
            if (!this.active) {
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

/*
Project Name: SPIKE Prime Web Interface
File name: Service_Template.js
Author: Jeremy Jung
Last update: 7/20/20
Description: Templated Service Library (OOP) modeled from Service Library
History:
    Created by Jeremy on 7/20/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

function Service_Template() {

    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    /* declare global variables that will be regularly used in the Service function (object / "class") */

    let collectedData = {}; // contains real-time information of data from the API that needs regular retrieval

    // defined during init
    let APIKey; // string of the valid APIkey

    let serviceActive = false; // set to true when service goes through init

    let pollInterval = 1000;

    //////////////////////////////////////////
    //                                      //
    //           Public Functions           //
    //                                      //
    //////////////////////////////////////////

    /* init() - initialize_Service
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
        if (APIKeyInput !== undefined) {
            var response = await checkAPIKey(APIKeyInput);
            APIKey = APIKeyInput;
        }
        // if no APIkey was specified, use an already existing one
        else {
            APIKey = "*****************";
            var response = await checkAPIKey(APIKey);
        }

        // if response from checkAPIKey is valid
        if (response) {
            if (pollIntervalInput !== undefined) {
                pollInterval = await pollIntervalInput;
            }
            // initialize the collectedData global variable
            updateCollectedData();
            active = true;
            return true;
        }
        else {
            return false;
        }
    }


    /* getAPIInfo() - return the APIInfo global variable
    *
    * Returns:
    * {APIInfo} (object) - object containing basic information about currently existing tags in the cloud
    */
    async function getAPIInfo() {
        return APIInfo;
    }

    /* setAPIInfo() - change an information on the API (most like a POST request)
    *
    * Effect:
    * - changes something on the API
    */
    async function setAPIInfo(infoName, newValue) {
        return postAPIInfo(infoName, newValue);
    }

    /* isActive() - get whether the Service was initialized or not
    *
    * Returns:
    * {serviceActive} (boolean) - whether Service was initialized or not
    */
    function isActive() {
        return serviceActive;
    }

    //////////////////////////////////////////
    //                                      //
    //          Private Functions           //
    //                                      //
    //////////////////////////////////////////

    /* checkAPIKey() - check if API key is valid for use
    * 
    * Parameters:
    * {apikey} (string) - API key
    * 
    * Return: 
    * {Promise} - if success: true
    *           - if fail: error
    */
    async function checkAPIKey(APIKeyInput) {
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

    /* updateCollectedData() - update the collectedData global variable
    * 
    * Effect:
    * modifies global variable {collectedData}
    * continuously send GET requests API (ASYNC INTERVAL)
    * 
    */
    async function updateCollectedData() {
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


    /* postAPIInfo() - send PUT request to SL cloud API and change the value of a tag
    *
    * Parameters:
    * {infoPath} - name of some variable to change
    * {newValue} - new value of the variable
    * 
    * Returns:
    * {Promise} - if success: true
    *           - if fail: error
    */
    async function postAPIInfo(infoPath, newValue) {

        return new Promise(async function (resolve, reject) {

            var postURL = "api.example.com/" + infoPath;
            var data = { "value": newValue };
            var requestBody = data;

            var request = await sendXMLHTTPRequest("POST", postURL, APIKey, requestBody);

            request.onload = function () {
                resolve(true);
            }

            request.onerror = function () {
                reject(new Error("Error at postAPIInfo"));
            }
        })

    }


    /* sendXMLHTTPRequest() - helper function for sending XMLHTTPRequests
    *
    * Parameters:
    * {method} (string) - HTTP method (ex. "GET" or "PUT")
    * {URL} (string) - the URL path to send the request to
    * {APIKeyInput} - APIKey to use in request for credentials
    * 
    * Return:
    * {request} ( XMLHttpRequest object)
    *
    */
    async function sendXMLHTTPRequest ( method, URL, APIKeyInput, body ) {
        var request = new XMLHttpRequest();
        request.open(method, URL, true);

        //Send the proper header information along with the request
        request.setRequestHeader("api-key-credentials", APIKeyInput);

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

    /* public members */
    return {
        init: init,
        getAPIInfo: getAPIInfo,
        setAPIInfo: setAPIInfo,
        isActive: isActive
    }
}
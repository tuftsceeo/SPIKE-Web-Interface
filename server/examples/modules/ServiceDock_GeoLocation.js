class servicegeolocation extends HTMLElement {

    constructor() {
        super();

        this.active = false; // whether the service was activated
        this.service = new Service_GeoLocation(); // instantiate a service object ( one object per button )

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

        var imageRelPath = "./modules/views/way.png" // relative to the document in which a servicespike is created ( NOT this file )
        var length = 50; // for width and height of button
        var buttonBackgroundColor = "#A2E1EF" // background color of the button
        var buttonStyle = "width:" + length + "px; height:" + length + "px; background: url(" + imageRelPath + ") no-repeat; background-size: 40px 40px; background-color:" + buttonBackgroundColor
            + "; border: none; background-position: center; cursor: pointer; border-radius: 10px; position: relative; margin: 4px 0px; "
        button.setAttribute("style", buttonStyle);

        /* status circle definition and CSS */

        var status = document.createElement("div");
        status.setAttribute("class", "status");
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

        // when ServiceDock button is double clicked
        this.addEventListener("click", async function () {
            // check active flag so once activated, the service doesnt reinit
            if (!this.active) {
                console.log("activating service");
                var initSuccessful = await this.service.init();
                if (initSuccessful) {
                    this.active = true;
                    status.style.backgroundColor = "green";
                }
                // var checkConnection = setInterval(function () {
                //     if (!service.isActive()) {
                //         clearInterval(checkConnection);
                //         status.style.backgroundColor = "red";
                //     }
                // }, 5000)
            }
        });


        shadow.appendChild(wrapper);
        button.appendChild(status);
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
window.customElements.define('service-geolocation', servicegeolocation);


/*
Project Name: SPIKE Prime Web Interface
File name: Service_GeoLocation.js
Author: Jeremy Jung
Last update: 7/22/20
Description: GeoLocation service library. Gets the location of the device.
Credits/inspirations:
    https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API
History:
    Created by Jeremy on 7/20/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
Note:
needs to be used with a navigator
*/


function Service_GeoLocation() {

    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    var latitude;
    var longitude;
    var id; // id for watchPosition
    var watchPositionActive = false;

    var funcAtInit = undefined; // function to call after init

    //////////////////////////////////////////
    //                                      //
    //           Public Functions           //
    //                                      //
    //////////////////////////////////////////

    /* init() - initialize Service_GeoLocation()
    *
    * Effect:
    * - defines global variable latitude, longitude for use in other functions
    *
    * Returns:
    * {boolean} - true if initialization was successful, else an error
    *
    * Note:
    * This function needs to be executed first before executing any other public functions of this class
    */
    async function init() {
        if ('geolocation' in navigator) {
            /* geolocation is available */
            await setCurrentPosition();

            await sleep(2000); // wait for service to init

            // call funcAtInit if defined
            if (funcAtInit !== undefined) {
                funcAtInit();
            }

            return true;
        } else {
            /* geolocation IS NOT available */
            throw Error("geolocation is not available on this browser or device");
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

    /* getPosition() - get the latitude and longitude in an array
    */
    async function getPosition() {
        await setCurrentPosition();
        var result = [latitude, longitude];
        return result;
    }

    /* getLatitude() - get the latitude
    */
    async function getLatitude() {
        await setCurrentPosition();
        var result = latitude;
        return result;
    }

    /* getLatitude() - get the longitude
    */
    async function getLongitude() {
        await setCurrentPosition();
        var result = longitude;
        return result;
    }

    /* watchPosition() - register a handler function that will be called automatically 
    *                   each time the position of the device changes. 
    * Parameters:
    * {success} - a success handler (function)
    * {error} - an error handler (function)
    * {optionsInput} - object containing option properties to pass as a parameter of watchposition
    *  ex)
    *   const options = {
    *       enableHighAccuracy: false,  boolean taht indicates the application would like to receive the best possible results
    *       timeout: 5000,              a positive long value representing the maximum length of time (in milliseconds)
    *       maximumAge: 0               a positive long value indicating the maximum age in milliseconds of a possible cached 
    *                                           position that is acceptable to return
    *   }
    *  
    * Effect:
    * - defines global variable id
    * - may clear the previous watchPosition (if the function executed previously)
    *
    * Note:
    * https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions for details
    */
    async function watchPosition(success, error, optionsInput) {
        var options = optionsInput;

        if (watchPositionActive) {
            await clearWatchPosition(id);
            id = navigator.geolocation.watchPosition(success, error, options);
        }
        else {
            id = navigator.geolocation.watchPosition(success, error, options);
        }
        watchPositionActive = true;
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

    /* setCurrentPosition() - set the current position of device to latitude, longitude global vars
    */
    async function setCurrentPosition() {
        navigator.geolocation.getCurrentPosition((position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        });
    }

    /* clearWatchPosition() - clear a watchPosition
    *
    * Parameters:
    * OPTIONAL {idInput} - id for watchPosition to clear
    *
    * Effect:
    * - may clear the previous watchPosition
    */
    async function clearWatchPosition(idInput) {
        if (idInput !== undefined) {
            navigator.geolocation.clearWatch(idInput);
        } else {
            navigator.geolocation.clearWatch(id);
        }
    }

    return {
        init: init,
        getPosition: getPosition,
        getLatitude: getLatitude,
        getLongitude: getLongitude,
        watchPosition: watchPosition,
        executeAfterInit: executeAfterInit
    }


}
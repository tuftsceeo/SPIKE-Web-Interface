/*
Project Name: SPIKE Prime Web Interface
File name: Service_GeoLocation.js
Author: Jeremy Jung
Last update: 7/20/20
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
            return true;
        } else {
            /* geolocation IS NOT available */
            throw Error("geolocation is not available on this browser or device");
        }
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

        if ( watchPositionActive ) {
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
        if ( idInput !== undefined ) {
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
        watchPosition: watchPosition
    }


}
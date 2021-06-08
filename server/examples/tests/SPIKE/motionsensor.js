//                                      //
//         Motion Sensor Tests          //
//                                      //

var testWaitForNewGesture = document.getElementById("waitForNewGesture");
var testWasGesture = document.getElementById("wasGesture");
var testWaitForNewOri = document.getElementById("waitForNewOri");
var testGetAngles = document.getElementById("getAngles");
var testGetGesture = document.getElementById("getGesture");
var testGetOrientation = document.getElementById("getOrientation");
var testResetYawSource = document.getElementById("resetYawSource");
var testResetYaw = document.getElementById("resetYaw");

/* wait for new gesture */
testWaitForNewGesture.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON motionSensor.wait_for_new_gesture(callback) #######")
    console.log("Test: Program will detect any gesture. ");

    var hub = new mySPIKE.PrimeHub();
    hub.motion_sensor.wait_for_new_gesture( function (gesture) {

        console.log(">>> in callback")

        console.log(">>> gesture argument in callback, ", gesture);

        if (gesture == "tapped") {
            console.log(">>> tapped event handler");
            console.log("###### ENDING UNIT TEST ON motionSensor.wait_for_new_gesture(callback) #######")
        }
        else if (gesture == "doubletapped") {
            console.log(">>> doubletapped event handler");
            console.log("###### ENDING UNIT TEST ON motionSensor.wait_for_new_gesture(callback) #######")
        }
        else if (gesture == "freefall") {
            console.log(">>> freefall event handler");
            console.log("###### ENDING UNIT TEST ON motionSensor.wait_for_new_gesture(callback) #######")
        }
        else if (gesture == "shaken") {
            console.log(">>> shaken event handler");
            console.log("###### ENDING UNIT TEST ON motionSensor.wait_for_new_gesture(callback) #######")
        }
        else {
            console.error("DID NOT PASS wait_for_new_gesture(callback) TEST")
            console.log("###### ENDING UNIT TEST ON motionSensor.wait_for_new_gesture(callback) #######")
        }
    })
})

/* was gesture */
testWasGesture.addEventListener("click", async function () {

    console.log("###### BEGINNING UNIT TEST ON motion_sensor.was_gesture('doubletapped') #######")
    console.log("Test (First Time): Sees if 'tapped' gesture has occurred since the beginning of the program (for the first use).");
    console.log("Test (Second Time): Sees if 'tapped' gesture has occurred since the last execution of was_gesture().");
    var hub = new mySPIKE.PrimeHub();
    if (hub.motion_sensor.was_gesture("tapped")) {
        console.log(">>> tapped did occur");
    } else {
        console.log(">>> tapped did NOT occur ");
    }

    console.log("###### ENDING UNIT TEST ON motion_sensor.was_gesture('doubletapped') #######")
})

/* wait for new orientation */
testWaitForNewOri.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON motion_sensor.wait_for_new_orientation(callback) #######")
    console.log("Test (First Time): the returned orientation will be the current orientation.");
    console.log("Test (Second Time): Sees if there's a new orientation different from the previously detected");
    var hub = new mySPIKE.PrimeHub();
    console.log(">>> change the orientation of the hub");
    hub.motion_sensor.wait_for_new_orientation(function (orientation) {

        if (orientation) {
            console.log(">>> the orientation is ", orientation);
            console.log("###### ENDING UNIT TEST ON motionSensor.wait_for_new_orientation(callback)#######");
        }
    })

})

testGetAngles.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON motion_sensor get_***_angle() functions #######");
    var hub = new mySPIKE.PrimeHub();
    console.log("yaw angle: ", hub.motion_sensor.get_yaw_angle());
    console.log("pitch angle: ", hub.motion_sensor.get_pitch_angle());
    console.log("roll angle: ", hub.motion_sensor.get_roll_angle());
    console.log("###### ENDING UNIT TEST ON get_***_angle() functions #######");
})


testGetGesture.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON motion_sensor.get_gesture() #######");
    var hub = new mySPIKE.PrimeHub();
    var gesture = hub.motion_sensor.get_gesture();
    console.log("gesture: ", gesture);
    
    console.log("###### ENDING UNIT TEST ON motion_sensor.get_gesture() #######");
})


testGetOrientation.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON motion_sensor.get_orientation() #######");

    var hub = new mySPIKE.PrimeHub();
    var orientation = hub.motion_sensor.get_orientation();
    console.log("orientation: ", orientation);

    console.log("###### ENDING UNIT TEST ON motion_sensor.get_orientation() #######");
})


testResetYaw.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON motion_sensor.reset_yaw_angle() #######");
    console.log("Test: reset yaw angle and get yaw angle after 3 seconds");

    var hub = new mySPIKE.PrimeHub();
    hub.motion_sensor.reset_yaw_angle();

    setTimeout(function () {
        console.log(hub.motion_sensor.get_yaw_angle());
    }, 3000);

    console.log("###### ENDING UNIT TEST ON motion_sensor.reset_yaw_angle() #######");
})

testResetYawSource.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST (logic) ON motion_sensor.reset_yaw_angle() #######");
    /* randomly generate current position */
    // get the digits
    var currPos = Math.floor(Math.random() * 1000);
    while (currPos > 180) {
        currPos = Math.floor(Math.random() * 1000)
    }

    // get the sign
    var negativeOrPositive = Math.random() * 1000;
    if (negativeOrPositive > 500) {
        var currPos = currPos * -1;
    }

    console.log("current position: ", currPos)

    /* randomly generate new origin */
    // get the digits
    var newOrigin = Math.floor(Math.random() * 1000);
    while (newOrigin > 180) {
        newOrigin = Math.floor(Math.random() * 1000);
    }

    // get the sign
    var negativeOrPositive = Math.random() * 1000;
    if (negativeOrPositive > 500) {
        var newOrigin = newOrigin * -1;
    }

    console.log("new origin", newOrigin);

    var difference = currPos - newOrigin;


    if (-180 > difference && difference > -360) {
        var newPos = Math.abs(difference) % 180;
    }
    else if (180 < difference && difference < 360) {
        var newPos = (Math.abs(difference) % 180) * -1;
    }
    else {
        console.log("difference", difference);
        var newPos = difference % 360;
    }

    console.log("translated position: ", newPos);
})


//                                      //
//               Misc Tests             //
//                                      //

var testSetHubOrientation = document.getElementById("setHubOri");
testSetHubOrientation.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON setHubOrientation() #######");
    console.log("Test: Move the hub to an orientation and press the test button to see if the measured orientation is correct");
    mySPIKE.setHubOrientation();
    console.log("###### ENDING UNIT TEST ON setHubOrientation() #######");
})

var testUJSONRPC = document.getElementById("testUJSONRPC");
testUJSONRPC.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON UJSONRPC.displayText #######");
    console.log("Expected Result: 'hello' on hub display");
    mySPIKE.UJSONRPC.displayText("hello");
    console.log("###### ENDING UNIT TEST ON UJSONRPC.displayText #######");
})

var testNew = document.getElementById("testNewKeyword");
testNew.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON new keywords with Motor connected to port A #######");
    console.log("Test: see the difference of using 'new' keyword on SPIKE device object instantiations");
    console.log("motor1 = mySPIKE.Motor('A')")
    console.log("motor2 = new mySPIKE.Motor('A')")
    console.log("motor1's default speed changed to 50")
    var motor1 = mySPIKE.Motor("A");
    motor1.set_default_speed(50);

    var motor1_defaultSpeed = motor1.get_default_speed();

    console.log("motor1's default_speed, ", motor1_defaultSpeed);

    var motor2 = new mySPIKE.Motor("A");
    var motor2_defaultSpeed = motor2.get_default_speed();
    console.log("motor2's default_speed, ", motor2_defaultSpeed);

    console.log("###### ENDING UNIT TEST ON new keywords with Motor connected to port A #######");
});

var testNew1 = document.getElementById("testNewKeyword1");
testNew1.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON two Motor objects declared without 'new' keywords #######");
    console.log("Test: see if Motor objects defined without 'new' keywords cause issues");
    console.log("motor1 = mySPIKE.Motor('A')")
    console.log("motor2 = mySPIKE.Motor('B')")
    console.log("motor1's default speed changed to 50")
    var motor1 = mySPIKE.Motor("A");
    motor1.set_default_speed(50);
    var motor1_defaultSpeed = motor1.get_default_speed();
    console.log("motor1's default_speed, ", motor1_defaultSpeed);
    var motor2 = mySPIKE.Motor("B");
    var motor2_defaultSpeed = motor2.get_default_speed();
    console.log("motor2's default_speed, ", motor2_defaultSpeed);
    console.log("###### ENDING UNIT TEST ON two Motor objects declared without 'new' keywords #######");
});

var testGetMotors = document.getElementById("testGetMotors");
testGetMotors.addEventListener("click", async function () {
    var motors = await mySPIKE.getMotors();
    console.log(motors);
})

/* test mySPIKE.getMotorPorts() */
var test_getMotorPorts = document.getElementById("getMotorPorts");
test_getMotorPorts.addEventListener("click", async function () {
    var motorPorts = await mySPIKE.getMotorPorts();
    console.log(motorPorts);
})

var testUJSONRPCdisplayClear = document.getElementById("displayClear")
testUJSONRPCdisplayClear.addEventListener("click", function () {
    mySPIKE.UJSONRPC.displayClear();

})
var testUJSONRPCdisplaySetPixel = document.getElementById("displaySetPixel")
testUJSONRPCdisplaySetPixel.addEventListener("click", function () {
    mySPIKE.UJSONRPC.displaySetPixel(0, 0, 100);

})
var testUJSONRPCdisplayText = document.getElementById("displayText")
testUJSONRPCdisplayText.addEventListener("click", function () {
    mySPIKE.UJSONRPC.displayText('hello');

})
var testUJSONRPCmotorGoRelPos = document.getElementById("motorGoRelPos")
testUJSONRPCmotorGoRelPos.addEventListener("click", function () {
    mySPIKE.UJSONRPC.motorGoRelPos('A', 180, 100, true, true)

})
var testUJSONRPCmotorGoRelPos1 = document.getElementById("motorGoRelPos1")
testUJSONRPCmotorGoRelPos1.addEventListener("click", function () {
    mySPIKE.UJSONRPC.motorGoRelPos('A', 180, 100, false, true)

})
var testUJSONRPCmotorGoRelPos2 = document.getElementById("motorGoRelPos2")
testUJSONRPCmotorGoRelPos2.addEventListener("click", function () {
    mySPIKE.UJSONRPC.motorGoRelPos('A', 180, 100, true, false)

})
var testUJSONRPCmotorGoRelPos3 = document.getElementById("motorGoRelPos3")
testUJSONRPCmotorGoRelPos3.addEventListener("click", function () {
    mySPIKE.UJSONRPC.motorGoRelPos('A', 180, 100, false, false)

})
var testUJSONRPCmotorPwm = document.getElementById("motorPwm")
testUJSONRPCmotorPwm.addEventListener("click", function () {

    mySPIKE.UJSONRPC.motorPwm('A', 100, true)
})
var testUJSONRPCmotorPwm1 = document.getElementById("motorPwm1")
testUJSONRPCmotorPwm1.addEventListener("click", function () {
    mySPIKE.UJSONRPC.motorPwm('A', 100, false)

})
var testUJSONRPCmotorRunDegrees = document.getElementById("motorRunDegrees")
testUJSONRPCmotorRunDegrees.addEventListener("click", function () {
    mySPIKE.UJSONRPC.motorRunDegrees('A', 400, 100, true, true)
})
var testUJSONRPCmotorRunDegrees1 = document.getElementById("motorRunDegrees1")
testUJSONRPCmotorRunDegrees1.addEventListener("click", function () {
    mySPIKE.UJSONRPC.motorRunDegrees('A', 400, 100, false, true)

})
var testUJSONRPCmotorRunDegrees2 = document.getElementById("motorRunDegrees2")
testUJSONRPCmotorRunDegrees2.addEventListener("click", function () {
    mySPIKE.UJSONRPC.motorRunDegrees('A', 400, 100, true, false)
})
var testUJSONRPCmotorRunDegrees3 = document.getElementById("motorRunDegrees3")
testUJSONRPCmotorRunDegrees3.addEventListener("click", function () {
    mySPIKE.UJSONRPC.motorRunDegrees('A', 400, 100, false, false)

})
var testUJSONRPCmotorRunTimed = document.getElementById("motorRunTimed")
testUJSONRPCmotorRunTimed.addEventListener("click", function () {
    mySPIKE.UJSONRPC.motorRunTimed('A', 3000, 100, true, true)

})
var testUJSONRPCmotorRunTimed1 = document.getElementById("motorRunTimed1")
testUJSONRPCmotorRunTimed1.addEventListener("click", function () {
    mySPIKE.UJSONRPC.motorRunTimed('A', 3000, 100, false, true)

})
var testUJSONRPCmotorRunTimed2 = document.getElementById("motorRunTimed2")
testUJSONRPCmotorRunTimed2.addEventListener("click", function () {
    mySPIKE.UJSONRPC.motorRunTimed('A', 3000, 100, true, false)

})
var testUJSONRPCmotorRunTimed3 = document.getElementById("motorRunTimed3")
testUJSONRPCmotorRunTimed3.addEventListener("click", function () {
    mySPIKE.UJSONRPC.motorRunTimed('A', 3000, 100, false, false)

})
var testUJSONRPCmotorStart = document.getElementById("motorStart")
testUJSONRPCmotorStart.addEventListener("click", function () {
    mySPIKE.UJSONRPC.motorStart('A', 100, true)

})
var testUJSONRPCmotorStart1 = document.getElementById("motorStart1")
testUJSONRPCmotorStart1.addEventListener("click", function () {
    mySPIKE.UJSONRPC.motorStart('A', 100, false)

})
var testUJSONRPCmoveTankDegrees = document.getElementById("moveTankDegrees")
testUJSONRPCmoveTankDegrees.addEventListener("click", function () {
    mySPIKE.UJSONRPC.moveTankDegrees(300, 100, 100, 'A', 'B', true)

})
var testUJSONRPCmoveTankDegrees1 = document.getElementById("moveTankDegrees1")
testUJSONRPCmoveTankDegrees1.addEventListener("click", function () {
    mySPIKE.UJSONRPC.moveTankDegrees(300, 100, 100, 'A', 'B', false)

})
var testUJSONRPCmoveTankPowers = document.getElementById("moveTankPowers")
testUJSONRPCmoveTankPowers.addEventListener("click", function () {
    mySPIKE.UJSONRPC.moveTankPowers(100, 100, 'A', 'B')

})
var testUJSONRPCmoveTankSpeeds = document.getElementById("moveTankSpeeds")
testUJSONRPCmoveTankSpeeds.addEventListener("click", function () {
    mySPIKE.UJSONRPC.moveTankSpeeds(100, 100, 'A', 'B')

})
var testUJSONRPCmoveTankTime = document.getElementById("moveTankTime")
testUJSONRPCmoveTankTime.addEventListener("click", function () {
    mySPIKE.UJSONRPC.moveTankTime(3000, 100, 100, 'A', 'B', true)

})
var testUJSONRPCmoveTankTime1 = document.getElementById("moveTankTime1")
testUJSONRPCmoveTankTime1.addEventListener("click", function () {
    mySPIKE.UJSONRPC.moveTankTime(3000, 100, 100, 'A', 'B', false)
})
var testUJSONRPCsoundBeep = document.getElementById("soundBeep")
testUJSONRPCsoundBeep.addEventListener("click", function () {
    mySPIKE.UJSONRPC.soundBeep(100, 300)

})
var testUJSONRPCsoundStop = document.getElementById("soundStop")
testUJSONRPCsoundStop.addEventListener("click", function () {
    mySPIKE.UJSONRPC.soundStop()
})

var testRandom = document.getElementById("random");
testRandom.addEventListener("click", function () {
    mySPIKE.UJSONRPC.centerButtonLightUp(13);
})
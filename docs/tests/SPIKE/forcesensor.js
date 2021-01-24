//                                      //
//        Force Sensor Tests            //
//                                      //

var testGetForceNewton = document.getElementById("getForceNewton");
testGetForceNewton.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON ForceSensor.get_force_newton() #######");
    console.log("Test: Execute this test while pressing on a Force Sensor connected at port A");
    var force_sensor = new mySPIKE.ForceSensor("A");
    var newtons = force_sensor.get_force_newton();
    console.log("Force in Newtons: ", newtons);
    console.log("Expected Result: [1 to 10] reading on force on sensor");
    console.log("###### ENDING UNIT TEST ON ForceSensor.get_force_newton() #######");
})

var testGetForcePercentage = document.getElementById("getForcePercentage");
testGetForcePercentage.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON ForceSensor.get_force_percentage() #######");
    console.log("Test: Execute this test while pressing on a Force Sensor connected at port A");
    var force_sensor = new mySPIKE.ForceSensor("A");
    var percentage = force_sensor.get_force_percentage();
    console.log("Force in percentage: ", percentage);
    console.log("Expected Result: [0 to 100] reading of force on sensor");
    console.log("###### ENDING UNIT TEST ON ForceSensor.get_force_percentage() #######");
})

var testForceSensorIsPressed = document.getElementById("forceSensorIsPressed");
testForceSensorIsPressed.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON ForceSensor.is_pressed() #######");
    console.log("Test: Execute this test while pressing on a Force Sensor connected at port A");
    var force_sensor = new mySPIKE.ForceSensor("A");
    var isPressed = force_sensor.is_pressed();
    console.log("is pressed? ", isPressed);
    console.log("Expected Result: get true when force sensor is pressed, false otherwise");
    console.log("###### ENDING UNIT TEST ON ForceSensor.is_pressed() #######");
})

var testForceSensorWaitUntilPress = document.getElementById("forceSensorWaitUntilPress");
testForceSensorWaitUntilPress.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON ForceSensor.wait_until_pressed() #######");
    console.log("Test: Execute this test and then after some time press on a Force Sensor connected at port A");
    var force_sensor = new mySPIKE.ForceSensor("A");
    force_sensor.wait_until_pressed(function () {
        console.log("Force Sensor press event handler");
        console.log("###### ENDING UNIT TEST ON ForceSensor.wait_until_pressed() #######");
    })
    console.log("Expected Result: when pressed, console logs 'Force Sensor press event handler'");
})

var testForceSensorWaitUntilRelease = document.getElementById("forceSensorWaitUntilRelease");
testForceSensorWaitUntilRelease.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON ForceSensor.wait_until_released() #######");
    console.log("Test: Execute this test and then after some time press on a Force Sensor connected at port A and then release it");
    var force_sensor = new mySPIKE.ForceSensor("A");
    force_sensor.wait_until_released(function () {
        console.log("Force Sensor release event handler");
        console.log("###### ENDING UNIT TEST ON ForceSensor.wait_until_released() #######");
    })
    console.log("Expected Result: when force sensor RELEASED, console logs 'Force Sensor release event handler'");
})
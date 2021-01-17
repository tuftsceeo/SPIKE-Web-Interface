
//                                      //
//          ultrasonic Tests            //
//                                      //

var testLightUp = document.getElementById("lightup");
var testGetDistanceCM = document.getElementById("testGetDistanceCM");
var testGetDistanceIN = document.getElementById("testGetDistanceIN");
var testWaitForDistanceFartherThan = document.getElementById("testWaitForDistanceFartherThan");
var testWaitForDistanceCloserThan = document.getElementById("testWaitForDistanceCloserThan");

testLightUp.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON DistanceSensor('A').light_up(100,100,100,100) #######");
    console.log("Test: Connect DistanceSensor to port A and start the test");
    var distance_sensor = new mySPIKE.DistanceSensor("A");
    distance_sensor.light_up(100, 100, 100, 100);
    console.log("###### ENDING UNIT TEST ON DistanceSensor('A').light_up(100,100,100,100) #######");
})

testGetDistanceCM.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON DistanceSensor('A').get_distance_cm() #######");
    console.log("Test: Connect DistanceSensor to port A and start the test");

    var distance_sensor = new mySPIKE.DistanceSensor("A");

    console.log("Distance at port A: ", distance_sensor.get_distance_cm())

    console.log("###### ENDING UNIT TEST ON DistanceSensor('A').get_distance_cm() #######");
})

testGetDistanceIN.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON DistanceSensor('A').get_distance_inches() #######");
    console.log("Test: Connect DistanceSensor to port A and start the test");

    var distance_sensor = new mySPIKE.DistanceSensor("A");

    console.log("Distance at port A in inches: ", distance_sensor.get_distance_inches())

    console.log("###### ENDING UNIT TEST ON DistanceSensor('A').get_distance_inches() #######");
})

testWaitForDistanceCloserThan.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON DistanceSensor('A').wait_for_distance_closer_than() #######");
    console.log("Test: Connect DistanceSensor to port A and start the test");

    var distance_sensor = new mySPIKE.DistanceSensor("A");

    distance_sensor.wait_for_distance_closer_than(10, "cm", function () {
        console.log("Distance at port A is closer than 10 CM");
    })

    console.log("###### ENDING UNIT TEST ON DistanceSensor('A').wait_for_distance_closer_than() #######");
})

testWaitForDistanceFartherThan.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON DistanceSensor('A').wait_for_distance_farther_than() #######");
    console.log("Test: Connect DistanceSensor to port A and start the test");

    var distance_sensor = new mySPIKE.DistanceSensor("A");

    distance_sensor.wait_for_distance_farther_than(10, "cm", function () {
        console.log("Distance at port A is farther than 10 CM");
    })

    console.log("###### ENDING UNIT TEST ON DistanceSensor('A').wait_for_distance_farther_than() #######");
})
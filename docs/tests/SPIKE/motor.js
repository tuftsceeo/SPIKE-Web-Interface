//                                      //
//              Motor Tests             //
//                                      //

var testMotorDegreesCounted = document.getElementById("motordeg");
var testMotorDegreesCounted1 = document.getElementById("motordeg1");
var testMotorDegreesCountedCB = document.getElementById("motordegcb");
var testMotorDegreesCounted1CB = document.getElementById("motordeg1cb");
var testDegreesCounted = document.getElementById("degreesCounted");
var testMotorStartAtPower = document.getElementById("motorStartAtPower");
var testMotorPosition = document.getElementById("motorPosition");

testMotorDegreesCounted.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON motor.run_to_degrees_counted(200, 50) WITH STALL DETECTION #######");
    var motor = new mySPIKE.Motor("A");

    motor.set_stall_detection(true);

    motor.run_to_degrees_counted(200, 50);

    console.log("###### BEGINNING UNIT TEST ON motor.run_to_degrees_counted(200, 50) WITH STALL DETECTION #######");
})

testMotorDegreesCounted1.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON motor.run_to_degrees_counted(200, 50) NO STALL DETECTION #######");

    var motor = new mySPIKE.Motor("A");

    motor.set_stall_detection(false);

    motor.run_to_degrees_counted(200, 50);

    console.log("###### BEGINNING UNIT TEST ON motor.run_to_degrees_counted(200, 50) NO STALL DETECTION #######");
})

testMotorDegreesCountedCB.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON motor.run_to_degrees_counted(200, 50, cb) WITH STALL DETECTION #######");
    var motor = new mySPIKE.Motor("A");

    motor.set_stall_detection(true);

    motor.run_to_degrees_counted(200, 50, function (result) {
        console.log("MOTOR STOPPED WITH RESULT: ", result)
    });
    console.log("###### BEGINNING UNIT TEST ON motor.run_to_degrees_counted(200, 50, cb) WITH STALL DETECTION #######");
})

testMotorDegreesCounted1CB.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON motor.run_to_degrees_counted(200, 50, cb) NO STALL DETECTION #######");

    var motor = new mySPIKE.Motor("A");

    motor.set_stall_detection(false);

    motor.run_to_degrees_counted(200, 50, function (result) {
        console.log("MOTOR STOPPED WITH RESULT: ", result)
    });

    console.log("###### BEGINNING UNIT TEST ON motor.run_to_degrees_counted(200, 50, cb) NO STALL DETECTION #######");
})


/* go to rel pos without stall detection */
testMotorStartAtPower.addEventListener("click", async function () {

    var motor = new mySPIKE.Motor("A");
    motor.run_for_degrees(30, 100);

})

testDegreesCounted.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON motor.get_degrees_counted() #######");
    var motor = new mySPIKE.Motor("A");
    console.log(motor.get_degrees_counted())
    console.log("###### ENDING UNIT TEST ON motor.get_degrees_counted() #######");
})

testMotorPosition.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON motor.get_position() #######");
    var motor = new mySPIKE.Motor("A");
    console.log(motor.get_position())
    console.log("###### ENDING UNIT TEST ON motor.get_position() #######");
})
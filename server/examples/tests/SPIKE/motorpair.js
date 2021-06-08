//                                      //
//           MotorPair Tests            //
//                                      //

var testMotorPairStop = document.getElementById("motorPairStop");
var testMotorPairMove = document.getElementById("motorPairMove");
var testMotorPairStart = document.getElementById("motorPairStart");
var testMotorPairMoveLeft = document.getElementById("motorPairMoveLeft");
var testMotorPairMoveRight = document.getElementById("motorPairMoveRight");
var testMotorPairMoveLeftSlightly = document.getElementById("motorPairMoveLeftSlightly");
var testMotorPairMoveRightSlightly = document.getElementById("motorPairMoveRightSlightly");
var testMotorPairStartTank = document.getElementById("motorPairStartTank");
var testMotorPairStop = document.getElementById("motorPairStop");

testMotorPairStop.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON motorPair.stop() #######");
    console.log("Test: stop the motorPair of motors connected to A and B");

    var motorPair = new mySPIKE.MotorPair("A", "B");

    motorPair.stop();

    console.log("###### ENDING UNIT TEST ON motorPair.stop() #######");
})

testMotorPairMove.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON motorPair.move(100, 'cm', 0, 100) #######");
    console.log("Test: moving the driving base 100 cm with 0 steering on speed of 100");

    var motorPair = new mySPIKE.MotorPair("A", "B");

    motorPair.move(100, "cm", 0, 100);

    console.log("Expected result: base moving forward without turning and stopping at 100 cm");

    console.log("###### ENDING UNIT TEST ON motorPair.move() #######");
})

testMotorPairStart.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON motorPair.start() #######");
    console.log(" Test: moving the drving base with 0 steering on speed of 100");

    var motorPair = new mySPIKE.MotorPair("A", "B");

    motorPair.start(0, 100);

    console.log("Expected result: base moving forward without turning");

    console.log("###### ENDING UNIT TEST ON motorPair.start() #######");
})

testMotorPairMoveLeft.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON motorPair.move(100, 'cm', -100, 100) #######");

    var motorPair = new mySPIKE.MotorPair("A", "B");

    motorPair.move(100, "cm", -100, 100);

    console.log("Expected result: driving base moving left and stopping")
    console.log("###### ENDING UNIT TEST ON motorPair.move(100, 'cm', -100, 100) #######");

})

testMotorPairMoveRight.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON motorPair.move(100, 'cm', 100, 100) #######");

    var motorPair = new mySPIKE.MotorPair("A", "B");

    motorPair.move(100, "cm", 100, 100);

    console.log("Expected result: driving base moving right and stopping")
    console.log("###### ENDING UNIT TEST ON motorPair.move(100, 'cm', 100, 100) #######");
})


testMotorPairMoveLeftSlightly.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON motorPair.move(100, 'cm', -50, 100) #######");

    var motorPair = new mySPIKE.MotorPair("A", "B");

    motorPair.move(100, "cm", -50, 100);

    console.log("Expected result: driving base moving left SLIGHTLY and stopping")
    console.log("###### ENDING UNIT TEST ON motorPair.move(100, 'cm', -50, 100) #######");

})

testMotorPairMoveRightSlightly.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON motorPair.move(100, 'cm', 50, 100) #######");

    var motorPair = new mySPIKE.MotorPair("A", "B");

    motorPair.move(100, "cm", 50, 100);

    console.log("Expected result: driving base moving right SLIGHTLY and stopping")
    console.log("###### ENDING UNIT TEST ON motorPair.move(100, 'cm', 50, 100) #######");
})

testMotorPairStartTank.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON motorPair.start_tank(10,10) #######");
    var motorPair = new mySPIKE.MotorPair("A", "B");

    motorPair.start_tank(50,50);
    console.log("###### ENDING UNIT TEST ON motorPair.start_tank(10,10) #######");
})
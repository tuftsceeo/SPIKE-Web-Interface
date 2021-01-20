
//                                      //
//         ColorSensor Tests            //
//                                      //

var testGetColor = document.getElementById("getColor");
var testWaitUntilColor = document.getElementById("waitUntilColor");
var testWaitForNewColor = document.getElementById("waitForNewColor");

testGetColor.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON ColorSensor('A').get_color() #######");
    console.log("Test: Connect color sensor to port A and start the test");
    var color_sensor = mySPIKE.ColorSensor("A");
    var color = await color_sensor.get_color();
    console.log("Detected color: ", color);

    console.log("###### ENDING UNIT TEST ON ColorSensor('A').get_color() #######");
})

testWaitUntilColor.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON ColorSensor('A').wait_until_color('YELLOW') #######");
    console.log("Test: Connect color sensor to port A and start the test");
    var color_sensor = mySPIKE.ColorSensor("A");
    color_sensor.wait_until_color('yellow', function () {
        console.log("Detected yellow");
    });

    console.log("###### ENDING UNIT TEST ON ColorSensor('A').wait_until_color('YELLOW') #######");
})

testWaitForNewColor.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON ColorSensor('A').wait_until_color('YELLOW') #######");
    console.log("Test: Connect color sensor to port A and start the test");
    var color_sensor = mySPIKE.ColorSensor("A");

    color_sensor.wait_for_new_color(function (color) {
        console.log("New color detected: ", color);
    })

    console.log("###### ENDING UNIT TEST ON ColorSensor('A').wait_until_color('YELLOW') #######");
})

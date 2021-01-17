
//                                      //
//              Button Tests            //
//                                      //


var testButtonIsPressed = document.getElementById("buttonIsPress");
testButtonIsPressed.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON button.is_pressed() #######");
    console.log("Test: start the test pressing either the left button or the right button");


    var left_button = hub.left_button;
    var right_button = hub.right_button;

    if (left_button.is_pressed()) {
        console.log("left_button is pressed");
    }

    if (right_button.is_pressed()) {
        console.log("right_button is pressed");
    }
    console.log("Expected result: the console logs whether the button is pressed");
    console.log("###### ENDING UNIT TEST ON button.is_pressed() #######");
})

var testButtonWasPressed = document.getElementById("buttonWasPress");
testButtonWasPressed.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON button.was_pressed() #######");
    console.log("Test: press either the left button or the right button. Then, after some time start the test.");


    var left_button = hub.left_button;
    var right_button = hub.right_button;

    if (left_button.was_pressed()) {
        console.log("left_button was pressed");
    }

    if (right_button.was_pressed()) {
        console.log("right_button was pressed");
    }
    console.log("Expected result: console identifies previous button presses")
    console.log("###### ENDING UNIT TEST ON button.was_pressed() #######");
})

var testButtonWaitPressed = document.getElementById("buttonWaitPress");
testButtonWaitPressed.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON button.wait_until_pressed() #######");
    console.log("Test: Start the test. Then, after some time press either left button or right button");


    var left_button = hub.left_button;
    var right_button = hub.right_button;

    console.log("waiting for left_button press")
    left_button.wait_until_pressed(function () {
        console.log("left_button was pressed");
        console.log("###### ENDING UNIT TEST ON button.wait_until_pressed() #######");
    })

    console.log("waiting for right_button press")
    right_button.wait_until_pressed(function () {
        console.log("right_button was pressed");
        console.log("###### ENDING UNIT TEST ON button.wait_until_pressed() #######");
    })

    console.log("Expected result: console identifies button presses")
})


var testButtonWaitRelease = document.getElementById("buttonWaitRelease");
testButtonWaitRelease.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON button.wait_until_released() #######");
    console.log("Test: Start the test. Then, after some time press either left button or right button and release them");


    var left_button = hub.left_button;
    var right_button = hub.right_button;

    console.log("waiting for left_button release")
    left_button.wait_until_released(function () {
        console.log("left_button was released");
        console.log("###### ENDING UNIT TEST ON button.wait_until_released() #######");
    })

    console.log("waiting for right_button release")
    right_button.wait_until_released(function () {
        console.log("right_button was released");
        console.log("###### ENDING UNIT TEST ON button.wait_until_released() #######");
    })

    console.log("Expected result: console identifies button releases")
})
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Creates a new unit test object and starts necessary checks before beginning
// the testing proccess
window.onload = () => {
    let spikeService = document.getElementById("service_spike");
    spikeService.innerHTML = `<service-spike align = center id = "serviceDock"></service-spike>`;
    //@ts-ignore
    let activeService = document.getElementById("serviceDock").getService();
    activeService.executeAfterInit(function () {
        return __awaiter(this, void 0, void 0, function* () {
            const test = new UnitTest(activeService);
            prepareSPIKE(test);
        });
    });
};
let prepareSPIKE = (test) => {
    // Before tests start, check if devices are in correct ports
    let portCheckInterval = setInterval(() => {
        if (portChecks(test)) {
            $("#startTests").removeClass("hidden");
        }
        else {
            $("#startTests").addClass("hidden");
        }
    }, 1000);
    // Listener to trigger testing process when ports are setup
    $("#startTests").on("click", () => {
        runAutomaticTests(test);
    });
};
// Checks if all ports have correct sensors attached, 
// displays appropriate data to the user in a table
let portChecks = (test) => {
    let allSuccessful = true;
    let tests = [["MED_MOTORS", UnitTest.MED_MOTORS_PORTS[0]],
        ["MED_MOTORS", UnitTest.MED_MOTORS_PORTS[1]],
        ["LARGE_MOTORS", UnitTest.LARGE_MOTORS_PORTS[0]],
        ["DIST_SENSOR", UnitTest.DIST_SENSOR_PORTS[0]],
        ["FORCE_SENSOR", UnitTest.FORCE_SENSOR_PORTS[0]],
        ["COLOR_SENSOR", UnitTest.COLOR_SENSOR_PORTS[0]]];
    tests.forEach(element => {
        if (test.checkPort(element[0], element[1])) {
            detectedDeviceSuccess(element[1]);
        }
        else {
            detectedDeviceFailure(element[1]);
            allSuccessful = false;
        }
    });
    return allSuccessful;
};
// Displays nondetected sensor in setup table
let detectedDeviceSuccess = (portLetter) => {
    let portID = "#" + portLetter + "PortCheck";
    $(portID).html("Detected");
    $(portID).removeClass("text-red-500");
    $(portID).addClass("text-green-500");
};
// Displays nondetected sensor in setup table
let detectedDeviceFailure = (portLetter) => {
    let portID = "#" + portLetter + "PortCheck";
    $(portID).html("Not Detected");
    $(portID).addClass("text-red-500");
    $(portID).removeClass("text-green-500");
};
// Initiates the automatic testing process
let runAutomaticTests = (test) => __awaiter(this, void 0, void 0, function* () {
    $("#startTests").remove();
    let testingChart = createTestingChart("TestRows");
    test.initializeTest();
    yield runMotorTests(test);
    yield runMotorPairTests(test);
    // Responsiveness test
    if ($(window).width() > 900) {
        createNewTestCols(testingChart);
    }
    runDistanceSensorTests(test);
    runForceSensorTests(test);
    runColorSensorTests(test);
    yield runHubTests(test);
    createStartManualTestsButton(test);
});
let createTestingChart = (idName) => {
    $("#pre-test-content").remove();
    let newChart = document.createElement('table');
    $(newChart).html('<thead><tr><th class="border">Test Name</th><th class="border">Status</th><th class="border">Errors</th></tr></thead><tbody id="' + idName + '"></tbody>');
    $(newChart).attr("class", "table-auto text-center justify-center border mx-auto mb-8");
    let firstCol = document.createElement('div');
    $(firstCol).append(newChart);
    $(firstCol).appendTo("#col1");
    return newChart;
};
// Displays test results to the user
let addNewRow = (testResults, id) => {
    let newRow = document.createElement('tr');
    $(newRow).attr("class", "border border-black p-2 m-2");
    let col1 = document.createElement('td');
    let col2 = document.createElement('td');
    let col3 = document.createElement('td');
    $(col1).html(testResults[0]);
    if (testResults[1] == "Passed")
        $(col1).attr("class", "border border-black text-green-500");
    else if (testResults[1] == "Failed")
        $(col1).attr("class", "border border-black text-red-500");
    $(col2).attr("class", "border border-black");
    $(col2).html(testResults[1]);
    $(col3).attr("class", "border border-black");
    $(col3).html(testResults[2]);
    $(newRow).append(col1);
    $(newRow).append(col2);
    $(newRow).append(col3);
    $(id).append(newRow);
};
let createNewTestCols = (chartDiv) => {
    $("#tests-content").addClass("grid grid-cols-3");
    let col2 = document.createElement('div');
    let col3 = document.createElement('div');
    $(col2).append(createTestingChart("TestRows2"));
    $(col3).append(createTestingChart("TestRows3"));
    $(col2).appendTo("#col2");
    $(col3).appendTo("#col3");
};
let runMotorTests = (test) => __awaiter(this, void 0, void 0, function* () {
    let tableId = "#TestRows";
    addNewRow(["Motor Tests:", "", ""], tableId);
    addNewRow(yield test.startMotorTest(), tableId);
    addNewRow(yield test.stopMotorTest(), tableId);
    addNewRow(yield test.getSpeedTest(), tableId);
    addNewRow(yield test.getPositionTest(), tableId);
    addNewRow(yield test.getDegreesCountedTest(), tableId);
    addNewRow(yield test.getMotorPower(), tableId);
    addNewRow(test.defaultSpeedTest(), tableId);
    addNewRow(test.setStallDetectionTest(), tableId);
    addNewRow(yield test.getDegreesCountedTest(), tableId);
    addNewRow(yield test.startAtPowerTest(), tableId);
    addNewRow(yield test.runForSecondsTest(), tableId);
    addNewRow(yield test.runForDegreesTest(), tableId);
});
let runMotorPairTests = (test) => __awaiter(this, void 0, void 0, function* () {
    let tableId = "#TestRows";
    addNewRow(["MotorPair Tests: ", "", ""], tableId);
    addNewRow(test.setMotorRotationTest(), tableId);
    addNewRow(yield test.startTankTest(), tableId);
    addNewRow(yield test.startTankPowerTest(), tableId);
    addNewRow(yield test.stopMotorPairTest(), tableId);
});
let runDistanceSensorTests = (test) => {
    let tableId = "#TestRows2";
    if ($(window).width() <= 900) {
        tableId = "#TestRows";
    }
    addNewRow(["Distance Sensor Tests:", "", ""], tableId);
    addNewRow(test.getDistCmTest(), tableId);
    addNewRow(test.getDistInchesTest(), tableId);
    addNewRow(test.getDistPercentTest(), tableId);
    addNewRow(test.lightUpTest(), tableId);
    addNewRow(test.lightUpAllTest(), tableId);
};
let runForceSensorTests = (test) => {
    let tableId = "#TestRows2";
    if ($(window).width() <= 900) {
        tableId = "#TestRows";
    }
    addNewRow(["Force Sensor Tests:", "", ""], tableId);
    addNewRow(test.forceSensorPressedTest(), tableId);
    addNewRow(test.getForceNTest(), tableId);
    addNewRow(test.getForcePercent(), tableId);
};
let runColorSensorTests = (test) => {
    let tableId = "#TestRows2";
    if ($(window).width() <= 900) {
        tableId = "#TestRows";
    }
    addNewRow(["Color Sensor Tests:", "", ""], tableId);
    addNewRow(test.testGetColor(), tableId);
    addNewRow(test.testReflectedLight(), tableId);
    addNewRow(test.testGetRed(), tableId);
    addNewRow(test.testGetGreen(), tableId);
    addNewRow(test.testGetBlue(), tableId);
};
let runHubTests = (test) => __awaiter(this, void 0, void 0, function* () {
    let tableId = "#TestRows3";
    if ($(window).width() <= 900) {
        tableId = "#TestRows";
    }
    addNewRow(["Hub Tests:", "", ""], tableId);
    /*
    Status light not an attribute of primehub, not implemented correctly
    addNewRow(test.testStatusLightColor(), tableId);
    addNewRow(test.turnOffStatusLight(), tableId);
    */
    addNewRow(test.testSetPixel(), tableId);
    addNewRow(test.testWriteLM(), tableId);
    addNewRow(test.turnOffLightMatrix(), tableId);
    addNewRow(yield test.testBeep(), tableId);
    addNewRow(yield test.testStartBeep(), tableId);
    addNewRow(test.setVolumeTest(), tableId);
    addNewRow(test.getVolumeTest(), tableId);
    addNewRow(test.testStopBeep(), tableId);
    addNewRow(test.testLeftButtonIsPressed(), tableId);
    addNewRow(test.testLeftButtonWasPressed(), tableId);
    addNewRow(test.testRightButtonWasPressed(), tableId);
    addNewRow(test.testRightButtonIsPressed(), tableId);
    addNewRow(test.testWasGesture(), tableId);
    addNewRow(test.testGetAngles(), tableId);
    addNewRow(test.testGetAccelerations(), tableId);
    addNewRow(test.getGestureTest(), tableId);
    addNewRow(test.getOrientationTest(), tableId);
});
let createStartManualTestsButton = (test) => {
    let manualTestsButton = document.createElement("div");
    const buttonHTML = `<div class="w-1/2 justify-center mx-auto text-center mb-4">
        <button id="manualTests" class="bg-blue-500 text-white shadow-lg rounded-lg py-1 px-3 transition ease-in-out delay-75 hover:scale-110 hover:bg-blue-800 duration-300">Start Manual Tests</button>
    </div>`;
    $(manualTestsButton).html(buttonHTML);
    $("#manualTestButton").append(manualTestsButton);
    $(manualTestsButton).on("click", () => {
        twoColManualReformat();
        runManualTests(test);
    });
};
let twoColManualReformat = () => {
    $("#tests-content").removeClass('grid-cols-3');
    $("#tests-content").addClass('grid-cols-2');
    $("#tests-content").addClass('grid');
    $("#col3").remove();
    const instructionsBoxHTML = `<h1 class='text-center text-xl'>Test Instructions:</h1><p id='instructions' class='text-center my-4'></p> 
    <div class='grid grid-cols-2'>
        <div class="w-1/2 justify-center mx-auto text-center mb-4">
            <button id="testPassed" class=" hidden bg-green-500 text-white shadow-lg rounded-lg py-1 px-3 transition ease-in-out delay-75 hover:scale-110 hover:bg-green-700 duration-300">Test Passed</button>
        </div>
        <div class="w-1/2 justify-center mx-auto text-center mb-4">
            <button id="testFailed" class="hidden bg-red-500 text-white shadow-lg rounded-lg py-1 px-3 transition ease-in-out delay-75 hover:scale-110 hover:bg-red-700 duration-300">Test Failed</button>
        </div>
    </div>`;
    $("#col2").html(instructionsBoxHTML);
    $("#col1").html(createTestingChart("ManualTestRows"));
    $("#manualTestButton").remove();
};
let runManualTests = (test) => __awaiter(this, void 0, void 0, function* () {
    let tableId = "#ManualTestRows";
    addNewRow(test.getHubNameTest(), tableId);
    addNewRow(test.isActiveTest(), tableId);
    addNewRow(yield rebootHubTest(test), tableId);
    addNewRow(yield tapHubTest(test), tableId);
    addNewRow(yield doubleTapHubTest(test), tableId);
    addNewRow(yield shakeTest(test), tableId);
    addNewRow(yield dropTest(test), tableId);
    addNewRow(yield readWriteCodeTest(test), tableId);
    addNewRow(yield stopProgramExecutionTest(test), tableId);
    addNewRow(yield pressRightButtonTest(test), tableId);
    addNewRow(yield releaseRightButtonTest(test), tableId);
    addNewRow(yield pressLeftButtonTest(test), tableId);
    addNewRow(yield releaseLeftButtonTest(test), tableId);
    addNewRow(yield pressForceSensorTest(test), tableId);
    addNewRow(yield releaseForceSensorTest(test), tableId);
    addNewRow(yield waitForNewColorTest(test), tableId);
    addNewRow(yield detectColorTest(test), tableId);
    addNewRow(yield distCloserThan(test), tableId);
    addNewRow(yield distFartherThan(test), tableId);
    confirmTest("Tests Complete", false, false);
});
let confirmTest = (instructions, confirmation, buttons) => __awaiter(this, void 0, void 0, function* () {
    let testPassed = false;
    let testFailed = false;
    if (buttons) {
        $("#testPassed").removeClass("hidden");
        $("#testFailed").removeClass("hidden");
        $("#testPassed").on("click", () => {
            testPassed = true;
        });
        $("#testFailed").on("click", () => {
            testFailed = true;
        });
    }
    if (confirmation) {
        $("#testPassed").removeClass("hidden");
        $("#testPassed").html("Ready to Test");
        $("#testPassed").on("click", () => {
            testPassed = true;
        });
    }
    $("#instructions").html(instructions);
    let determineResult = () => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(resolve, 200));
        if (testPassed) {
            return true;
        }
        else if (testFailed) {
            return false;
        }
        return determineResult();
    });
    if (buttons || confirmation)
        return yield determineResult();
    else
        return null;
});
let resetInstructions = () => {
    $("#instructions").html("");
    $("#testPassed").addClass("hidden");
    $("#testPassed").html("Test Passed");
    $("#testFailed").addClass("hidden");
};
let rebootHubTest = (test) => __awaiter(this, void 0, void 0, function* () {
    test.rebootHubTest();
    let passedTest = yield confirmTest("Hub Reboot: Was the hub successfully rebooted?", false, true);
    resetInstructions();
    if (passedTest)
        return (["rebootHub()", "Passed", "-"]);
    return (["rebootHub()", "Failed", "Unable to reboot hub"]);
});
let tapHubTest = (test) => __awaiter(this, void 0, void 0, function* () {
    yield confirmTest("Single Tap Detection: Tap the SPIKE Prime Once", true, false);
    resetInstructions();
    return test.hubTappedTest();
});
let doubleTapHubTest = (test) => __awaiter(this, void 0, void 0, function* () {
    yield confirmTest("Double Tap Detection: Tap the SPIKE Prime Twice (quickly)", true, false);
    resetInstructions();
    return test.hubDoubleTappedTest();
});
let shakeTest = (test) => __awaiter(this, void 0, void 0, function* () {
    yield confirmTest("Shake Test: Shake the hub (without tapping or dropping it)", true, false);
    resetInstructions();
    return test.shakeTest();
});
let dropTest = (test) => __awaiter(this, void 0, void 0, function* () {
    yield confirmTest("Drop Test: **Gently** drop the SPIKE Prime", true, false);
    resetInstructions();
    return test.dropTest();
});
let readWriteCodeTest = (test) => __awaiter(this, void 0, void 0, function* () {
    test.writeAndRunCodeTest();
    let passedTest = yield confirmTest("Wait for the SPIKE Prime to run a program. Does the hub display a happy face?", false, true);
    resetInstructions();
    if (passedTest)
        return (["Read/Write Test", "Passed", "-"]);
    return (["Read/Write Test", "Failed", "Read console for possible error log"]);
});
let stopProgramExecutionTest = (test) => __awaiter(this, void 0, void 0, function* () {
    test.stopExecutionTest();
    let passedTest = yield confirmTest("Did the current program (smiley face) stop executing?", false, true);
    resetInstructions();
    if (passedTest)
        return (["stopCurrentCommand()", "Passed", "-"]);
    return (["stopCurrentCommand()", "Failed", "Read console for possible error log"]);
});
let pressLeftButtonTest = (test) => __awaiter(this, void 0, void 0, function* () {
    confirmTest("Press the **left** button on the hub", false, false);
    return (yield test.leftWaitUntilPressedTest());
});
let releaseLeftButtonTest = (test) => __awaiter(this, void 0, void 0, function* () {
    confirmTest("Press and release the **left** button on the hub *again*", false, false);
    return (yield test.leftWaitUntilReleasedTest());
});
let pressRightButtonTest = (test) => __awaiter(this, void 0, void 0, function* () {
    confirmTest("Press the **right** button on the hub", false, false);
    return (yield test.rightWaitUntilPressedTest());
});
let releaseRightButtonTest = (test) => __awaiter(this, void 0, void 0, function* () {
    confirmTest("Press and release the **right** button on the hub *again*", false, false);
    return (yield test.rightWaitUntilReleasedTest());
});
let pressForceSensorTest = (test) => __awaiter(this, void 0, void 0, function* () {
    confirmTest("Press and hold down the force sensor", false, false);
    return (yield test.forceSensorWaitUntilPressed());
});
let releaseForceSensorTest = (test) => __awaiter(this, void 0, void 0, function* () {
    confirmTest("Release the force sensor", false, false);
    return (yield test.forceSensorWaitUntilReleased());
});
let waitForNewColorTest = (test) => __awaiter(this, void 0, void 0, function* () {
    confirmTest("Move the color sensor to detect a new color", false, false);
    return (yield test.newColorTest());
});
let detectColorTest = (test) => __awaiter(this, void 0, void 0, function* () {
    confirmTest("Move the color sensor to detect the color black", false, false);
    return (yield test.detectColorTest('black'));
});
let distCloserThan = (test) => __awaiter(this, void 0, void 0, function* () {
    confirmTest("Move the distance sensor close to an object (within 10cm)", false, false);
    return (yield test.distanceCloserThanTest());
});
let distFartherThan = (test) => __awaiter(this, void 0, void 0, function* () {
    confirmTest("Move the distance sensor somewhat close to an object (20-50 cm)", false, false);
    return (yield test.distanceFartherThanTest());
});

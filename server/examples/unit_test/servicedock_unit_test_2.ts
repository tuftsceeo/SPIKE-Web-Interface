
// Creates a new unit test object and starts necessary checks before beginning
// the testing proccess
window.onload = () => {
    let spikeService = document.getElementById("service_spike"); 
    spikeService.innerHTML = `<service-spike align = center id = "serviceDock"></service-spike>`;
    //@ts-ignore
    let activeService = document.getElementById("serviceDock").getService();
    activeService.executeAfterInit(async function() {
        const test:UnitTest = new UnitTest(activeService);
        prepareSPIKE(test);
    })
    
}

let prepareSPIKE = (test:UnitTest) => {
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
    })
}

// Checks if all ports have correct sensors attached, 
// displays appropriate data to the user in a table
let portChecks = (test:UnitTest) => {
    let allSuccessful:boolean = true;
    let tests:Array<Array<string>> = 
        [["MED_MOTORS", UnitTest.MED_MOTORS_PORTS[0]], 
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
}

// Displays nondetected sensor in setup table
let detectedDeviceSuccess = (portLetter: string) => {
    let portID:string = "#" + portLetter + "PortCheck";
    $(portID).html("Detected");
    $(portID).removeClass("text-red-500");
    $(portID).addClass("text-green-500");
}

// Displays nondetected sensor in setup table
let detectedDeviceFailure = (portLetter: string) => {
    let portID:string = "#" + portLetter + "PortCheck";
    $(portID).html("Not Detected");
    $(portID).addClass("text-red-500");
    $(portID).removeClass("text-green-500");
}

// Initiates the automatic testing process
let runAutomaticTests = async (test:UnitTest) => {
    let testingChart = createTestingChart("TestRows");
    test.initializeTest();
    
    await runMotorTests(test);
    await runMotorPairTests(test);

    // Responsiveness test
    if ($(window).width() > 900) {
        createNewTestCols(testingChart);
    }

    runDistanceSensorTests(test);
    runForceSensorTests(test);
    runColorSensorTests(test);
    await runHubTests(test);
    
    createStartManualTestsButton(test);
}

let createTestingChart = (idName:string) => {
    $("#pre-test-content").remove();
    let newChart = document.createElement('table');
    $(newChart).html('<thead><tr><th class="border">Test Name</th><th class="border">Status</th><th class="border">Errors</th></tr></thead><tbody id="' + idName + '"></tbody>');
    $(newChart).attr("class", "table-auto text-center justify-center border mx-auto mb-8");

    let firstCol = document.createElement('div');
    $(firstCol).append(newChart)

    $(firstCol).appendTo("#col1");

    return newChart;
}

// Displays test results to the user
let addNewRow = (testResults:Array<string>, id:string) => {
    let newRow = document.createElement('tr');
    $(newRow).attr("class", "border p-2 m-2");
    let col1 = document.createElement('td');
    let col2 = document.createElement('td');
    let col3 = document.createElement('td');
    $(col1).html(testResults[0]);
    if (testResults[1] == "Passed")
        $(col1).attr("class", "border text-green-500");
    else if (testResults[1] == "Failed")
        $(col1).attr("class", "border text-red-500");
    $(col2).attr("class", "border");
    $(col2).html(testResults[1]);
    $(col3).attr("class", "border");
    $(col3).html(testResults[2]);

    $(newRow).append(col1);
    $(newRow).append(col2);
    $(newRow).append(col3);

    $(id).append(newRow);

}

let createNewTestCols = (chartDiv: HTMLElement) => {
    $("#tests-content").addClass("grid grid-cols-3");
    let col2 = document.createElement('div');
    let col3 = document.createElement('div');
    $(col2).append(createTestingChart("TestRows2"));
    $(col3).append(createTestingChart("TestRows3"));
    $(col2).appendTo("#col2");
    $(col3).appendTo("#col3");
}

let runMotorTests = async (test:UnitTest) => {
    let tableId = "#TestRows";
    addNewRow(["Motor Tests:", "", ""], tableId);
    addNewRow(await test.startMotorTest(), tableId);
    addNewRow(await test.stopMotorTest(), tableId);
    addNewRow(await test.getSpeedTest(), tableId);
    addNewRow(await test.getPositionTest(), tableId);
    addNewRow(await test.getDegreesCountedTest(), tableId);
    addNewRow(await test.getMotorPower(), tableId);
    addNewRow(test.defaultSpeedTest(), tableId);
    addNewRow(test.setStallDetectionTest(), tableId);
    addNewRow(await test.getDegreesCountedTest(), tableId);
    addNewRow(await test.startAtPowerTest(), tableId);
    addNewRow(await test.runForSecondsTest(), tableId);
    addNewRow(await test.runForDegreesTest(), tableId);
} 

let runMotorPairTests = async (test:UnitTest) => {
    let tableId = "#TestRows";
    addNewRow(["MotorPair Tests: ", "", ""], tableId);
    addNewRow(test.setMotorRotationTest(), tableId);
    addNewRow(await test.startTankTest(), tableId);
    addNewRow(await test.startTankPowerTest(), tableId);
    addNewRow(await test.stopMotorPairTest(), tableId);
}

let runDistanceSensorTests = (test:UnitTest) => {
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
}

let runForceSensorTests = (test:UnitTest) => {
    let tableId = "#TestRows2";
    if ($(window).width() <= 900) {
        tableId = "#TestRows";
    }
    addNewRow(["Force Sensor Tests:", "", ""], tableId);
    addNewRow(test.forceSensorPressedTest(), tableId);
    addNewRow(test.getForceNTest(), tableId);
    addNewRow(test.getForcePercent(), tableId);

}

let runColorSensorTests = (test:UnitTest) => { 
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
}

let runHubTests = async (test:UnitTest) => {
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
    addNewRow(await test.testBeep(), tableId);
    addNewRow(await test.testStartBeep(), tableId);
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
}

let createStartManualTestsButton = (test:UnitTest) => {
    let manualTestsButton = document.createElement("div");

    const buttonHTML = 
    `<div class="w-1/2 justify-center mx-auto text-center mb-4">
        <button id="manualTests" class="bg-blue-500 text-white shadow-lg rounded-lg py-1 px-3 transition ease-in-out delay-75 hover:scale-110 hover:bg-blue-800 duration-300">Start Manual Tests</button>
    </div>`;

    $(manualTestsButton).html(buttonHTML);
    $("#manualTestButton").append(manualTestsButton);
    $(manualTestsButton).on("click", () => {
        twoColManualReformat();
        runManualTests(test);
    })
} 

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
    </div>`
    $("#col2").html(instructionsBoxHTML)
    $("#col1").html(createTestingChart("ManualTestRows"));
    $("#manualTestButton").remove();
}

let runManualTests = async (test:UnitTest) => {
    let tableId = "#ManualTestRows"
    
    addNewRow(test.getHubNameTest(), tableId);
    addNewRow(test.isActiveTest(), tableId);
    addNewRow(await rebootHubTest(test), tableId);
    addNewRow(await tapHubTest(test), tableId);
    addNewRow(await doubleTapHubTest(test), tableId);
    addNewRow(await shakeTest(test), tableId);
    addNewRow(await dropTest(test), tableId);
    addNewRow(await readWriteCodeTest(test), tableId);
    addNewRow(await stopProgramExecutionTest(test), tableId);
    addNewRow(await pressRightButtonTest(test), tableId);
    addNewRow(await releaseRightButtonTest(test), tableId);
    addNewRow(await pressLeftButtonTest(test), tableId);
    addNewRow(await releaseLeftButtonTest(test), tableId);
    addNewRow(await pressForceSensorTest(test), tableId);
    addNewRow(await releaseForceSensorTest(test), tableId);
    addNewRow(await waitForNewColorTest(test), tableId);
    addNewRow(await detectColorTest(test), tableId);
    addNewRow(await distCloserThan(test), tableId);
    addNewRow(await distFartherThan(test), tableId);
    confirmTest("Tests Complete", false, false);
}

let confirmTest = async (instructions:string, confirmation:boolean, buttons:boolean) => {
    let testPassed:boolean = false;
    let testFailed:boolean = false;

    if (buttons) {
        $("#testPassed").removeClass("hidden");
        $("#testFailed").removeClass("hidden");
        $("#testPassed").on("click", () =>{
            testPassed = true;
        });
        $("#testFailed").on("click", () =>{
            testFailed = true;
        });
    }

    if (confirmation) {
        $("#testPassed").removeClass("hidden");
        $("#testPassed").html("Ready to Test");
        $("#testPassed").on("click", () =>{
            testPassed = true;
        });
    }
    
    $("#instructions").html(instructions);
    

    let determineResult = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));

        if (testPassed) {
            return true;
        }
        else if (testFailed) {
            return false;
        }
        return determineResult(); 
    }

    if (buttons || confirmation)
        return await determineResult();
    else
        return null;

}

let resetInstructions = () => {
    $("#instructions").html("");
    $("#testPassed").addClass("hidden");
    $("#testPassed").html("Test Passed");
    $("#testFailed").addClass("hidden");
}

let rebootHubTest = async (test:UnitTest) => {
    test.rebootHubTest();
    let passedTest:boolean = await confirmTest("Hub Reboot: Was the hub successfully rebooted?", false, true);
    resetInstructions();
    if (passedTest)
        return(["rebootHub()", "Passed", "-"])
    return (["rebootHub()", "Failed", "Unable to reboot hub"])
}

let tapHubTest = async (test:UnitTest) => {
    await confirmTest("Single Tap Detection: Tap the SPIKE Prime Once", true, false);
    resetInstructions();
    return test.hubTappedTest();
}

let doubleTapHubTest = async (test:UnitTest) => {
    await confirmTest("Double Tap Detection: Tap the SPIKE Prime Twice (quickly)", true, false);
    resetInstructions();
    return test.hubDoubleTappedTest();
}

let shakeTest = async (test:UnitTest) => {
    await confirmTest("Shake Test: Shake the hub (without tapping or dropping it)", true, false);
    resetInstructions();
    return test.shakeTest();
}

let dropTest = async (test:UnitTest) => {
    await confirmTest("Drop Test: **Gently** drop the SPIKE Prime", true, false);
    resetInstructions();
    return test.dropTest();
}

let readWriteCodeTest = async (test:UnitTest) => {
    test.writeAndRunCodeTest();
    let passedTest:boolean = await confirmTest("Wait for the SPIKE Prime to run a program. Does the hub display a happy face?", false, true);
    resetInstructions();
    if (passedTest)
        return (["Read/Write Test", "Passed", "-"]);
    return (["Read/Write Test", "Failed", "Read console for possible error log"]);
}

let stopProgramExecutionTest = async (test:UnitTest) => {
    test.stopExecutionTest();
    let passedTest:boolean = await confirmTest("Did the current program (smiley face) stop executing?", false, true);
    resetInstructions();
    if (passedTest)
        return (["stopCurrentCommand()", "Passed", "-"]);
    return (["stopCurrentCommand()", "Failed", "Read console for possible error log"]);
}

let pressLeftButtonTest = async (test:UnitTest) => {
    confirmTest("Press the **left** button on the hub", false, false);
    return (await test.leftWaitUntilPressedTest());
}

let releaseLeftButtonTest = async (test:UnitTest) => {
    confirmTest("Press and release the **left** button on the hub *again*", false, false);
    return (await test.leftWaitUntilReleasedTest());
}

let pressRightButtonTest = async (test:UnitTest) => {
    confirmTest("Press the **right** button on the hub", false, false);
    return (await test.rightWaitUntilPressedTest());
}

let releaseRightButtonTest = async (test:UnitTest) => {
    confirmTest("Press and release the **right** button on the hub *again*", false, false);
    return (await test.rightWaitUntilReleasedTest());
}

let pressForceSensorTest = async (test:UnitTest) => {
    confirmTest("Press and hold down the force sensor", false, false);
    return (await test.forceSensorWaitUntilPressed());
}

let releaseForceSensorTest = async (test:UnitTest) => {
    confirmTest("Release the force sensor", false, false);
    return (await test.forceSensorWaitUntilReleased());
}

let waitForNewColorTest = async (test:UnitTest) => {
    confirmTest("Move the color sensor to detect a new color", false, false);
    return (await test.newColorTest());
}

let detectColorTest = async (test:UnitTest) => {
    confirmTest("Move the color sensor to detect the color black", false, false);
    return (await test.detectColorTest('black'));
}

let distCloserThan = async (test:UnitTest) => {
    confirmTest("Move the distance sensor close to an object (within 10cm)", false, false);
    return (await test.distanceCloserThanTest());
}

let distFartherThan = async (test:UnitTest) => {
    confirmTest("Move the distance sensor somewhat close to an object (20-50 cm)", false, false);
    return (await test.distanceFartherThanTest());
}

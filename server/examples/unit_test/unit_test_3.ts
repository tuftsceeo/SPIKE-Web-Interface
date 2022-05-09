let initWindowHTML = 
`<p class="text-center text-lg" id="window-title">Hello!</p>
<p class="text-center text-md my-2" id="window-subtitle">What would you like to test?</p>


<button type="button" class="flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-900 hover:bg-gray-200 my-2 " id="test-everything" aria-expanded="true" aria-haspopup="true">
    Everything
</button>

<div class="grid grid-cols-2 mb-2">
    <div class="mx-2">
        <button type="button" class="flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-900 hover:bg-gray-200 my-2 " id="test-motors" aria-expanded="true" aria-haspopup="true">
            Motors
        </button>
        <button type="button" class="flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-900 hover:bg-gray-200 my-2" id="test-hub" aria-expanded="true" aria-haspopup="true">
            Prime Hub
        </button>
    </div>

    <div class="mx-2">
        <button type="button" class="flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-900 hover:bg-gray-200 my-2" id="test-sensors" aria-expanded="true" aria-haspopup="true">
            Sensors
        </button>
        <button type="button" class="flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-900 hover:bg-gray-200 my-2" id="test-misc" aria-expanded="true" aria-haspopup="true">
            Misc.
        </button>
    </div>

</div>

<hr class>

<p class="text-sm mx-2 my-4 text-center">Shortcut: Enter name of test to run</p>

<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="test-name-box" type="text" placeholder="Test Name">

<div class="mx-12">
    <button type="button" class="flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-900 hover:bg-gray-200 my-2" id="run-test" aria-expanded="true" aria-haspopup="true">
        Run Test
    </button>
</div>`;

window.onload = () => {
    showMainMenu();

    /*
    //@ts-ignore
    let serviceSPIKE = document.getElementById("service_spike").getService();

    serviceSPIKE.executeAfterInit(async function() {
        let test: MotorTest = new MotorTest(new serviceSPIKE.Motor("A"), new serviceSPIKE.Motor("B"), new serviceSPIKE.Motor("C"), 1000, (newTest) => { console.log(newTest.name) });

        let test2: MotorPairTest = new MotorPairTest(3000, new serviceSPIKE.MotorPair("A", "B"));

        let lol = await test.runAllMotorTests();
        console.log(lol);
    })

    serviceSPIKE.init();
    */
}


// When a main menu button is selected the window updates with a list of
// tests that the user can select from
let displayTests = (title:string, testNames:string[], devices:string[][]) => {
    $("#window").html('<p class="text-center text-lg py-4" id="window-title">' + title + '</p>');

    for (let i = 0; i < testNames.length; i++) {
        let newTestButton = document.createElement('button');
        $(newTestButton).addClass("flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-900 hover:bg-gray-200 my-2");
        $(newTestButton).html(testNames[i]);
        $(newTestButton).attr("id", testNames[i]);
        $(newTestButton).on("click", () => {
            setupWindow(testNames[i], devices[i]);
        })
        $("#window").append(newTestButton);
    }

    addBackButton("#window");



}

let addBackButton = (location: string) => {
    let backButton = document.createElement('button');
    $(backButton).addClass("flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-400 my-4 w-1/2 text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-900");
    $(backButton).html("Back");
    $(backButton).attr("id", "Back");
    $(location).append(backButton);

    $(backButton).on("click", () => {
        showMainMenu();
    });
}

// Displays the main menu and removes all current content in the window
let showMainMenu = () => {
    $("#window").html(initWindowHTML);

    // Initialize onclick events
    $("#test-everything").on("click", () => {
        testEverything();
    });
    $("#test-motors").on("click", () => {
        testMotorsWindow();
    });
    $("#test-hub").on("click", () => {
        testHubWindow();
    });
    $("#test-misc").on("click", () => {
        testMiscWindow();
    });
    $("#test-sensors").on("click", () => {
        testSensorsWindow();
    });
}

let testEverything = () => {
    setupWindow("Run All Tests", ["Motors", "MotorPair", "DistanceSensor", "ForceSensor", "ColorSensor"]);
}

// Window functions are used to generate menus when the user clicks on
// a test category on the main menu
let testMotorsWindow = () => {
    let testNames:string[] = ["All Motor & Motor Pair Tests", "All Motor Tests", "All Motor Pair Tests"];
    let devices:string[][] = 
        [["Motors", "MotorPair"], ["Motors"], ["MotorPair"]];
    displayTests("Motor + MotorPair Tests", testNames, devices);
}

let testHubWindow = () => {
    let testNames:string[] = ["All Hub Tests"];
    displayTests("Prime Hub Tests", testNames, [[]]);
}

let testMiscWindow = () => {
    let testNames:string[] = ["All Misc. Tests"];
    displayTests("Other Tests", testNames, [[]]);
}

let testSensorsWindow = () => {
    let testNames:string[] = ["All Sensor Tests", "Distance Sensor Tests", "Force Sensor Tests", "Color Sensor Tests"];
    let devices:string[][] = 
        [["DistanceSensor", "ForceSensor", "ColorSensor"], ["DistanceSensor"], ["ForceSensor"], ["ColorSensor"]];
    displayTests("Sensor Tests", testNames, devices);
}

// Connect to Service Dock and check for correct ports when test is selected
let setupWindow = (testName: string, devices: string[]) => {

    // UI Changes
    $("#window").html('<p class="text-center text-lg pt-4" id="window-title">Testing Setup: ' + testName + '</p> <p class="text-center text-md py-2" id="window-title">Connect your SPIKE Prime below</p>');
    let newService = document.createElement("service-spike");
    $(newService).attr("id", "service-spike");
    $(newService).addClass("flex justify-center")
    $("#window").append(newService);

    addBackButton("#window");

    //@ts-ignore
    let activeService = document.getElementById("service-spike").getService();
    
    // Activate Tests once connected to ServiceDock
    activeService.executeAfterInit(async function() {
        let tests = new SPIKETests(activeService);


    })
    
}

// Creates new instances of required devices
let activateDevices = (spikeTests: SPIKETests, devices: string[]) => {

}




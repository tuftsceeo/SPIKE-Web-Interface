
class UnitTest {
    private service: any; // Should be an initialized SPIKE Service
    private motorA;
    private motorB;
    private motorC;
    private distSensor;
    private forceSensor;
    private colorSensor;
    private _timePerTest:number; //100 ms per test is default

    // Public constants
    public static get MED_MOTORS_PORTS() { return ['A', 'B'] };
    public static get LARGE_MOTORS_PORTS() { return ['C'] };
    public static get DIST_SENSOR_PORTS() { return ['D'] };
    public static get FORCE_SENSOR_PORTS() { return ['E'] };
    public static get COLOR_SENSOR_PORTS() { return ['F'] };

    constructor(initializedService) {
        this.service = initializedService;
        this._timePerTest = 500;
    }

    public get timePerTest() { 
        return this._timePerTest;
    }
    public set timePerTest(newTimePerTest: number) { 
        this._timePerTest = newTimePerTest; 
    }

    private async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public stopAllMotors() {
        this.motorA.stop();
        this.motorB.stop();
        this.motorC.stop();
    }

    public checkPort = (device:string, portLetter: string) => {
        let devicePorts;
        switch(device) {
            case "MED_MOTORS":
                devicePorts = this.service.getSmallMotorPorts();
                break;
            case "LARGE_MOTORS":
                devicePorts = this.service.getBigMotorPorts();
                break;
            case "DIST_SENSOR":
                devicePorts = this.service.getUltrasonicPorts();
                break;
            case "FORCE_SENSOR":
                devicePorts = this.service.getForcePorts();
                break;
            case "COLOR_SENSOR":
                devicePorts = this.service.getColorPorts();
                break;
            default:
                return false;
        }
        if (devicePorts.includes(portLetter)) {
            return true;
        }
        return false;
    }

    // Only initialize test after all devices are plugged into the correct 
    // ports!
    public initializeTest() {
        this.motorA = new this.service.Motor(UnitTest.MED_MOTORS_PORTS[0]);
        this.motorB = new this.service.Motor(UnitTest.MED_MOTORS_PORTS[1]);
        this.motorC = new this.service.Motor(UnitTest.LARGE_MOTORS_PORTS[0]);
        this.distSensor = 
            new this.service.DistanceSensor(UnitTest.DIST_SENSOR_PORTS[0]);
        this.forceSensor = 
            new this.service.ForceSensor(UnitTest.FORCE_SENSOR_PORTS[0]);
        this.colorSensor = 
            new this.service.ColorSensor(UnitTest.COLOR_SENSOR_PORTS[0]);
    }


    public async startMotorTest() {
        try {
            this.motorA.start(30);
            this.motorB.start(50);
            this.motorC.start(100);
            await this.sleep(this._timePerTest);
            return ["Start Motors", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["Start Motors", "Failed", "Start cannot be called"];
        }
    }

    public async stopMotorTest() {
        try {
            this.stopAllMotors();
            await this.sleep(this._timePerTest);
            return ["Stop Motors", "Passed", "-"]
            
        }
        catch (error) {
            console.error(error);
            return ["Stop Motors", "Failed", "Stop cannot be called"];
        }
    }

    public async getSpeedTest() {
        try {
            let speedA = 30;
            let speedB = 50;
            let speedC = 90;
            let errorMargin = 5;
            this.motorA.start(speedA);
            this.motorB.start(speedB);
            this.motorC.start(speedC);

            await this.sleep(this._timePerTest * 1.5);

            if (this.motorA.get_speed() > speedA + errorMargin || 
                this.motorA.get_speed < speedA - errorMargin) {
                throw "Motor A " + "Expected: " + speedA + " Recorded: " + this.motorA.get_speed();
            }
            if (this.motorB.get_speed() > speedB + errorMargin || 
                this.motorB.get_speed < speedB - errorMargin) {
                    throw "Motor B " + "Expected: " + speedB + " Recorded: " + this.motorB.get_speed();
            }
            if (this.motorC.get_speed() > speedC + errorMargin || 
                this.motorB.get_speed < speedC - errorMargin) {
                    throw "Motor C " + "Expected: " + speedC + " Recorded: " + this.motorC.get_speed();
            }

            this.stopAllMotors();

            return ["get_speed()", "Passed", "-"]
            
        }
        catch (error) {
            console.error(error);
            this.stopAllMotors();
            return ["get_speed()", "Failed", error];
        }
    }

    public async getPositionTest() {
        try {
            this.motorA.get_position();
            this.motorB.get_position();
            this.motorC.get_position();
            await this.sleep(this._timePerTest);
            return ["get_position()", "Passed", "-"]
            
        }
        catch (error) {
            console.error(error);
            return ["get_position()", "Failed", "Motor position cannot be called"];
        }
    }

    public async getDegreesCountedTest() {
        try {
            let degA = this.motorA.get_degrees_counted();
            let degB = this.motorB.get_degrees_counted();
            let degC = this.motorC.get_degrees_counted();
            await this.sleep(this._timePerTest);
            
            // NOTE: A should always be the slowest motor!
            // Change this condition if you changed the power values
            // in previous tests!
            console.log(degA);
            console.log(degB);
            console.log(degC);
            if (degA > degB || degB > degC) {
                throw "Inaccurate degree counts"
            }
            return ["get_degrees_counted()", "Passed", "-"]
            
        }
        catch (error) {
            console.error(error);
            return ["get_degrees_counted", "Failed", error];
        }
    }

    public async getMotorPower() {
        try {
            let powerA = 20;
            let powerB = 50;
            let powerC = 90;
            let errorMargin = 5;
            this.motorA.start(powerA);
            this.motorB.start(powerB);
            this.motorC.start(powerC);

            await this.sleep(this._timePerTest * 1.5);

            if (this.motorA.get_power() > powerA + errorMargin || 
                this.motorA.get_power < powerA - errorMargin) {
                throw "Motor A " + "Expected: " + powerA + " Recorded: " + this.motorA.get_power();
            }
            if (this.motorB.get_power() > powerB + errorMargin || 
                this.motorB.get_power < powerB - errorMargin) {
                    throw "Motor B " + "Expected: " + powerB + " Recorded: " + this.motorB.get_power();
            }
            if (this.motorC.get_power() > powerC + errorMargin || 
                this.motorB.get_power < powerC - errorMargin) {
                    throw "Motor C " + "Expected: " + powerC + " Recorded: " + this.motorC.get_power();
            }

            this.stopAllMotors();

            return ["get_power()", "Passed", "-"]
        
        }
        catch (error) {
            console.error(error);
            this.stopAllMotors();
            return ["get_power()", "Failed", error];
        }


    }

    public defaultSpeedTest() {
        try {
            this.motorA.get_default_speed();
            this.motorB.get_default_speed();
            this.motorC.get_default_speed();
            this.motorA.set_default_speed(25);
            this.motorB.set_default_speed(50);
            this.motorC.set_default_speed(75);
            if (this.motorA.get_default_speed() != 25)
                throw "Cannot set Motor A Def. Speed";
            if (this.motorB.get_default_speed() != 50)
                throw "Cannot set Motor B Def. Speed";
            if (this.motorC.get_default_speed() != 75)
                throw "Cannot set Motor C Def. Speed";
            return ["get/set_default_speed()", "Passed", "-"];
            
        }
        catch (error) {
            console.error(error);
            return ["get/set_default_speed()", "Failed", error];
        }
    }

    public setStallDetectionTest() {
        try {
            this.motorA.set_stall_detection(true);
            this.motorB.set_stall_detection(false);
            this.motorC.set_stall_detection(true);
            return ["set_stall_detection()", "Passed", "-"];
        }
        catch(error) {
            return ["set_stall_detection()", "Failed", "cannot set stall detection"];
        }
    }

    public async runDegreesCountedTest() {
        
        try {
            this.motorA.run_to_degrees_counted(90, 50);
            this.motorB.run_to_degrees_counted(45, 30);
            this.motorC.run_to_degrees_counted(120, 90);
            await this.sleep(this._timePerTest * 2);
            return ["run_to_degrees_counted()", "Passed", "-"];
        }
        catch (error) {
            return ["run_to_degrees_counted()", "Failed", "Cannot run motors to degrees specified"];
        }
        

        
    }

    public async startAtPowerTest() {
        try {
            this.motorA.start_at_power(20)
            this.motorB.start_at_power(40);
            this.motorC.start_at_power(60);
            await this.sleep(this._timePerTest);
            this.stopAllMotors();
            return ["run_to_degrees_counted()", "Passed", "-"];
            
        }
        catch (error) {
            this.stopAllMotors();
            return ["run_to_degrees_counted()", "Failed", "Cannot run motors to degrees specified"];
            
        }
    }

    public async runForSecondsTest() {
        try {
            this.motorA.run_for_seconds(this.timePerTest, 20);
            this.motorB.run_for_seconds(this.timePerTest*2, 40);
            this.motorC.run_for_seconds(this.timePerTest*3, 60);
            await this.sleep(this._timePerTest + 100);
            if (this.motorA.get_speed() > 1) {
                throw "Motor A not stopped on-time"
            }
            await this.sleep(this._timePerTest*2 + 100);
            if (this.motorB.get_speed() > 1) {
                throw "Motor B not stopped on-time"
            }
            await this.sleep(this._timePerTest*3 + 100);
            if (this.motorC.get_speed() > 1) {
                throw "Motor C not stopped on-time"
            }
            return ["run_for_seconds()", "Passed", "-"];

        }
        catch(error) {
            this.stopAllMotors();
            return ["run_for_seconds()", "Failed", error];
        }
    }

    

}



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
let runAutomaticTests = (test:UnitTest) => {
    let testingChart = createTestingChart();
    test.initializeTest();
    runMotorTests(test);
}

let createTestingChart = () => {
    $("#pre-test-content").remove();
    let newChart = document.createElement('table');
    $(newChart).html('<thead><tr><th class="border">Test Name</th><th class="border">Status</th><th class="border">Errors</th></tr></thead><tbody id="TestRows"></tbody>');
    $(newChart).attr("class", "table-auto text-center justify-center border mx-auto");

    document.body.append(newChart);
    return newChart;
}

// Displays test results to the user
let addNewRow = (testResults:Array<string>) => {
    let newRow = document.createElement('tr');
    $(newRow).attr("class", "border p-2 m-2");
    let col1 = document.createElement('td');
    let col2 = document.createElement('td');
    let col3 = document.createElement('td');
    $(col1).html(testResults[0]);
    console.log(testResults[0]);
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

    $("#TestRows").append(newRow);

}

let runMotorTests = async (test:UnitTest) => {
    addNewRow(await test.startMotorTest());
    addNewRow(await test.stopMotorTest());
    addNewRow(await test.getSpeedTest());
    addNewRow(await test.getPositionTest());
    addNewRow(await test.getDegreesCountedTest());
    addNewRow(await test.getMotorPower());
    addNewRow(test.defaultSpeedTest());
    addNewRow(test.setStallDetectionTest());
    addNewRow(await test.getDegreesCountedTest());
    addNewRow(await test.startAtPowerTest());
    addNewRow(await test.runForSecondsTest());
} 

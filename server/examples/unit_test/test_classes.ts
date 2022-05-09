/******************************************************************************
**                             test_classes.ts                               **
**                                                                           **
**     Project: SPIKE-Web-Interface                                          **
**     Author: Gabriel Sessions                                              **
**     Last Update: 4/29/2022                                                **
**                                                                           **
**     Description:                                                          **
**     A collection of classes that can be used to unit test the             **
**     functionality of the SPIKE-Web-Interface system.                      **
**                                                                           **
******************************************************************************/


/*
 * TestSummary
 *
 * test name - Name of the current test (_testName)
 * result - "Passed" or "Failed"
 * errors - Error message returned from the test if result is 
 *          marked as "Failed"
 * 
*/
interface TestSummary {
    name: string;
    result: string;
    error: string;
}

/*
 * SPIKETests 
 * 
 * Manages the setup process to run unit tests 
 * including port checking and interface error handling.
 * 
 * Steps to use this class
 * 1. Initialize with a live ServiceDock Instance
 * 2. Initialize motors/sensors with the initialization methods
 *    - Will create new MotorTest, MotorPairTest, etc. objects that you can 
 *      run tests with 
 * 3. Get the initialzed test objects using getter methods
 * 
*/
class SPIKETests {
    private motor1 = undefined; // Small/Med Motor
    private motor2 = undefined; // Small/Med Motor
    private motor3 = undefined; // Large Motor
    private motorPair = undefined;
    private distanceSensor = undefined;
    private forceSensor = undefined;
    private colorSensor = undefined;
    private primeHub = undefined;

    private _motorTests:MotorTest = undefined;
    private _motorPairTests:MotorPairTest = undefined;

    constructor(private service, private _motorsUsed = false, private _motorPairUsed = false, private _distanceSensorUsed = false, private _forceSensorUsed = false, private _colorSensorUsed = false) {
        this.service = service;
        this.primeHub = new service.PrimeHub();
    }


    // Getter Methods
    public get motorTests() {
        if (this._motorTests == undefined) {
            console.error("Accessed Undefined Motor Test Object. Please define the Motor Object using an initializer method.")
            return null;

        }
        return this._motorTests;
    }

    public get motorPairTests() {
        if (this._motorTests == undefined) {
            console.error("Accessed Undefined MotorPair Test Object. Please define the MotorPair Object using an initializer method.")
            return null;
        }

        return this._motorTests;
    }

    /* 
     * Initialization Methods
     * 
     * Checks if devices are plugged into the SPIKE prime
     * and then initializes a new instance of the corresponding
     * device in the specified class variable
     * 
    */ 


    public initMotors(): void {
        const NUM_SMALL_MOTORS = 2; 
        const NUM_LARGE_MOTORS = 1;
        let smallMotors = this.service.getSmallMotorPorts();
        let largeMotors = this.service.getLargeMotorPorts();
        if (smallMotors.length == NUM_SMALL_MOTORS && largeMotors.length == 1) {
            this.motor1 = new this.service.Motor(smallMotors[0]);
            this.motor2 = new this.service.Motor(smallMotors[1]);
            this.motor3 = new this.service.Motor(largeMotors[0]);
            this._motorsUsed = true;
            this._motorTests = new MotorTest(this.motor1, this.motor2, this.motor3, 1000); 
        }
        else {
            alert("Error: Could not detect 3 Motors (1 large, 2 small)")
        }
    }

    public initMotorPair(): void {
        const NUM_SMALL_MOTORS = 2
        let smallMotors = this.service.getSmallMotorPorts();
        if (smallMotors.length == NUM_SMALL_MOTORS) {
            this.motorPair = 
                new this.service.MotorPair(smallMotors[0], smallMotors[1]);
            this._motorPairUsed = true;
            this._motorPairTests = new MotorPairTest(this.motorPair, 1000); 
        }
        else {
            alert("Error: Could not detect 2 Small Motors");
        }
        
    }

    public initDistanceSensor(): void {
        const NUM_DIST_SENSORS = 1
        let distSensors = this.service.getUltrasonicPorts();
        if (distSensors.length == NUM_DIST_SENSORS) {
            this.distanceSensor = 
                new this.service.DistanceSensor(distSensors[0])
            this._distanceSensorUsed = true;
        }
        else {
            alert("Error: Could not detect 1 Distance Sensor");
        }
    }

    public initColorSensor(): void {
        const NUM_COLOR_SENSORS = 1
        let colorSensors = this.service.getColorPorts();
        if (colorSensors.length == NUM_COLOR_SENSORS) {
            this.distanceSensor = new this.service.ColorSensor(colorSensors[0])
            this._colorSensorUsed = true;
        }
        else {
            alert("Error: Could not detect 1 Color Sensor");
        }
    }

    public initForceSensor(): void {
        const NUM_FORCE_SENSORS = 1
        let forceSensors = this.service.getForcePorts();
        if (forceSensors.length == NUM_FORCE_SENSORS) {
            this.forceSensor = new this.service.ForceSensor(forceSensors[0])
            this._forceSensorUsed = true;
        }
        else {
            alert("Error: Could not detect 1 Force Sensor");
        }
    }

}

/*
 * Test
 * Parent Test Class  
 * 
 * Defines basic variables and methods used in all types of
 * Unit Tests
*/
class Test {
    constructor(private _callback?: (testResult:TestSummary) => void, 
    private _testName:string = "Test")  {
        
    }

    public get testName() {
        return this._testName;
    }

    public set testName(testName:string) {
        this._testName = testName;
    }

    public set callback(newCallback) {
        this._callback = newCallback;
    }

    public get callback() {
        return this._callback;
    }

    // Creates a new TestSummary and returns the fully constructed object
    protected makeTestSummary(name:string, result:string, error:string) {
        let newTestSummary: TestSummary = {
            name: name,
            result: result,
            error: error
        };
        return newTestSummary;
    }
    
    protected returnPassed(): TestSummary {
        return this.returnResult("Passed")
    }

    protected returnFailed(error:string): TestSummary {
        console.error(error); // All errors are logged to the console
        return this.returnResult("Failed", error);
    }

    // Returns the results of a test and calls a supplied callback function 
    // if provided
    private returnResult(result:string, error:string = "-"): TestSummary {
        let newTestResult = this.makeTestSummary(this.testName, result, error);
        if (this.callback != undefined) {
            this.callback(newTestResult);
        }
        return newTestResult;
    }

    /*
     * runTest(function test)
     *
     * Runs a given test function and returns the test summary
     * 
     * Parameters: A function that has no return value (void)
     * Returns: A TestSummary object
     * 
    */ 
    protected runTest(test: () => void): TestSummary {
        try {
            test();
            return this.returnPassed();
        }
        catch(error) {
            return this.returnFailed(error);
        }
    }
}


/* ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------- */

/*
 * MotorTest
 * Child Class of Test  
 * 
 * Defines the implementation of various unit tests for Medium and Large Motors
 * SPIKE Prime Motors
*/

/******************************************************************************
**                           Motor Test Functions                            **
**                                                                           **
**     Class: Motor (inherits from Test)                                     **
**                                                                           **
**     Test Function Structure:                                              **
**      0. Your test should not include any parameters                       **
**      1. Arrow function including main unit test code                      **
**         with void return type. All thrown errors will be caught by        **
**         the runMotorTest function                                         **
**      2. A return statement to a runMotorTest function call:               **
**         1st parameter is the arrow function you created                   **
**         2nd parameter is the name of the test you created (optional)      **
**         3rd parameter is the amount of time (in ms) for the program       **
**         to "sleep" before returning the test results                      **
**         (optional, defaults to _timePerTest value)                        **
**                                                                           **
**      Note: If you include a sleep function call in your test, don't       **
**      forget to make your arrow function async!                            **
**                                                                           **
**      Once you finish writing your test and testing it, please add        **
**      it to the runAllTests method.                                        **
**                                                                           **
******************************************************************************/

class MotorTest extends Test {

     /*
     * MotorTest Constructor
     *
     * Creates a new instance of MotorTest and calls constructor of Test
     * Initializes
     *  - Three motors to be used in all tests
     *  - Default time to sleep between tests
     *  - A callback function to trigger after every test (optional)
     *  - An initial test name (optional)
     * 
     * Note: Motors should already be initialized and inserted as parameters
     * 
    */ 
    constructor(private motorA, private motorB, private motorC, 
        private _timePerTest:number = 1000, 
         _callback?: (testResult:TestSummary) => void,
         _testName?: string) {

        super(_callback, _testName);

    }

    public get timePerTest(): number {
        return this._timePerTest;
    }

    private async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /*
     * stopAllMotors()
     *
     * Stops all motors immediately
     * 
    */ 
    public stopAllMotors(): void {
        this.motorA.stop();
        this.motorB.stop();
        this.motorC.stop();
    }

    /*
     * runMotorTest(function test, waitTimeMultiplier = 1)
     *
     * Runs a given test function and a wait time, executes the given function,
     * waits the amount of time given, and then returns the results of the test.
     * 
     * Parameters: A function that has no return value (void),
     * a number to multiply the default timePerTest (triggers sleep at end)
     * and an optional name for the test
     * Returns: A TestSummary object (resolved promise)
     * 
    */ 
    protected async runMotorTest(test: () => void, testName:string = "", waitTimeMultiplier: number = 1): Promise<TestSummary> {
        this.testName = "Motor Test: " + testName;
        console.log(testName);
        try {
            await test();
            await this.sleep(this._timePerTest * waitTimeMultiplier);
            return this.returnPassed();
        }
        catch(error) {
            return this.returnFailed(error);
        }
    }
    
    public async startMotorTest(): Promise<TestSummary> {
        let startMotors = () => {
            this.motorA.start(30);
            this.motorB.start(50);
            this.motorC.start(100);
        }
        
        return await this.runMotorTest(startMotors, "Start Motors");
    }

    public async stopMotorTest(): Promise<TestSummary> {
        let stopMotors = () => {
            this.stopAllMotors();
        }
        return await this.runMotorTest(stopMotors, "Stop Motors");
    }

    public async getSpeedTest(): Promise<TestSummary> {
        let speedTest = async () => {
            let speedA = 30;
            let speedB = 50;
            let speedC = 90;
            let errorMargin = 5;
            this.motorA.start(speedA);
            this.motorB.start(speedB);
            this.motorC.start(speedC);

            await this.sleep(this._timePerTest * 1.5);

            // Checks if valid speed
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
        }

        return await this.runMotorTest(speedTest, "Get Speed", 0);
    }

    public async getPositionTest(): Promise<TestSummary> {
        let getPosition = () => {
            this.motorA.get_position();
            this.motorB.get_position();
            this.motorC.get_position();
        }
        return await this.runMotorTest(getPosition, "Get Position");
    }

    public async getDegreesCountedTest(): Promise<TestSummary> {
        let degreesCounted = async () => {
            let degA = this.motorA.get_degrees_counted();
            let degB = this.motorB.get_degrees_counted();
            let degC = this.motorC.get_degrees_counted();
            await this.sleep(this._timePerTest);
            
            // NOTE: A should always be the slowest motor!
            // Change this condition if you changed the power values
            // in previous tests!
            if (degA > degB || degB > degC) {
                throw "Inaccurate degree counts"
            }
        }
        return await this.runMotorTest(degreesCounted, "Get Degrees Counted", 0);
    }


    public async getMotorPowerTest(): Promise<TestSummary> {
        let motorPower = async () => {
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
        }
        return await this.runMotorTest(motorPower, "Check Power", 0);
        
    }

    public async defaultSpeedTest() {
        let defaultSpeed = () => {
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
        }

        return await this.runMotorTest(defaultSpeed, "Default Speed", 0);
    }

    public async setStallDetectionTest() {
        let setStallDetection = () => {
            this.motorA.set_stall_detection(true);
            this.motorB.set_stall_detection(false);
            this.motorC.set_stall_detection(true);
        }

        return await this.runMotorTest(setStallDetection, "Set Stall Detection", 0);
    }

    public async runDegreesCountedTest() {
        let degCounted = () => {
            this.motorA.run_to_degrees_counted(90, 50);
            this.motorB.run_to_degrees_counted(45, 30);
            this.motorC.run_to_degrees_counted(120, 90);
        }
        return await this.runMotorTest(degCounted, "Degrees Counted", 2);
    }

    public async startAtPowerTest() {
        let startAtPower = async () => {
            this.motorA.start_at_power(20)
            this.motorB.start_at_power(40);
            this.motorC.start_at_power(60);
            await this.sleep(this._timePerTest);
            this.stopAllMotors();
        }

        return await this.runMotorTest(startAtPower, "Start at power", 0);
        
    }

    public async runForSecondsTest() {
        let runForSeconds = async () => {
            this.motorA.run_for_seconds(this.timePerTest, 20);
            this.motorB.run_for_seconds(this.timePerTest, 40);
            this.motorC.run_for_seconds(this.timePerTest, 60);
            await this.sleep(this._timePerTest + 250);
            if (this.motorA.get_speed() > 1) {
                throw "Motor A not stopped on-time"
            }
            await this.sleep(this._timePerTest + 100);
            if (this.motorB.get_speed() > 1) {
                throw "Motor B not stopped on-time"
            }
            await this.sleep(this._timePerTest + 100);
            if (this.motorC.get_speed() > 1) {
                throw "Motor C not stopped on-time"
            }
        }

        return await this.runMotorTest(runForSeconds, "Run for Seconds", 0)
        
    }

    public async runForDegreesTest() {
        let runForDegrees = () => {
            this.motorA.run_for_degrees(90, 50);
            this.motorB.run_for_degrees(45, 30);
            this.motorC.run_for_degrees(120, 90);
        }
        return this.runMotorTest(runForDegrees, "Run for Degrees");
    }
    

    public async runAllMotorTests(): Promise<Array<TestSummary>> {
        // Add new tests here to this array!
        let testResults:Array<TestSummary> = [];

        testResults.push(await this.startMotorTest());
        testResults.push(await this.stopMotorTest());
        testResults.push(await this.getDegreesCountedTest());
        testResults.push(await this.getPositionTest());
        testResults.push(await this.getSpeedTest());
        testResults.push(await this.getMotorPowerTest());
        testResults.push(await this.defaultSpeedTest());
        testResults.push(await this.setStallDetectionTest());
        testResults.push(await this.runDegreesCountedTest());
        testResults.push(await this.startAtPowerTest());
        testResults.push(await this.runForSecondsTest());
        testResults.push(await this.runForDegreesTest());

        return testResults;
    }
}


/* ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------- */

/*
 * MotorPairTest
 * Child Class of Test  
 * 
 * Defines the implementation of various unit tests for a pair of
 * SPIKE Prime Motors
 * 
*/

class MotorPairTest extends Test {
    /*
     * Constructor
     * 
     * Creates a new instance of MotorPairTest
     *
     * Requires an already initialized MotorPair
     * 
    */ 
    constructor(private motorPair, private _timePerTest: number, _callback?: (testResult:TestSummary) => void, _testName?: string) {

        super(_callback, _testName);

    }

    private async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public get timePerTest(): number {
        return this._timePerTest;
    }

    /*
     * stopAllMotors()
     *
     * Stops all motors immediately
     * 
    */ 
    public stopAllMotors(): void {
        this.motorPair.stop();
    }

    /*
     * Identical function to the run function in MotorTest class
     * No time delay parameter -> functions implement delays themeselves
     * Maybe modularize sometime later?
    */ 
    protected async runMotorPairTest(test: () => void, testName = "Test"): Promise<TestSummary> {
        this.testName = "Motor Pair Test: " + testName;
        try {
            await test();
            return this.returnPassed();
        }
        catch(error) {
            return this.returnFailed(error);
        }
    }

    public async setMotorRotationTest(): Promise<TestSummary> {
        let rotation = () => { this.motorPair.set_motor_rotation(10, 'cm'); }
        return await this.runMotorPairTest(rotation);
        
    }

    public async startTankTest(): Promise<TestSummary> {
        let startTank = async () => {
            this.motorPair.start_tank(30, 30);
            await this.sleep(this.timePerTest);
            this.motorPair.stop();
        }
        return await this.runMotorPairTest(startTank, "Start Tank");
    }

    public async startTankPowerTest(): Promise<TestSummary> {
        let startTankPower = async () => {
            this.motorPair.start_tank_at_power(50, 50);
            await this.sleep(this.timePerTest);
            this.motorPair.stop();
        }
        return await this.runMotorPairTest(startTankPower, "Start Tank at Power");
    }

    public async stopMotorPairTest() {
        let stopMotorPair = async () => {
            this.motorPair.start_tank(30, 30);
            await this.sleep(this.timePerTest);
            this.motorPair.stop();
        }
        return await this.runMotorPairTest(stopMotorPair, "Stop Motor Pair");
    }

    public async runAllMotorPairTests(): Promise<Array<TestSummary>> {

        // Add new tests here to this array!

        let testResults:Array<TestSummary> = [];

        testResults.push(await this.setMotorRotationTest());
        testResults.push(await this.startTankTest());
        testResults.push(await this.startTankPowerTest());
        testResults.push(await this.stopMotorPairTest());

        console.log(testResults);
        return testResults;
    }

}

/* ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------- */

/*
 * DistSensorTest
 * Child Class of Test  
 * 
 * Defines the implementation of various unit tests for a pair of
 * SPIKE Prime Motors
 * 
*/
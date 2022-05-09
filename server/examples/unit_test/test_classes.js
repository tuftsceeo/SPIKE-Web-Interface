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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    constructor(service, _motorsUsed = false, _motorPairUsed = false, _distanceSensorUsed = false, _forceSensorUsed = false, _colorSensorUsed = false) {
        this.service = service;
        this._motorsUsed = _motorsUsed;
        this._motorPairUsed = _motorPairUsed;
        this._distanceSensorUsed = _distanceSensorUsed;
        this._forceSensorUsed = _forceSensorUsed;
        this._colorSensorUsed = _colorSensorUsed;
        this.motor1 = undefined; // Small/Med Motor
        this.motor2 = undefined; // Small/Med Motor
        this.motor3 = undefined; // Large Motor
        this.motorPair = undefined;
        this.distanceSensor = undefined;
        this.forceSensor = undefined;
        this.colorSensor = undefined;
        this.primeHub = undefined;
        this._motorTests = undefined;
        this._motorPairTests = undefined;
        this.service = service;
        this.primeHub = new service.PrimeHub();
    }
    // Getter Methods
    get motorTests() {
        if (this._motorTests == undefined) {
            console.error("Accessed Undefined Motor Test Object. Please define the Motor Object using an initializer method.");
            return null;
        }
        return this._motorTests;
    }
    get motorPairTests() {
        if (this._motorTests == undefined) {
            console.error("Accessed Undefined MotorPair Test Object. Please define the MotorPair Object using an initializer method.");
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
    initMotors() {
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
            alert("Error: Could not detect 3 Motors (1 large, 2 small)");
        }
    }
    initMotorPair() {
        const NUM_SMALL_MOTORS = 2;
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
    initDistanceSensor() {
        const NUM_DIST_SENSORS = 1;
        let distSensors = this.service.getUltrasonicPorts();
        if (distSensors.length == NUM_DIST_SENSORS) {
            this.distanceSensor =
                new this.service.DistanceSensor(distSensors[0]);
            this._distanceSensorUsed = true;
        }
        else {
            alert("Error: Could not detect 1 Distance Sensor");
        }
    }
    initColorSensor() {
        const NUM_COLOR_SENSORS = 1;
        let colorSensors = this.service.getColorPorts();
        if (colorSensors.length == NUM_COLOR_SENSORS) {
            this.distanceSensor = new this.service.ColorSensor(colorSensors[0]);
            this._colorSensorUsed = true;
        }
        else {
            alert("Error: Could not detect 1 Color Sensor");
        }
    }
    initForceSensor() {
        const NUM_FORCE_SENSORS = 1;
        let forceSensors = this.service.getForcePorts();
        if (forceSensors.length == NUM_FORCE_SENSORS) {
            this.forceSensor = new this.service.ForceSensor(forceSensors[0]);
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
    constructor(_callback, _testName = "Test") {
        this._callback = _callback;
        this._testName = _testName;
    }
    get testName() {
        return this._testName;
    }
    set testName(testName) {
        this._testName = testName;
    }
    set callback(newCallback) {
        this._callback = newCallback;
    }
    get callback() {
        return this._callback;
    }
    // Creates a new TestSummary and returns the fully constructed object
    makeTestSummary(name, result, error) {
        let newTestSummary = {
            name: name,
            result: result,
            error: error
        };
        return newTestSummary;
    }
    returnPassed() {
        return this.returnResult("Passed");
    }
    returnFailed(error) {
        console.error(error); // All errors are logged to the console
        return this.returnResult("Failed", error);
    }
    // Returns the results of a test and calls a supplied callback function 
    // if provided
    returnResult(result, error = "-") {
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
    runTest(test) {
        try {
            test();
            return this.returnPassed();
        }
        catch (error) {
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
    constructor(motorA, motorB, motorC, _timePerTest = 1000, _callback, _testName) {
        super(_callback, _testName);
        this.motorA = motorA;
        this.motorB = motorB;
        this.motorC = motorC;
        this._timePerTest = _timePerTest;
    }
    get timePerTest() {
        return this._timePerTest;
    }
    sleep(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    }
    /*
     * stopAllMotors()
     *
     * Stops all motors immediately
     *
    */
    stopAllMotors() {
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
    runMotorTest(test, testName = "", waitTimeMultiplier = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            this.testName = "Motor Test: " + testName;
            console.log(testName);
            try {
                yield test();
                yield this.sleep(this._timePerTest * waitTimeMultiplier);
                return this.returnPassed();
            }
            catch (error) {
                return this.returnFailed(error);
            }
        });
    }
    startMotorTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let startMotors = () => {
                this.motorA.start(30);
                this.motorB.start(50);
                this.motorC.start(100);
            };
            return yield this.runMotorTest(startMotors, "Start Motors");
        });
    }
    stopMotorTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let stopMotors = () => {
                this.stopAllMotors();
            };
            return yield this.runMotorTest(stopMotors, "Stop Motors");
        });
    }
    getSpeedTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let speedTest = () => __awaiter(this, void 0, void 0, function* () {
                let speedA = 30;
                let speedB = 50;
                let speedC = 90;
                let errorMargin = 5;
                this.motorA.start(speedA);
                this.motorB.start(speedB);
                this.motorC.start(speedC);
                yield this.sleep(this._timePerTest * 1.5);
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
            });
            return yield this.runMotorTest(speedTest, "Get Speed", 0);
        });
    }
    getPositionTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let getPosition = () => {
                this.motorA.get_position();
                this.motorB.get_position();
                this.motorC.get_position();
            };
            return yield this.runMotorTest(getPosition, "Get Position");
        });
    }
    getDegreesCountedTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let degreesCounted = () => __awaiter(this, void 0, void 0, function* () {
                let degA = this.motorA.get_degrees_counted();
                let degB = this.motorB.get_degrees_counted();
                let degC = this.motorC.get_degrees_counted();
                yield this.sleep(this._timePerTest);
                // NOTE: A should always be the slowest motor!
                // Change this condition if you changed the power values
                // in previous tests!
                if (degA > degB || degB > degC) {
                    throw "Inaccurate degree counts";
                }
            });
            return yield this.runMotorTest(degreesCounted, "Get Degrees Counted", 0);
        });
    }
    getMotorPowerTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let motorPower = () => __awaiter(this, void 0, void 0, function* () {
                let powerA = 20;
                let powerB = 50;
                let powerC = 90;
                let errorMargin = 5;
                this.motorA.start(powerA);
                this.motorB.start(powerB);
                this.motorC.start(powerC);
                yield this.sleep(this._timePerTest * 1.5);
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
            });
            return yield this.runMotorTest(motorPower, "Check Power", 0);
        });
    }
    defaultSpeedTest() {
        return __awaiter(this, void 0, void 0, function* () {
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
            };
            return yield this.runMotorTest(defaultSpeed, "Default Speed", 0);
        });
    }
    setStallDetectionTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let setStallDetection = () => {
                this.motorA.set_stall_detection(true);
                this.motorB.set_stall_detection(false);
                this.motorC.set_stall_detection(true);
            };
            return yield this.runMotorTest(setStallDetection, "Set Stall Detection", 0);
        });
    }
    runDegreesCountedTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let degCounted = () => {
                this.motorA.run_to_degrees_counted(90, 50);
                this.motorB.run_to_degrees_counted(45, 30);
                this.motorC.run_to_degrees_counted(120, 90);
            };
            return yield this.runMotorTest(degCounted, "Degrees Counted", 2);
        });
    }
    startAtPowerTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let startAtPower = () => __awaiter(this, void 0, void 0, function* () {
                this.motorA.start_at_power(20);
                this.motorB.start_at_power(40);
                this.motorC.start_at_power(60);
                yield this.sleep(this._timePerTest);
                this.stopAllMotors();
            });
            return yield this.runMotorTest(startAtPower, "Start at power", 0);
        });
    }
    runForSecondsTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let runForSeconds = () => __awaiter(this, void 0, void 0, function* () {
                this.motorA.run_for_seconds(this.timePerTest, 20);
                this.motorB.run_for_seconds(this.timePerTest, 40);
                this.motorC.run_for_seconds(this.timePerTest, 60);
                yield this.sleep(this._timePerTest + 250);
                if (this.motorA.get_speed() > 1) {
                    throw "Motor A not stopped on-time";
                }
                yield this.sleep(this._timePerTest + 100);
                if (this.motorB.get_speed() > 1) {
                    throw "Motor B not stopped on-time";
                }
                yield this.sleep(this._timePerTest + 100);
                if (this.motorC.get_speed() > 1) {
                    throw "Motor C not stopped on-time";
                }
            });
            return yield this.runMotorTest(runForSeconds, "Run for Seconds", 0);
        });
    }
    runForDegreesTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let runForDegrees = () => {
                this.motorA.run_for_degrees(90, 50);
                this.motorB.run_for_degrees(45, 30);
                this.motorC.run_for_degrees(120, 90);
            };
            return this.runMotorTest(runForDegrees, "Run for Degrees");
        });
    }
    runAllMotorTests() {
        return __awaiter(this, void 0, void 0, function* () {
            // Add new tests here to this array!
            let testResults = [];
            testResults.push(yield this.startMotorTest());
            testResults.push(yield this.stopMotorTest());
            testResults.push(yield this.getDegreesCountedTest());
            testResults.push(yield this.getPositionTest());
            testResults.push(yield this.getSpeedTest());
            testResults.push(yield this.getMotorPowerTest());
            testResults.push(yield this.defaultSpeedTest());
            testResults.push(yield this.setStallDetectionTest());
            testResults.push(yield this.runDegreesCountedTest());
            testResults.push(yield this.startAtPowerTest());
            testResults.push(yield this.runForSecondsTest());
            testResults.push(yield this.runForDegreesTest());
            return testResults;
        });
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
    constructor(motorPair, _timePerTest, _callback, _testName) {
        super(_callback, _testName);
        this.motorPair = motorPair;
        this._timePerTest = _timePerTest;
    }
    sleep(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    }
    get timePerTest() {
        return this._timePerTest;
    }
    /*
     * stopAllMotors()
     *
     * Stops all motors immediately
     *
    */
    stopAllMotors() {
        this.motorPair.stop();
    }
    /*
     * Identical function to the run function in MotorTest class
     * No time delay parameter -> functions implement delays themeselves
     * Maybe modularize sometime later?
    */
    runMotorPairTest(test, testName = "Test") {
        return __awaiter(this, void 0, void 0, function* () {
            this.testName = "Motor Pair Test: " + testName;
            try {
                yield test();
                return this.returnPassed();
            }
            catch (error) {
                return this.returnFailed(error);
            }
        });
    }
    setMotorRotationTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let rotation = () => { this.motorPair.set_motor_rotation(10, 'cm'); };
            return yield this.runMotorPairTest(rotation);
        });
    }
    startTankTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let startTank = () => __awaiter(this, void 0, void 0, function* () {
                this.motorPair.start_tank(30, 30);
                yield this.sleep(this.timePerTest);
                this.motorPair.stop();
            });
            return yield this.runMotorPairTest(startTank, "Start Tank");
        });
    }
    startTankPowerTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let startTankPower = () => __awaiter(this, void 0, void 0, function* () {
                this.motorPair.start_tank_at_power(50, 50);
                yield this.sleep(this.timePerTest);
                this.motorPair.stop();
            });
            return yield this.runMotorPairTest(startTankPower, "Start Tank at Power");
        });
    }
    stopMotorPairTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let stopMotorPair = () => __awaiter(this, void 0, void 0, function* () {
                this.motorPair.start_tank(30, 30);
                yield this.sleep(this.timePerTest);
                this.motorPair.stop();
            });
            return yield this.runMotorPairTest(stopMotorPair, "Stop Motor Pair");
        });
    }
    runAllMotorPairTests() {
        return __awaiter(this, void 0, void 0, function* () {
            // Add new tests here to this array!
            let testResults = [];
            testResults.push(yield this.setMotorRotationTest());
            testResults.push(yield this.startTankTest());
            testResults.push(yield this.startTankPowerTest());
            testResults.push(yield this.stopMotorPairTest());
            console.log(testResults);
            return testResults;
        });
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

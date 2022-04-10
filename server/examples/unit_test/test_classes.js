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
 * Test
 * Parent Test Class
 *
 * Defines basic variables and methods used in all types of
 * Unit Tests
*/
class Test {
    constructor(_testName) {
        this._testName = _testName;
        this._testName = _testName;
    }
    get testName() {
        return this._testName;
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
        return this.makeTestSummary(this._testName, "Passed", "-");
    }
    returnFailed(error) {
        console.error(error); // All errors are logged to the console
        return this.makeTestSummary(this._testName, "Failed", error);
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
class MotorTest extends Test {
    constructor(_testName, _timePerTest, motorA, motorB, motorC) {
        super(_testName);
        this._timePerTest = _timePerTest;
        this.motorA = motorA;
        this.motorB = motorB;
        this.motorC = motorC;
        this._timePerTest = _timePerTest;
        this.motorA = motorA;
        this.motorB = motorB;
        this.motorC = motorC;
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
     * runTest(function test, waitTimeMultiplier = 1)
     *
     * Runs a given test function and a wait time, executes the given function,
     * waits the amount of time given, and then returns the results of the test.
     *
     * Parameters: A function that has no return value (void)
     * and a number to multiply the default timePerTest to wait for
     * Returns: A TestSummary object
     *
    */
    runTest(test, waitTimeMultiplier = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                test();
                yield this.sleep(this._timePerTest * waitTimeMultiplier);
                return this.makeTestSummary(this.testName, "Passed", "-");
            }
            catch (error) {
                return this.makeTestSummary(this.testName, "Failed", error);
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
            return yield this.runTest(startMotors);
        });
    }
}

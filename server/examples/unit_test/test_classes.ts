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
 * Test
 * Parent Test Class  
 * 
 * Defines basic variables and methods used in all types of
 * Unit Tests
*/
class Test {
    constructor(private _testName:string) {
        this._testName = _testName;
    }

    public get testName() {
        return this._testName;
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
        return this.makeTestSummary(this._testName, "Passed", "-");
    }

    protected returnFailed(error:string): TestSummary {
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
class MotorTest extends Test {

    constructor(_testName: string, private _timePerTest:number, private motorA, private motorB, private motorC) {

        super(_testName);

        this._timePerTest = _timePerTest;
        this.motorA = motorA;
        this.motorB = motorB;
        this.motorC = motorC;

    }

    public get timePerTest(): number {
        return this._timePerTest;
    }

    private async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
    protected async runTest(test: () => void, waitTimeMultiplier: number = 1): Promise<TestSummary> {
        try {
            test();
            await this.sleep(this._timePerTest * waitTimeMultiplier);
            return this.makeTestSummary(this.testName, "Passed", "-");
        }
        catch(error) {
            return this.makeTestSummary(this.testName, "Failed", error);
        }
    }

    public async startMotorTest(): Promise<TestSummary> {
        let startMotors = () => {
            this.motorA.start(30);
            this.motorB.start(50);
            this.motorC.start(100);
        }
        return await this.runTest(startMotors);
    }
}
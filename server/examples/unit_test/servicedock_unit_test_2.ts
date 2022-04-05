
class UnitTest {
    private service: any; // Should be an initialized SPIKE Service
    private primehub;
    private motorA;
    private motorB;
    private motorC;
    private motorPair;
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
        this.motorPair = new this.service.MotorPair
            (UnitTest.MED_MOTORS_PORTS[0], UnitTest.MED_MOTORS_PORTS[1])
        this.distSensor = 
            new this.service.DistanceSensor(UnitTest.DIST_SENSOR_PORTS[0]);
        this.forceSensor = 
            new this.service.ForceSensor(UnitTest.FORCE_SENSOR_PORTS[0]);
        this.colorSensor = 
            new this.service.ColorSensor(UnitTest.COLOR_SENSOR_PORTS[0]);
        console.log(this.service);
        this.primehub = new this.service.PrimeHub();
        
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
            console.error(error);
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
            console.error(error);
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
            console.error(error);
            this.stopAllMotors();
            return ["run_to_degrees_counted()", "Failed", "Cannot run motors to degrees specified"];
        }
    }

    public async runForSecondsTest() {
        try {
            this.motorA.run_for_seconds(this.timePerTest*2, 20);
            this.motorB.run_for_seconds(this.timePerTest*4, 40);
            this.motorC.run_for_seconds(this.timePerTest*6, 60);
            await this.sleep(this._timePerTest*2 + 250);
            if (this.motorA.get_speed() > 1) {
                throw "Motor A not stopped on-time"
            }
            await this.sleep(this._timePerTest*2 + 100);
            if (this.motorB.get_speed() > 1) {
                throw "Motor B not stopped on-time"
            }
            await this.sleep(this._timePerTest*2 + 100);
            if (this.motorC.get_speed() > 1) {
                throw "Motor C not stopped on-time"
            }
            return ["run_for_seconds()", "Passed", "-"];

        }
        catch(error) {
            console.error(error);
            this.stopAllMotors();
            return ["run_for_seconds()", "Failed", error];
        }
    }

    public async runForDegreesTest() {
        try {
            this.motorA.run_for_degrees(90, 50);
            this.motorB.run_for_degrees(45, 30);
            this.motorC.run_for_degrees(120, 90);
            await this.sleep(this._timePerTest * 3);
            return ["run_for_degrees()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["run_for_degrees()", "Failed", "Cannot run motors for degrees specified"];
        }
    }

    public setMotorRotationTest() {
        try {
            this.motorPair.set_motor_rotation(10, 'cm');
            return ["set_motor_rotation()", "Passed", "-"];
        }
        catch(error) {
            console.error(error);
            return ["set_motor_rotation()", "Failed", "Cannot set rotation length"];
        }
    }

    public async startTankTest() {
        try {
            this.motorPair.start_tank(30, 30);
            await this.sleep(this._timePerTest);
            this.stopAllMotors();
            return ["start_tank()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            this.stopAllMotors();
            return ["start_tank()", "Failed", "Cannot start tank drive"];
        }
    }

    public async startTankPowerTest() {
        try {
            this.motorPair.start_tank_at_power(50, 50);
            await this.sleep(this._timePerTest);
            this.stopAllMotors();
            return ["start_tank_at_power()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            this.stopAllMotors();
            return ["start_tank_at_power()", "Failed", "Cannot start tank drive at given power"];
        }
    }

    public async stopMotorPairTest() {
        try {
            this.motorPair.start_tank(30, 30);
            this.motorPair.stop();
            await this.sleep(this._timePerTest);
            if (this.motorA.get_speed() > 5 || this.motorB.get_speed() > 5) {
                throw "MotorPair did not stop on-time";
            }
            return ["stop()", "Passed", "-"];
            
        }
        catch(error) {
            console.error(error);
            return ["stop()", "Failed", error];
        }
        
    }


    public getDistCmTest() {
        try {
            let distCM = this.distSensor.get_distance_cm();
            return ["get_dist_cm()", "Passed", "-"];
            
        }
        catch(error) {
            console.error(error);
            return ["get_dist_cm()", "Failed", error];
        }
    }

    public getDistInchesTest() {
        try {
            let distIn = this.distSensor.get_distance_inches();
            return ["get_distance_inches()", "Passed", "-"];
            
        }
        catch(error) {
            console.error(error);
            return ["get_distance_inches()", "Failed", error];
        }
    }

    public getDistPercentTest() {
        try {
            let distPercet = this.distSensor.get_distance_percentage();
            return ["get_distance_percentage()", "Passed", "-"];
            
        }
        catch(error) {
            console.error(error);
            return ["get_distance_percentage()", "Failed", error];
        }
        
    }

    public lightUpTest() {
        try {
            this.distSensor.light_up(100,100,100,100);
            this.distSensor.light_up(0,100,0,100);
            this.distSensor.light_up(50,25,25,50);
            this.distSensor.light_up(0,0,0,0);
            return ["light_up()", "Passed", "-"];
            
        }
        catch(error) {
            console.error(error);
            return ["light_up()", "Failed", error];
        }
    }

    public lightUpAllTest() {
        try {
            this.distSensor.light_up_all(100);
            this.distSensor.light_up_all(25);
            this.distSensor.light_up_all(75);
            this.distSensor.light_up_all(50);
            this.distSensor.light_up_all(0);
            return ["light_up_all()", "Passed", "-"];
            
        }
        catch(error) {
            console.error(error);
            return ["light_up_all()", "Failed", error];
        }
    }

    public forceSensorPressedTest() {
        try {
            if (this.forceSensor.is_pressed()) {
                throw "Force sensor should not be pressed";
            }
            return ["is_pressed()", "Passed", "-"]; 
        }
        catch(error) {
            console.error(error);
            return ["is_pressed()", "Failed", error];
        }
    }

    public getForceNTest() {
        try {
            if (this.forceSensor.get_force_newton() != 0) {
                throw "Force sensor should not be pressed";
            }
            return ["get_force_newton()", "Passed", "-"]; 
        }
        catch(error) {
            console.error(error);
            return ["get_force_newton()", "Failed", error];
        }
    }

    public getForcePercent() {
        try {
            if (this.forceSensor.get_force_percentage() > 5) {
                throw "Force sensor should not be pressed";
            }
            return ["get_force_percentage()", "Passed", "-"]; 
        }
        catch(error) {
            console.error(error);
            return ["get_force_percentage()", "Failed", error];
        }
    }

    public testGetColor() {
        try {
            this.colorSensor.get_color();
            return ["get_color()", "Passed", "-"];
        }
        catch(error) {
            console.error(error);
            return ["get_color()", "Failed", error];
        }
    }

    public testReflectedLight() {
        try {
            this.colorSensor.get_reflected_light();
            return ["get_reflected_light()", "Passed", "-"];
        }
        catch(error) {
            console.error(error);
            return ["get_reflected_light()", "Failed", error];
        }
    }

    public testGetRed() {
        try {
            this.colorSensor.get_red();
            return ["get_red()", "Passed", "-"];
        }
        catch(error) {
            console.error(error);
            return ["get_red()", "Failed", error];
        }
    }

    public testGetGreen() {
        try {
            this.colorSensor.get_green();
            return ["get_green()", "Passed", "-"];
        }
        catch(error) {
            console.error(error);
            return ["get_green()", "Failed", error];
        }
    }

    public testGetBlue() {
        try {
            this.colorSensor.get_blue();
            return ["get_blue()", "Passed", "-"];
        }
        catch(error) {
            console.error(error);
            return ["get_blue()", "Failed", error];
        }
    }

    public testStatusLightColor() {
        try {
            console.log(this.primehub);
            this.primehub.status_light.on("blue");
            this.primehub.status_light.on("azure");
            this.primehub.status_light.on("black");
            this.primehub.status_light.on("green");
            this.primehub.status_light.on("white");
            this.primehub.status_light.on("violet");
            this.primehub.status_light.on("orange");
            return ["Status Light", "Passed", "-"];
        }
        catch(error) {
            console.error(error);
            return ["Status Light", "Failed", error];
        }
    }

    public turnOffStatusLight() {
        try {
            this.primehub.status_light.off();
            return ["Status Light Off", "Passed", "-"];
        }
        catch(error) {
            console.error(error);
            return ["Status Light Off", "Failed", error];
        }

    }
    public testSetPixel() {
        try {
            let lightMatrix = this.primehub.light_matrix;
            lightMatrix.set_pixel(2, 3, 50);
            lightMatrix.set_pixel(0, 4, 25);
            lightMatrix.set_pixel(4, 1, 100);
            return ["set_pixel()", "Passed", "-"];
        }
        catch(error) {
            console.error(error);
            return ["set_pixel()", "Failed", error];
        }

    }

    public testWriteLM() {
        try {
            let lightMatrix = this.primehub.light_matrix;
            lightMatrix.write("Hi");
            lightMatrix.write("LEGO");
            return ["LM: write()", "Passed", "-"];
        }
        catch(error) {
            console.error(error);
            return ["LM: write()", "Failed", error];
        }

    }

    public turnOffLightMatrix() {
        try {
            let lightMatrix = this.primehub.light_matrix;
            lightMatrix.off();
            return ["LM: off()", "Passed", "-"];
        }
        catch(error) {
            console.error(error);
            return ["LM: off", "Failed", error];
        }

    }

    public async testBeep() {
        try {
            let beepLength = 1; // In seconds
            this.primehub.speaker.beep(60, beepLength);
            await this.sleep(beepLength * 1000);
            this.primehub.speaker.beep(80, beepLength);
            this.primehub.speaker.beep(100, beepLength);
            this.primehub.speaker.beep(44, beepLength);
            this.primehub.speaker.beep(123, beepLength);
            return ["beep()", "Passed", "-"];
        }
        catch(error) {
            return ["beep()", "Failed", error];
        }
    }

    public async testStartBeep() {
        try {
            this.primehub.speaker.start_beep(60);
            await this.sleep(this.timePerTest);
            return ["start_beep()", "Passed", "-"];
        }
        catch(error) {
            return ["start_beep()", "Failed", error];
        }
    }

    public setVolumeTest() {
        try {
            this.primehub.speaker.set_volume(100);
            this.primehub.speaker.set_volume(0);
            this.primehub.speaker.set_volume(50);
            return ["set_volume()", "Passed", "-"];
        }
        catch(error) {
            return ["set_volume()", "Failed", error];
        }
    }

    public getVolumeTest() {
        try {
            if (this.primehub.speaker.get_volume() == 0) {
                throw "No Volume Detected"
            }
            return ["get_volume()", "Passed", "-"];
        }
        catch(error) {
            return ["get_volume()", "Failed", error];
        }
    }

    public testStopBeep() {
        try {
            this.primehub.speaker.stop();
            return ["stop beep", "Passed", "-"];
        }
        catch(error) {
            return ["stop beep", "Failed", error];
        }
    }

    public testLeftButtonWasPressed() {
        try {
            let pressed = this.primehub.left_button.was_pressed();
            if (typeof(pressed) != "boolean")
                throw "Returned Non-Boolean"
            return ["left_button.was_pressed()", "Passed", "-"];
        }
        catch(error) {
            return ["left_button.was_pressed()", "Failed", error];
        }
    }

    public testRightButtonWasPressed() {
        try {
            let pressed = this.primehub.right_button.was_pressed();
            if (typeof(pressed) != "boolean")
                throw "Returned Non-Boolean"
            return ["right_button.was_pressed()", "Passed", "-"];
        }
        catch(error) {
            return ["right_button.was_pressed()", "Failed", error];
        }
    }

    public testLeftButtonIsPressed() {
        try {
            let pressed = this.primehub.left_button.is_pressed();
            if (typeof(pressed) != "boolean")
                throw "Returned Non-Boolean"
            if (pressed)
                throw "Button should not be pressed"
            return ["left_button.is_pressed()", "Passed", "-"];
        }
        catch(error) {
            return ["left_button.is_pressed()", "Failed", error];
        }
    }

    public testRightButtonIsPressed() {
        try {
            let pressed = this.primehub.right_button.is_pressed();
            if (typeof(pressed) != "boolean")
                throw "Returned Non-Boolean"
            if (pressed)
                throw "Button should not be pressed"
            return ["right_button.is_pressed()", "Passed", "-"];
        }
        catch(error) {
            return ["right_button.is_pressed()", "Failed", error];
        }
    }

    public testWasGesture() {
        try {
            let gesture = this.primehub.motion_sensor.was_gesture("tap");
            if (typeof(gesture) != "boolean")
                throw "Returned Non-Boolean"
            return ["was_gesture()", "Passed", "-"];
        }
        catch(error) {
            return ["was_gesture()", "Failed", error];
        }
    }

    public testGetAngles() {
        let failedTests = "";
        try {
            this.primehub.motion_sensor.get_yaw_angle();
        }
        catch(error) {
            console.error(error);
            failedTests += "Yaw Angle Test Failed. "
        }
        try {
            this.primehub.motion_sensor.get_pitch_angle();
        }
        catch(error) {
            console.error(error);
            failedTests += "Pitch Angle Test Failed. "
        }
        try {
            this.primehub.motion_sensor.get_roll_angle();
        }
        catch(error) {
            console.error(error);
            failedTests += "Roll Angle Test Failed. "
        }
        if (failedTests == "") 
            return (["Angles Tests", "Passed", "-"]);
        return (["Angles Tests", "Failed", failedTests]);
    }

    public testGetAccelerations() {
        let failedTests = "";
        try {
            this.primehub.motion_sensor.get_yaw_acceleration();
        }
        catch(error) {
            console.error(error);
            failedTests += "Yaw Acceleration Test Failed. "
        }
        try {
            this.primehub.motion_sensor.get_pitch_acceleration();
        }
        catch(error) {
            console.error(error);
            failedTests += "Pitch Acceleration Test Failed. "
        }
        try {
            this.primehub.motion_sensor.get_roll_acceleration();
        }
        catch(error) {
            console.error(error);
            failedTests += "Roll Acceleration Test Failed. "
        }
        if (failedTests == "") 
            return (["Acceleration Tests", "Passed", "-"]);
        return (["Acceleration Tests", "Failed", failedTests]);
    }


    public getGestureTest() {
        try{
            this.primehub.motion_sensor.get_gesture();
            return(["get_gesture()", "Passed", "-"]);
        }
        catch(error) {
            console.error(error);
            return (["get_gesture()", "Failed", error]);
        }
    }


    public getOrientationTest() {
        try{
            this.primehub.motion_sensor.get_orientation();
            return(["get_orientation()", "Passed", "-"]);
        }
        catch(error) {
            console.error(error);
            return (["get_orientation()", "Failed", error]);
        }
    }

    // Some Manual Tests below, requires human verification
    // ----------------------------------------------------
    public rebootHubTest() {
        this.service.rebootHub();
    }

    // Auto Test
    public getHubNameTest() {
        try{
            this.service.getHubName();
            return(["getHubName()", "Passed", "-"]);
        }
        catch(error) {
            console.error(error);
            return (["getHubName()", "Failed", error]);
        }
    }

    // Auto Test
    public isActiveTest() {
        try{
            this.service.isActive();
            return(["isActive()", "Passed", "-"]);
        }
        catch(error) {
            console.error(error);
            return (["isActive()", "Failed", error]);
        }
    }

    public hubTappedTest() {
        try{
            let hubEvent = this.service.getHubEvent();
            if (hubEvent != "tapped")
                throw "Hub was not (single) tapped"
            return(["Hub (Single) Tap", "Passed", "-"]);
        }
        catch(error) {
            console.error(error);
            return (["Hub (Single) Tap", "Failed", error]);
        }
    }

    public hubDoubleTappedTest() {
        try{
            let hubEvent = this.service.getHubEvent();
            if (hubEvent != "doubletapped")
                throw "Hub was not (double) tapped"
            return(["Hub (Double) Tap", "Passed", "-"]);
        }
        catch(error) {
            console.error(error);
            return (["Hub (Double) Tap", "Failed", error]);
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
let runAutomaticTests = async (test:UnitTest) => {
    let testingChart = createTestingChart("TestRows");
    test.initializeTest();
    /*
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
    
    */
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
}

let confirmTest = async (instructions:string, buttons:boolean) => {
    if (buttons) {
        $("#testPassed").removeClass("hidden");
        $("#testFailed").removeClass("hidden");
    }
    let passed:boolean;
    $("#instructions").html(instructions);
    $("#testPassed").on("click", () =>{
        return true;
    });

    return passed;
}

let rebootHubTest = async (test:UnitTest) => {
    test.rebootHubTest();
    let passedTest:boolean = await confirmTest("Was the hub successfully rebooted?", true);
    if (passedTest)
        return(["rebootHub()", "Passed", "-"])
    return (["rebootHub()", "Failed", "Unable to reboot hub"])
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class UnitTest {
    constructor(initializedService) {
        this.checkPort = (device, portLetter) => {
            let devicePorts;
            switch (device) {
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
        };
        this.service = initializedService;
        this._timePerTest = 500;
        this._timeout = 10000;
    }
    // Public constants
    static get MED_MOTORS_PORTS() { return ['A', 'B']; }
    ;
    static get LARGE_MOTORS_PORTS() { return ['C']; }
    ;
    static get DIST_SENSOR_PORTS() { return ['D']; }
    ;
    static get FORCE_SENSOR_PORTS() { return ['E']; }
    ;
    static get COLOR_SENSOR_PORTS() { return ['F']; }
    ;
    get timePerTest() {
        return this._timePerTest;
    }
    set timePerTest(newTimePerTest) {
        this._timePerTest = newTimePerTest;
    }
    sleep(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    }
    stopAllMotors() {
        this.motorA.stop();
        this.motorB.stop();
        this.motorC.stop();
    }
    // Only initialize test after all devices are plugged into the correct 
    // ports!
    initializeTest() {
        this.motorA = new this.service.Motor(UnitTest.MED_MOTORS_PORTS[0]);
        this.motorB = new this.service.Motor(UnitTest.MED_MOTORS_PORTS[1]);
        this.motorC = new this.service.Motor(UnitTest.LARGE_MOTORS_PORTS[0]);
        this.motorPair = new this.service.MotorPair(UnitTest.MED_MOTORS_PORTS[0], UnitTest.MED_MOTORS_PORTS[1]);
        this.distSensor =
            new this.service.DistanceSensor(UnitTest.DIST_SENSOR_PORTS[0]);
        this.forceSensor =
            new this.service.ForceSensor(UnitTest.FORCE_SENSOR_PORTS[0]);
        this.colorSensor =
            new this.service.ColorSensor(UnitTest.COLOR_SENSOR_PORTS[0]);
        console.log(this.service);
        this.primehub = new this.service.PrimeHub();
    }
    startMotorTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.motorA.start(30);
                this.motorB.start(50);
                this.motorC.start(100);
                yield this.sleep(this._timePerTest);
                return ["Start Motors", "Passed", "-"];
            }
            catch (error) {
                console.error(error);
                return ["Start Motors", "Failed", "Start cannot be called"];
            }
        });
    }
    stopMotorTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.stopAllMotors();
                yield this.sleep(this._timePerTest);
                return ["Stop Motors", "Passed", "-"];
            }
            catch (error) {
                console.error(error);
                return ["Stop Motors", "Failed", "Stop cannot be called"];
            }
        });
    }
    getSpeedTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let speedA = 30;
                let speedB = 50;
                let speedC = 90;
                let errorMargin = 5;
                this.motorA.start(speedA);
                this.motorB.start(speedB);
                this.motorC.start(speedC);
                yield this.sleep(this._timePerTest * 1.5);
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
                return ["get_speed()", "Passed", "-"];
            }
            catch (error) {
                console.error(error);
                this.stopAllMotors();
                return ["get_speed()", "Failed", error];
            }
        });
    }
    getPositionTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.motorA.get_position();
                this.motorB.get_position();
                this.motorC.get_position();
                yield this.sleep(this._timePerTest);
                return ["get_position()", "Passed", "-"];
            }
            catch (error) {
                console.error(error);
                return ["get_position()", "Failed", "Motor position cannot be called"];
            }
        });
    }
    getDegreesCountedTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                return ["get_degrees_counted()", "Passed", "-"];
            }
            catch (error) {
                console.error(error);
                return ["get_degrees_counted", "Failed", error];
            }
        });
    }
    getMotorPower() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                this.stopAllMotors();
                return ["get_power()", "Passed", "-"];
            }
            catch (error) {
                console.error(error);
                this.stopAllMotors();
                return ["get_power()", "Failed", error];
            }
        });
    }
    defaultSpeedTest() {
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
    setStallDetectionTest() {
        try {
            this.motorA.set_stall_detection(true);
            this.motorB.set_stall_detection(false);
            this.motorC.set_stall_detection(true);
            return ["set_stall_detection()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["set_stall_detection()", "Failed", "cannot set stall detection"];
        }
    }
    runDegreesCountedTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.motorA.run_to_degrees_counted(90, 50);
                this.motorB.run_to_degrees_counted(45, 30);
                this.motorC.run_to_degrees_counted(120, 90);
                yield this.sleep(this._timePerTest * 2);
                return ["run_to_degrees_counted()", "Passed", "-"];
            }
            catch (error) {
                console.error(error);
                return ["run_to_degrees_counted()", "Failed", "Cannot run motors to degrees specified"];
            }
        });
    }
    startAtPowerTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.motorA.start_at_power(20);
                this.motorB.start_at_power(40);
                this.motorC.start_at_power(60);
                yield this.sleep(this._timePerTest);
                this.stopAllMotors();
                return ["run_to_degrees_counted()", "Passed", "-"];
            }
            catch (error) {
                console.error(error);
                this.stopAllMotors();
                return ["run_to_degrees_counted()", "Failed", "Cannot run motors to degrees specified"];
            }
        });
    }
    runForSecondsTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.motorA.run_for_seconds(this.timePerTest * 2, 20);
                this.motorB.run_for_seconds(this.timePerTest * 4, 40);
                this.motorC.run_for_seconds(this.timePerTest * 6, 60);
                yield this.sleep(this._timePerTest * 2 + 250);
                if (this.motorA.get_speed() > 1) {
                    throw "Motor A not stopped on-time";
                }
                yield this.sleep(this._timePerTest * 2 + 100);
                if (this.motorB.get_speed() > 1) {
                    throw "Motor B not stopped on-time";
                }
                yield this.sleep(this._timePerTest * 2 + 100);
                if (this.motorC.get_speed() > 1) {
                    throw "Motor C not stopped on-time";
                }
                return ["run_for_seconds()", "Passed", "-"];
            }
            catch (error) {
                console.error(error);
                this.stopAllMotors();
                return ["run_for_seconds()", "Failed", error];
            }
        });
    }
    runForDegreesTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.motorA.run_for_degrees(90, 50);
                this.motorB.run_for_degrees(45, 30);
                this.motorC.run_for_degrees(120, 90);
                yield this.sleep(this._timePerTest * 3);
                return ["run_for_degrees()", "Passed", "-"];
            }
            catch (error) {
                console.error(error);
                return ["run_for_degrees()", "Failed", "Cannot run motors for degrees specified"];
            }
        });
    }
    setMotorRotationTest() {
        try {
            this.motorPair.set_motor_rotation(10, 'cm');
            return ["set_motor_rotation()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["set_motor_rotation()", "Failed", "Cannot set rotation length"];
        }
    }
    startTankTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.motorPair.start_tank(30, 30);
                yield this.sleep(this._timePerTest);
                this.stopAllMotors();
                return ["start_tank()", "Passed", "-"];
            }
            catch (error) {
                console.error(error);
                this.stopAllMotors();
                return ["start_tank()", "Failed", "Cannot start tank drive"];
            }
        });
    }
    startTankPowerTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.motorPair.start_tank_at_power(50, 50);
                yield this.sleep(this._timePerTest);
                this.stopAllMotors();
                return ["start_tank_at_power()", "Passed", "-"];
            }
            catch (error) {
                console.error(error);
                this.stopAllMotors();
                return ["start_tank_at_power()", "Failed", "Cannot start tank drive at given power"];
            }
        });
    }
    stopMotorPairTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.motorPair.start_tank(30, 30);
                this.motorPair.stop();
                yield this.sleep(this._timePerTest);
                if (this.motorA.get_speed() > 5 || this.motorB.get_speed() > 5) {
                    throw "MotorPair did not stop on-time";
                }
                return ["stop()", "Passed", "-"];
            }
            catch (error) {
                console.error(error);
                return ["stop()", "Failed", error];
            }
        });
    }
    getDistCmTest() {
        try {
            let distCM = this.distSensor.get_distance_cm();
            return ["get_dist_cm()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["get_dist_cm()", "Failed", error];
        }
    }
    getDistInchesTest() {
        try {
            let distIn = this.distSensor.get_distance_inches();
            return ["get_distance_inches()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["get_distance_inches()", "Failed", error];
        }
    }
    getDistPercentTest() {
        try {
            let distPercet = this.distSensor.get_distance_percentage();
            return ["get_distance_percentage()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["get_distance_percentage()", "Failed", error];
        }
    }
    lightUpTest() {
        try {
            this.distSensor.light_up(100, 100, 100, 100);
            this.distSensor.light_up(0, 100, 0, 100);
            this.distSensor.light_up(50, 25, 25, 50);
            this.distSensor.light_up(0, 0, 0, 0);
            return ["light_up()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["light_up()", "Failed", error];
        }
    }
    lightUpAllTest() {
        try {
            this.distSensor.light_up_all(100);
            this.distSensor.light_up_all(25);
            this.distSensor.light_up_all(75);
            this.distSensor.light_up_all(50);
            this.distSensor.light_up_all(0);
            return ["light_up_all()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["light_up_all()", "Failed", error];
        }
    }
    forceSensorPressedTest() {
        try {
            if (this.forceSensor.is_pressed()) {
                throw "Force sensor should not be pressed";
            }
            return ["is_pressed()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["is_pressed()", "Failed", error];
        }
    }
    getForceNTest() {
        try {
            if (this.forceSensor.get_force_newton() != 0) {
                throw "Force sensor should not be pressed";
            }
            return ["get_force_newton()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["get_force_newton()", "Failed", error];
        }
    }
    getForcePercent() {
        try {
            if (this.forceSensor.get_force_percentage() > 5) {
                throw "Force sensor should not be pressed";
            }
            return ["get_force_percentage()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["get_force_percentage()", "Failed", error];
        }
    }
    testGetColor() {
        try {
            this.colorSensor.get_color();
            return ["get_color()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["get_color()", "Failed", error];
        }
    }
    testReflectedLight() {
        try {
            this.colorSensor.get_reflected_light();
            return ["get_reflected_light()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["get_reflected_light()", "Failed", error];
        }
    }
    testGetRed() {
        try {
            this.colorSensor.get_red();
            return ["get_red()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["get_red()", "Failed", error];
        }
    }
    testGetGreen() {
        try {
            this.colorSensor.get_green();
            return ["get_green()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["get_green()", "Failed", error];
        }
    }
    testGetBlue() {
        try {
            this.colorSensor.get_blue();
            return ["get_blue()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["get_blue()", "Failed", error];
        }
    }
    testStatusLightColor() {
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
        catch (error) {
            console.error(error);
            return ["Status Light", "Failed", error];
        }
    }
    turnOffStatusLight() {
        try {
            this.primehub.status_light.off();
            return ["Status Light Off", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["Status Light Off", "Failed", error];
        }
    }
    testSetPixel() {
        try {
            let lightMatrix = this.primehub.light_matrix;
            lightMatrix.set_pixel(2, 3, 50);
            lightMatrix.set_pixel(0, 4, 25);
            lightMatrix.set_pixel(4, 1, 100);
            return ["set_pixel()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["set_pixel()", "Failed", error];
        }
    }
    testWriteLM() {
        try {
            let lightMatrix = this.primehub.light_matrix;
            lightMatrix.write("Hi");
            lightMatrix.write("LEGO");
            return ["LM: write()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["LM: write()", "Failed", error];
        }
    }
    turnOffLightMatrix() {
        try {
            let lightMatrix = this.primehub.light_matrix;
            lightMatrix.off();
            return ["LM: off()", "Passed", "-"];
        }
        catch (error) {
            console.error(error);
            return ["LM: off", "Failed", error];
        }
    }
    testBeep() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let beepLength = 1; // In seconds
                this.primehub.speaker.beep(60, beepLength);
                yield this.sleep(beepLength * 1000);
                this.primehub.speaker.beep(80, beepLength);
                this.primehub.speaker.beep(100, beepLength);
                this.primehub.speaker.beep(44, beepLength);
                this.primehub.speaker.beep(123, beepLength);
                return ["beep()", "Passed", "-"];
            }
            catch (error) {
                return ["beep()", "Failed", error];
            }
        });
    }
    testStartBeep() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.primehub.speaker.start_beep(60);
                yield this.sleep(this.timePerTest);
                return ["start_beep()", "Passed", "-"];
            }
            catch (error) {
                return ["start_beep()", "Failed", error];
            }
        });
    }
    setVolumeTest() {
        try {
            this.primehub.speaker.set_volume(100);
            this.primehub.speaker.set_volume(0);
            this.primehub.speaker.set_volume(50);
            return ["set_volume()", "Passed", "-"];
        }
        catch (error) {
            return ["set_volume()", "Failed", error];
        }
    }
    getVolumeTest() {
        try {
            if (this.primehub.speaker.get_volume() == 0) {
                throw "No Volume Detected";
            }
            return ["get_volume()", "Passed", "-"];
        }
        catch (error) {
            return ["get_volume()", "Failed", error];
        }
    }
    testStopBeep() {
        try {
            this.primehub.speaker.stop();
            return ["stop beep", "Passed", "-"];
        }
        catch (error) {
            return ["stop beep", "Failed", error];
        }
    }
    testLeftButtonWasPressed() {
        try {
            let pressed = this.primehub.left_button.was_pressed();
            if (typeof (pressed) != "boolean")
                throw "Returned Non-Boolean";
            return ["left_button.was_pressed()", "Passed", "-"];
        }
        catch (error) {
            return ["left_button.was_pressed()", "Failed", error];
        }
    }
    testRightButtonWasPressed() {
        try {
            let pressed = this.primehub.right_button.was_pressed();
            if (typeof (pressed) != "boolean")
                throw "Returned Non-Boolean";
            return ["right_button.was_pressed()", "Passed", "-"];
        }
        catch (error) {
            return ["right_button.was_pressed()", "Failed", error];
        }
    }
    testLeftButtonIsPressed() {
        try {
            let pressed = this.primehub.left_button.is_pressed();
            if (typeof (pressed) != "boolean")
                throw "Returned Non-Boolean";
            if (pressed)
                throw "Button should not be pressed";
            return ["left_button.is_pressed()", "Passed", "-"];
        }
        catch (error) {
            return ["left_button.is_pressed()", "Failed", error];
        }
    }
    testRightButtonIsPressed() {
        try {
            let pressed = this.primehub.right_button.is_pressed();
            if (typeof (pressed) != "boolean")
                throw "Returned Non-Boolean";
            if (pressed)
                throw "Button should not be pressed";
            return ["right_button.is_pressed()", "Passed", "-"];
        }
        catch (error) {
            return ["right_button.is_pressed()", "Failed", error];
        }
    }
    testWasGesture() {
        try {
            let gesture = this.primehub.motion_sensor.was_gesture("tap");
            if (typeof (gesture) != "boolean")
                throw "Returned Non-Boolean";
            return ["was_gesture()", "Passed", "-"];
        }
        catch (error) {
            return ["was_gesture()", "Failed", error];
        }
    }
    testGetAngles() {
        let failedTests = "";
        try {
            this.primehub.motion_sensor.get_yaw_angle();
        }
        catch (error) {
            console.error(error);
            failedTests += "Yaw Angle Test Failed. ";
        }
        try {
            this.primehub.motion_sensor.get_pitch_angle();
        }
        catch (error) {
            console.error(error);
            failedTests += "Pitch Angle Test Failed. ";
        }
        try {
            this.primehub.motion_sensor.get_roll_angle();
        }
        catch (error) {
            console.error(error);
            failedTests += "Roll Angle Test Failed. ";
        }
        if (failedTests == "")
            return (["Angles Tests", "Passed", "-"]);
        return (["Angles Tests", "Failed", failedTests]);
    }
    testGetAccelerations() {
        let failedTests = "";
        try {
            this.primehub.motion_sensor.get_yaw_acceleration();
        }
        catch (error) {
            console.error(error);
            failedTests += "Yaw Acceleration Test Failed. ";
        }
        try {
            this.primehub.motion_sensor.get_pitch_acceleration();
        }
        catch (error) {
            console.error(error);
            failedTests += "Pitch Acceleration Test Failed. ";
        }
        try {
            this.primehub.motion_sensor.get_roll_acceleration();
        }
        catch (error) {
            console.error(error);
            failedTests += "Roll Acceleration Test Failed. ";
        }
        if (failedTests == "")
            return (["Acceleration Tests", "Passed", "-"]);
        return (["Acceleration Tests", "Failed", failedTests]);
    }
    getGestureTest() {
        try {
            this.primehub.motion_sensor.get_gesture();
            return (["get_gesture()", "Passed", "-"]);
        }
        catch (error) {
            console.error(error);
            return (["get_gesture()", "Failed", error]);
        }
    }
    getOrientationTest() {
        try {
            this.primehub.motion_sensor.get_orientation();
            return (["get_orientation()", "Passed", "-"]);
        }
        catch (error) {
            console.error(error);
            return (["get_orientation()", "Failed", error]);
        }
    }
    // Some Manual Tests below, requires human verification
    // ----------------------------------------------------
    rebootHubTest() {
        this.service.rebootHub();
    }
    // Auto Test
    getHubNameTest() {
        try {
            this.service.getHubName();
            return (["getHubName()", "Passed", "-"]);
        }
        catch (error) {
            console.error(error);
            return (["getHubName()", "Failed", error]);
        }
    }
    // Auto Test
    isActiveTest() {
        try {
            this.service.isActive();
            return (["isActive()", "Passed", "-"]);
        }
        catch (error) {
            console.error(error);
            return (["isActive()", "Failed", error]);
        }
    }
    hubTappedTest() {
        try {
            let hubEvent = this.service.getHubEvent();
            if (hubEvent != "tapped")
                throw "Most recent hub action:" + this.service.getHubGesture();
            return (["Hub (Single) Tap", "Passed", "-"]);
        }
        catch (error) {
            console.error(error);
            return (["Hub (Single) Tap", "Failed", error]);
        }
    }
    hubDoubleTappedTest() {
        try {
            let hubEvent = this.service.getHubEvent();
            if (hubEvent != "doubletapped")
                throw "Most recent hub action:" + this.service.getHubGesture();
            return (["Hub (Double) Tap", "Passed", "-"]);
        }
        catch (error) {
            console.error(error);
            return (["Hub (Double) Tap", "Failed", error]);
        }
    }
    shakeTest() {
        try {
            let isShaken = (this.service.getHubGesture() == "shaken");
            if (isShaken)
                return (["Shake Hub", "Passed", "-"]);
            throw "Most recent hub action:" + this.service.getHubGesture();
        }
        catch (error) {
            console.error(error);
            return (["Shake Hub", "Failed", error]);
        }
    }
    dropTest() {
        try {
            let isInFreefall = (this.service.getHubGesture() == "freefall");
            if (isInFreefall)
                return (["Freefall/Drop", "Passed", "-"]);
            throw "Most recent hub action:" + this.service.getHubGesture();
        }
        catch (error) {
            console.error(error);
            return (["Freefall/Drop", "Failed", error]);
        }
    }
    writeAndRunCodeTest() {
        this.writeCodeTest();
    }
    writeCodeTest() {
        try {
            let pythonTestCode = `from spike import PrimeHub, LightMatrix, Button, StatusLight, ForceSensor, MotionSensor, Speaker, ColorSensor, App, DistanceSensor, Motor, MotorPair
from spike.control import wait_for_seconds, wait_until, Timer

hub = PrimeHub()

hub.light_matrix.show_image('HAPPY')`;
            this.service.writeProgram("Test Project", pythonTestCode, 0, this.runCodeTest());
        }
        catch (error) {
            console.error(error);
        }
    }
    runCodeTest() {
        try {
            this.service.executeProgram(0);
        }
        catch (error) {
            console.error(error);
        }
    }
    stopExecutionTest() {
        try {
            this.service.stopCurrentProgram();
        }
        catch (error) {
            console.error(error);
        }
    }
    leftWaitUntilPressedTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let buttonPressed = false;
                let press = () => {
                    buttonPressed = true;
                };
                this.primehub.left_button.wait_until_pressed(press);
                let attempts = 0;
                while (!buttonPressed) {
                    yield this.sleep(this.timePerTest);
                    attempts++;
                    if (attempts * this.timePerTest > this._timeout) {
                        throw ("Button not pressed within time limit" + (this._timeout / 1000) + " seconds");
                    }
                }
                return (["left wait_until_pressed()", "Passed", "-"]);
            }
            catch (error) {
                console.error(error);
                return (["left wait_until_pressed()", "Failed", error]);
            }
        });
    }
    rightWaitUntilPressedTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let buttonPressed = false;
                let press = () => {
                    buttonPressed = true;
                };
                this.primehub.right_button.wait_until_pressed(press);
                let attempts = 0;
                while (!buttonPressed) {
                    yield this.sleep(this.timePerTest);
                    attempts++;
                    if (attempts * this.timePerTest > this._timeout) {
                        throw ("Button not pressed within time limit" + (this._timeout / 1000) + " seconds");
                    }
                }
                return (["right wait_until_pressed()", "Passed", "-"]);
            }
            catch (error) {
                console.error(error);
                return (["left wait_until_pressed()", "Failed", error]);
            }
        });
    }
    leftWaitUntilReleasedTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let buttonPressed = false;
                let press = () => {
                    buttonPressed = true;
                };
                this.primehub.left_button.wait_until_released(press);
                let attempts = 0;
                while (!buttonPressed) {
                    yield this.sleep(this.timePerTest);
                    attempts++;
                    if (attempts * this.timePerTest > this._timeout) {
                        throw ("Button not pressed within time limit " + (this._timeout / 1000) + " seconds");
                    }
                }
                return (["left wait_until_released()", "Passed", "-"]);
            }
            catch (error) {
                console.error(error);
                return (["left wait_until_released()", "Failed", error]);
            }
        });
    }
    rightWaitUntilReleasedTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let buttonPressed = false;
                let press = () => {
                    buttonPressed = true;
                };
                this.primehub.right_button.wait_until_released(press);
                let attempts = 0;
                while (!buttonPressed) {
                    yield this.sleep(this.timePerTest);
                    attempts++;
                    if (attempts * this.timePerTest > this._timeout) {
                        throw ("Button not pressed within time limit " + (this._timeout / 1000) + " seconds");
                    }
                }
                return (["right wait_until_released()", "Passed", "-"]);
            }
            catch (error) {
                console.error(error);
                return (["right wait_until_released()", "Failed", error]);
            }
        });
    }
    forceSensorWaitUntilPressed() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let buttonPressed = false;
                let press = () => {
                    buttonPressed = true;
                };
                this.forceSensor.wait_until_pressed(press);
                let attempts = 0;
                while (!buttonPressed) {
                    yield this.sleep(this.timePerTest);
                    attempts++;
                    if (attempts * this.timePerTest > this._timeout) {
                        throw ("Button not pressed within time limit " + (this._timeout / 1000) + " seconds");
                    }
                }
                return (["force wait_until_pressed()", "Passed", "-"]);
            }
            catch (error) {
                console.error(error);
                return (["force wait_until_pressed()", "Failed", error]);
            }
        });
    }
    forceSensorWaitUntilReleased() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let buttonPressed = false;
                let press = () => {
                    buttonPressed = true;
                };
                this.forceSensor.wait_until_released(press);
                let attempts = 0;
                while (!buttonPressed) {
                    yield this.sleep(this.timePerTest);
                    attempts++;
                    if (attempts * this.timePerTest > this._timeout) {
                        throw ("Button not pressed within time limit " + (this._timeout / 1000) + " seconds");
                    }
                }
                return (["force wait_until_released()", "Passed", "-"]);
            }
            catch (error) {
                console.error(error);
                return (["force wait_until_released()", "Failed", error]);
            }
        });
    }
    newColorTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let detected = false;
                let colorDetected = () => {
                    detected = true;
                };
                this.colorSensor.wait_for_new_color(colorDetected);
                let attempts = 0;
                while (!detected) {
                    yield this.sleep(this.timePerTest);
                    attempts++;
                    if (attempts * this.timePerTest > this._timeout) {
                        throw ("New color not detected within time limit " + (this._timeout / 1000) + " seconds");
                    }
                }
                return (["wait_for_new_color()", "Passed", "-"]);
            }
            catch (error) {
                console.error(error);
                return (["wait_for_new_color()", "Failed", error]);
            }
        });
    }
    detectColorTest(color) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let detected = false;
                let colorDetected = () => {
                    detected = true;
                };
                this.colorSensor.wait_until_color(color, colorDetected);
                let attempts = 0;
                while (!detected) {
                    yield this.sleep(this.timePerTest);
                    attempts++;
                    if (attempts * this.timePerTest > this._timeout) {
                        throw ("Color not detected within time limit " + (this._timeout / 1000) + " seconds");
                    }
                }
                return (["wait_until_color()", "Passed", "-"]);
            }
            catch (error) {
                console.error(error);
                return (["wait_until_color()", "Failed", error]);
            }
        });
    }
    distanceCloserThanTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let detected = false;
                let distDetected = () => {
                    detected = true;
                };
                this.distSensor.wait_for_distance_closer_than(10, 'cm', distDetected);
                let attempts = 0;
                while (!detected) {
                    yield this.sleep(this.timePerTest);
                    attempts++;
                    if (attempts * this.timePerTest > this._timeout) {
                        throw ("Distance not detected within time limit " + (this._timeout / 1000) + " seconds");
                    }
                }
                return (["wait_for_distance_closer_than()", "Passed", "-"]);
            }
            catch (error) {
                console.error(error);
                return (["wait_for_distance_closer_than()", "Failed", error]);
            }
        });
    }
    distanceFartherThanTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let detected = false;
                let distDetected = () => {
                    detected = true;
                };
                this.distSensor.wait_for_distance_farther_than(10, 'cm', distDetected);
                let attempts = 0;
                while (!detected) {
                    yield this.sleep(this.timePerTest);
                    attempts++;
                    if (attempts * this.timePerTest > this._timeout) {
                        throw ("Distance not detected within time limit " + (this._timeout / 1000) + " seconds");
                    }
                }
                return (["wait_for_distance_farther_than()", "Passed", "-"]);
            }
            catch (error) {
                console.error(error);
                return (["wait_for_distance_farther_than()", "Failed", error]);
            }
        });
    }
}

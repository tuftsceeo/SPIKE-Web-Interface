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
}
window.onload = () => {
    let spikeService = document.getElementById("service_spike");
    spikeService.innerHTML = `<service-spike align = center id = "serviceDock"></service-spike>`;
    //@ts-ignore
    let activeService = document.getElementById("serviceDock").getService();
    activeService.executeAfterInit(function () {
        return __awaiter(this, void 0, void 0, function* () {
            const test = new UnitTest(activeService);
            runUnitTest(test);
        });
    });
};
let runUnitTest = (test) => {
    let portCheckInterval = setInterval(() => { portChecks(test); }, 1000);
};
// Checks if all ports have correct sensors attached, 
// displays appropriate data to the user in a table
let portChecks = (test) => {
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
        }
    });
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

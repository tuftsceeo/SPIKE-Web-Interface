
class UnitTest {
    private service: any; // Should be an initialized SPIKE Service

    // Public constants
    public static get MED_MOTORS_PORTS() { return ['A', 'B'] };
    public static get LARGE_MOTORS_PORTS() { return ['C'] };
    public static get DIST_SENSOR_PORTS() { return ['D'] };
    public static get FORCE_SENSOR_PORTS() { return ['E'] };
    public static get COLOR_SENSOR_PORTS() { return ['F'] };

    constructor(initializedService) {
        this.service = initializedService;
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

}

window.onload = () => {
    let spikeService = document.getElementById("service_spike"); 
    spikeService.innerHTML = `<service-spike align = center id = "serviceDock"></service-spike>`;
    //@ts-ignore
    let activeService = document.getElementById("serviceDock").getService();
    activeService.executeAfterInit(async function() {
        const test:UnitTest = new UnitTest(activeService);
        runUnitTest(test);
    })
    
}

let runUnitTest = (test:UnitTest) => {
    let portCheckInterval = setInterval(() => {portChecks(test)}, 1000);
    
}

// Checks if all ports have correct sensors attached, 
// displays appropriate data to the user in a table
let portChecks = (test:UnitTest) => {
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
        }
    });
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


## Using Sensors to Move SPIKE Prime
In this example, we will link a ForceSensor to a Motor. The percentage of force we retrieve from the ForceSensor will be used as the speed with which to run the Motor. Previously, we had predetermined ports to which the Sensors and Motors are connected to, but this time we will work with a scenario when we do NOT know which ports the users will use.

## Starter code
We start with some HTML that will show the percentage of force on the ForceSensor and the speed of the Motor.
```html
<html>
    <head>
        <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface@1.0/cdn/ServiceDock.min.js"></script>
    </head>

    <body>
        <div id="servicedock" style="float:right;">
            <service-spike id="service_spike"></service-spike>
        </div>
        <div id="demobox">
            <div>
                FORCE output:
                <h1 id="forceReading">
                    force_sensor output will show here
                </h1>
            </div>
            <div>
                MOTOR speed:
                <h1 id = "speedReading">
                    motor_sensor output will show here
                </h1>
            </div>
        </div>
    </body>
    <script>
        /* SPIKE Service code*/
        var serviceSPIKE = document.getElementById("service_spike").getService();

        /* DOM references */
        var forceReading = document.getElementById("forceReading");
        var speedReading = document.getElementById("speedReading");

        serviceSPIKE.executeAfterInit( function () {

            console.log("SPIKE Service is initialized!");

        });
    </script>
```

## Getting connected devices
The way to get objects connected to a Motor is by using the `getMotors()` method. You may also use `getMotorPorts()` and declare a Motor object yourself, but here we will use `getMotors()` to skip that step. Likewise with ForceSensors, we can use the `getForceSensors()` method. 

```javascript
serviceSPIKE.executeAfterInit( function () {

    console.log("SPIKE Service is initialized!");

    var motorObjects = serviceSPIKE.getMotors();
    var forceSensorObjects = serviceSPIKE.getForceSensors();
})
```

`motorObjects` and `forceSensorObjects` are arrays of connected Motor and ForceSensor objects, respectively. The array is alphabetically ordered by ports, and we will only get the most alphabetically earliest available port.

```javascript
serviceSPIKE.executeAfterInit( function () {

    console.log("SPIKE Service is initialized!");

    var motorObjects = serviceSPIKE.getMotors();
    var forceSensorObjects = serviceSPIKE.getForceSensors(); 

    var force_sensor = forceSensorObjects[0];
    var motor = motorObjects[0];
})
```

## Set speed of Motor

We want to continuously map ForceSensor's percentage force to Motor's speed, so we use `setInterval()`. To get the ForceSensor's force percentage, we used `get_force_percentage()`. Not only will we use this value to set the Motor's speed, we will also display this value with the Motor's speed, which can be retrieved with `get_speed()`. We did not use an `else` statement with the SPIKE Service activity check because we want to allow the user to reconnect their SPIKE Prime and still use the web page without refreshing it.

```javascript
 var intervalSPIKE = setInterval (function () {

    if (serviceSPIKE.isActive() === true) {

        var force = force_sensor.get_force_percentage();
        
        motor.start(force);
        var speed = motor.get_speed();
        
        forceReading.innerHTML = force + " %";
        speedReading.innerHTML = speed;
    }
}, 200);
```

## Final code
Here is the final code you should end up with! 

```html
<html>
    <head>
        <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface@1.0/cdn/ServiceDock.min.js"></script>
    </head>

    <body>
        <div id="servicedock" style="float:right;">
            <service-spike id="service_spike"></service-spike>
        </div>
        <div id="demobox">
            <div>
                FORCE output:
                <h1 id="forceReading">
                    force_sensor output will show here
                </h1>
            </div>
            <div>
                MOTOR speed:
                <h1 id = "speedReading">
                    motor_sensor output will show here
                </h1>
            </div>
        </div>
    </body>
    <script>
        /* SPIKE Service code*/
        var serviceSPIKE = document.getElementById("service_spike").getService();

        /* DOM references */
        var forceReading = document.getElementById("forceReading");
        var speedReading = document.getElementById("speedReading");

        serviceSPIKE.executeAfterInit(function () {

            console.log("SPIKE Service is initialized!");
        
            var forceSensorObjects = serviceSPIKE.getForceSensors(); // get all ForceSensors connected to SPIKE Prime
            var motorObjects = serviceSPIKE.getMotors(); // get all Motors connected to SPIKE Prime

            // pick devices connected to the port earliest in the alphabet
            var force_sensor = forceSensorObjects[0];
            var motor = motorObjects[0];

            var intervalSPIKE = setInterval (function () {

                if (serviceSPIKE.isActive() === true) {
                    
                    // display force sensor output
                    var force = force_sensor.get_force_percentage();
                    
                    motor.start(force); // run motor at speed given by the force_sensor's percentage output
                    var speed = motor.get_speed();
                    
                    // display readings
                    forceReading.innerHTML = force + " %";
                    speedReading.innerHTML = speed;
                }
            }, 200);
        });
    </script>

</html>
```



<iframe id="example-result" width="100%" height="800" frameborder="0" src="servicedock_forceToMotor.html"></iframe>
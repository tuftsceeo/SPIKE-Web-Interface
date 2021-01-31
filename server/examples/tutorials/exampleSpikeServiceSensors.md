## Using Sensors in SPIKE Prime
In this example, we will display readings from the DistanceSensor, ColorSensor, ForceSensor on the web page. 

We will retrieve the distance in centimeters from the DistanceSensor with `get_distance_cm()`, the detected color from the ColorSensor with `get_color()`, and the force in newtons with `get_force_newton()`. Bear in mind these are not the only pieces of information that can be retrieved from these sensors. 

## Starter Code
The following is the starter code. Inside the div 'demobox', the readings from the sensors will be displayed by editing the innerHTML property of the `<h1>` tags. 

We already declared the references to these DOM elements and wrote the basic starter functions for the SPIKE Service, which are declaring `serviceSPIKE` and writing `executeWithStream()` inside `<script>`. 

```html
    <head>
        <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface/cdn/ServiceDock.js"
            type="text/javascript"></script>
    </head>
    <body>
        <div id="servicedock" style="float:right;">
            <service-spike id="service_spike"></service-spike>
        </div>
        <div id="demobox">
            <div>
                DISTANCE output:
                <h1 id="distanceReading">
                    distance_sensor output will show here
                </h1>
            </div>
            <div>
                COLOR output:
                <h1 id="colorReading">
                    color_sensor output will show here
                </h1>
            </div>
            <div>
                FORCE output:
                <h1 id="forceReading">
                    force_sensor output will show here
                </h1>
            </div>
        </div>
    </body>
    <script>
        /* SPIKE Service code*/
        var serviceSPIKE = document.getElementById("service_spike").getService();

        /* DOM references */
        var distanceReading = document.getElementById("distanceReading");
        var colorReading = document.getElementById("colorReading");
        var forceReading = document.getElementById("forceReading");

        serviceSPIKE.executeAfterInit( function () {

            console.log("SPIKE Service is initialized!");
        })

    </script>
```

## Declaring the Sensor objects
When we declare the Sensors, much like the Motor object, we will refer to the SPIKE Service object, `serviceSPIKE`. For example, to declare the `DistanceSensor` connected to port A, you do
```javascript
var distance_sensor = new serviceSPIKE.DistanceSensor("A");
```
The declaration of other types of Sensors are very similar. 

```javascript
var color_sensor = new serviceSPIKE.ColorSensor("B"); 
var force_sensor = new serviceSPIKE.ForceSensor("C");
```

When no sensors are detected at the specified ports during these declarations, ServiceDock will throw an error that you will have to catch, or else it may cause unexpected connectivity issues. However, for the sake for simplicity we will not try/catch at the moment. See LINK TO GETMOTORPORTS EXAMPLE to get automatically get ports a certain module is connected to. 

## Getting and displaying the Sensor readings
The API for getting the Sensor readings in SPIKE Service is similar to how it's done with micropython. Each of these intuitive functions get information from their respective sensors.

```javascript
var distanceInCM = distance_sensor.get_distance_cm();
var color = color_sensor.get_color();
var force = force_sensor.get_force_newton();
```

Remember when we declared the DOM elements for displaying the sensor readings? We will now use those references to show `distanceInCM`, `color`, and `force` on the webpage by editing their `innerHTML`.
```javascript
distanceReading.innerHTML = distanceInCM + " cm";
colorReading.innerHTML = color;
forceReading.innerHTML = force + " newtons";
```

If we piece together what we wrote so far, we should get a `<script>` that looks like this. Are we done?
```html
<script>
    /* SPIKE Service code*/
    var serviceSPIKE = document.getElementById("service_spike").getService();

    /* DOM references */
    var distanceReading = document.getElementById("distanceReading");
    var colorReading = document.getElementById("colorReading");
    var forceReading = document.getElementById("forceReading");

    serviceSPIKE.executeAfterInit( function () {

        console.log("SPIKE Service is initialized!");
        
        var distance_sensor = new serviceSPIKE.DistanceSensor("A"); // get the DistanceSensor connected to port A
        var color_sensor = new serviceSPIKE.ColorSensor("B"); // get the ColorSensor connected to port B
        var force_sensor = new serviceSPIKE.ForceSensor("C"); // get the ForceSensor connected to port C
        
        // get sensor readings
        var distanceInCM = distance_sensor.get_distance_cm();
        var color = color_sensor.get_color();
        var force = force_sensor.get_force_newton();
        
        // display sensor readings
        distanceReading.innerHTML = distanceInCM + " cm";
        colorReading.innerHTML = color;
        forceReading.innerHTML = force + " newtons";
    });
</script>
```
NO! Unfortunately if you end with this, your web page will only display the very first set of readings from the Sensors, but it will no longer display the subsequent readings after that. What we need is a way to execute code that display the readings continuously. Hence, we use Javascript's function `setInterval`. `setInterval` takes a function for its first parameter and a duration of time in miliseconds in its second parameter. It will run the given function EVERY certain amount of miliseconds. Although this may vary by your technology, we will execute the function every 200 miliseconds. 

```javascript
var intervalSPIKE = setInterval( function () {
    
    // get sensor readings
    var distanceInCM = distance_sensor.get_distance_cm();
    var color = color_sensor.get_color();
    var force = force_sensor.get_force_newton();

    
    // display sensor readings
    distanceReading.innerHTML = distanceInCM + " cm";
    colorReading.innerHTML = color;
    forceReading.innerHTML = force + " newtons";
}, 200);
```
This function will run every 200 miliseconds, even after your SPIKE Service gets deactivated. If you were to leave your computer idle for a few hours, it would overheat! We will add an if statement that checks if SPIKE Service is active with `isActive()`. We will display the sensor outputs only when SPIKE Service is active. When the SPIKE Prime disconnects from ServiceDock, we will clear the interval we set, so nothing needlessly runs every 200 miliseconds. However, if you were to want to allow reconnection of SPIKE Prime in the same web page without refreshing the page, you can remove the `else` statement of `if(spikeService.isActive() === true)`. 

```javascript
var intervalSPIKE = setInterval( function () {

    if (spikeService.isActive() === true) {

        /* SPIKE Service is active */

        // get sensor readings
        var distanceInCM = distance_sensor.get_distance_cm();
        var color = color_sensor.get_color();
        var force = force_sensor.get_force_newton();


        // display sensor readings
        distanceReading.innerHTML = distanceInCM + " cm";
        colorReading.innerHTML = color;
        forceReading.innerHTML = force + " newtons";
    }
    else {
        clearInterval(intervalSPIKE);
    }
}, 200);
```


## Final HTML
Combine everything so far, and you should end with this! Try out the example by connecting your DistanceSensor to port A, the ColorSensor to port B, and the ForceSensor to port C. 

```html
<html>
    <head>
        <script src="./modules/ServiceDock_SPIKE.js"></script>
    </head>

    <body>
        <div id="servicedock" style="float:right;">
            <service-spike id="service_spike"></service-spike>
        </div>
        <div id="demobox">
            <div>
                DISTANCE output:
                <h1 id="distanceReading">
                    distance_sensor output will show here
                </h1>
            </div>
            <div>
                COLOR output:
                <h1 id="colorReading">
                    color_sensor output will show here
                </h1>
            </div>
            <div>
                FORCE output:
                <h1 id="forceReading">
                    force_sensor output will show here
                </h1>
            </div>
        </div>
    </body>
    <script>
        /* SPIKE Service code*/
        var serviceSPIKE = document.getElementById("service_spike").getService();

        /* DOM references */
        var distanceReading = document.getElementById("distanceReading");
        var colorReading = document.getElementById("colorReading");
        var forceReading = document.getElementById("forceReading");

        serviceSPIKE.executeAfterInit(function () {

            console.log("SPIKE Service is initialized!");

            var distance_sensor = new serviceSPIKE.DistanceSensor("A"); // get the DistanceSensor connected to port A
            var color_sensor = new serviceSPIKE.ColorSensor("B"); // get the ColorSensor connected to port B
            var force_sensor = new serviceSPIKE.ForceSensor("C"); // get the ForceSensor connected to port C

            // execute this function every 200 miliseconds
            var intervalSPIKE = setInterval(function () {

                if (serviceSPIKE.isActive() === true) {

                    /* SPIKE Service is active */

                    // get sensor readings
                    var distanceInCM = distance_sensor.get_distance_cm();
                    var color = color_sensor.get_color();
                    var force = force_sensor.get_force_newton();


                    // display sensor readings
                    distanceReading.innerHTML = distanceInCM + " cm";
                    colorReading.innerHTML = color;
                    forceReading.innerHTML = force + " newtons";
                }
                else {

                    /* SPIKE Service is inactive */

                    clearInterval(intervalSPIKE); // clear the setInterval (function will no longer run every 200 seconds)
                }
            }, 200);
        });
    </script>
</html>
```
<iframe id="example-result" width="100%" height="800" frameborder="0" src="servicedock_basicSensors.html"></iframe>
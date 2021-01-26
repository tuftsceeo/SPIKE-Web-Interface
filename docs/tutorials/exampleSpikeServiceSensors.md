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
    <body style="background-image: url('./modules/views/CEEOInnovationsbackground.png');">
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

## Getting the Sensor readings
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
NO! Unfortunately if you end with this, your web page will only display the very first set of readings from the Sensors, but it will no longer display the subsequent readings after that. What we need is a way to execute code that display the readings as the SPIKE Prime sends its sensor data stream. Hence, we use `executeWithStream`. `executeWithStream`, like `executeAfterInit` takes a callback function that it runs continuously as long as SPIKE Service is activated! Also note that you do not necessarily need to use `executeWithStream`. You can use Javascript's built-in function `setInterval` that runs a piece of code every user-defined amount of time. But we won't get into that right now.

We want to display the values with SPIKE Prime's data stream, so move the code that gets the sensor readings and displays them inside the callback function of `executeWithStream`
```javascript
// execute alongside SPIKE's data stream
serviceSPIKE.executeWithStream( function () {
    
    /* code inside executeWithStream's callback will continuously run as long as SPIKE Service is active */
    
    // get sensor readings
    var distanceInCM = distance_sensor.get_distance_cm();
    var color = color_sensor.get_color();
    var force = force_sensor.get_force_newton();

    
    // display sensor readings
    distanceReading.innerHTML = distanceInCM + " cm";
    colorReading.innerHTML = color;
    forceReading.innerHTML = force + " newtons";
});
```
We don't want to include the declarations of the Sensor objects inside the callback function of `executeWithStream` because we can declare them once and interact with them in the stream.

## Final HTML
Combine everything so far, and you should end with this! Try out the example by connecting your DistanceSensor to port A, the ColorSensor to port B, and the ForceSensor to port C. 

```html
<html>

    <head>
        <script src = "./modules/ServiceDock_SPIKE.js"></script>
    </head>

    <body style="background-image: url('./modules/views/CEEOInnovationsbackground.png');">
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
            
            var distance_sensor = new serviceSPIKE.DistanceSensor("A"); // get the DistanceSensor connected to port A
            var color_sensor = new serviceSPIKE.ColorSensor("B"); // get the ColorSensor connected to port B
            var force_sensor = new serviceSPIKE.ForceSensor("C"); // get the ForceSensor connected to port C

            // execute alongside SPIKE's data stream
            serviceSPIKE.executeWithStream( function () {
                
                /* code inside executeWithStream's callback will continuously run as long as SPIKE Service is active */
                
                // get sensor readings
                var distanceInCM = distance_sensor.get_distance_cm();
                var color = color_sensor.get_color();
                var force = force_sensor.get_force_newton();

                
                // display sensor readings
                distanceReading.innerHTML = distanceInCM + " cm";
                colorReading.innerHTML = color;
                forceReading.innerHTML = force + " newtons";
            });
        });
    </script>

</html>
```
<iframe id="example-result" width="100%" height="800" frameborder="0" src="servicedock_basicSensors.html"></iframe>
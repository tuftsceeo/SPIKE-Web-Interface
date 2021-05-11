## Pong with two SPIKE Primes
In this example we will use two DistanceSensors, each connected to separate SPIKE Primes, and determine when either one detects a surface 10 cm away from. You will be able to connect your DistanceSensors to any port of your choosing. 

## Multiple SPIKE Services

The SPIKE Services are scalable. First, we will need to add two `<service-spike>` elements to the DOM as such
```html
<div id="servicedock" style="float:right;">

    <!-- SPIKE Service 1 <service-spike> -->
    <service-spike id = "service_spike1"></service-spike>
    <div style = "margin: 5px;">serviceSPIKE1</div>

    <!-- SPIKE Service 2 <service-spike> -->
    <service-spike id="service_spike2"></service-spike>
    <div style = "margin: 5px;" >serviceSPIKE2</div>

</div>
```

We will also add the HTML that displays the message of whether serviceSPIKE1 or serviceSPIKE2's DistanceSensor gets an output of more than 10 cm.
```html
<div id="demobox">
    <h1 id = "message">
        When will either DistanceSensor be farther than 10 cm away from their surfaces?
    </h1>
</div>
```
Second, as usual, we will declare the SPIKE Service objects and begin with their `executeAfterInit()` methods. 

```javascript
/* get two SPIKE Services */
const serviceSPIKE1 = document.getElementById("service_spike1").getService();
const serviceSPIKE2 = document.getElementById("service_spike2").getService();

/* DOM references */
var message = document.getElementById("message");

serviceSPIKE1.executeAfterInit(function () {
    console.log("serviceSPIKE1 was initialized! ");

    var distanceSensorObjects = serviceSPIKE1.getDistanceSensors();
    var serviceSPIKE1Distance = distanceSensorObjects[0];
})
serviceSPIKE2.executeAfterInit(async function () {
    console.log("serviceSPIKE2 was initialized! ");

    var distanceSensorObjects = serviceSPIKE2.getDistanceSensors();
    var servicesSPIKE2Distance = distanceSensorObjects[0];
})
```

That's all you need to use two SPIKE Services! If you were to use three, you would do what you would have done for one SPIKE Service thrice. Don't forget to assign them unique names, such as `serviceSPIKE1` and `serviceSPIKE2`. 

## Finding when DistanceSensor reaches above 10 cm of output

We will again use Javascript's asynchronous callbacks to execute code when either DistanceSensor reaches its threshold. With `wait_for_distance_farther_than({distance}, {unit}, {callback function} )`, we can specify in which condition to run the callback function. We will display to the webpage when a DistanceSensor goes over its target distance. 

Here is the callback function for serviceSPIKE1's DistanceSensor. 
```javascript
serviceSPIKE1Distance.wait_for_distance_farther_than(10, 'cm', function () {
                
    message.innerHTML = "serviceSPIKE1's DistanceSensor is 10 cm away from their facing surface!"
});
```

## Final Code
Do the same for serviceSPIKE2's DistanceSensor, and you should get this result!

```html
<html>
    <head>
        <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface@1.0/cdn/ServiceDock.min.js"></script>
    </head>

    <body>
        <div id="servicedock" style="float:right;">
            <service-spike id="service_spike1"></service-spike>
            <div style="margin: 5px;">serviceSPIKE1</div>
            <service-spike id="service_spike2"></service-spike>
            <div style="margin: 5px;">serviceSPIKE2</div>
        </div>
        <div id="demobox">
            <h1 id = "message">
                When will either DistanceSensor be farther than 10 cm away from their surfaces?
            </h1>
        </div>
    </body>
    <script>
        /* SPIKE Service code */

        var serviceSPIKE1 = document.getElementById("service_spike1").getService();
        var serviceSPIKE2 = document.getElementById("service_spike2").getService();

        /* DOM references */
        var message = document.getElementById("message");

        serviceSPIKE1.executeAfterInit(function () {

            console.log("SPIKE Service 1 is initialized!");

            var distanceSensorObjects = serviceSPIKE1.getDistanceSensors();

            var serviceSPIKE1Distance = distanceSensorObjects[0];

            serviceSPIKE1Distance.wait_for_distance_farther_than(10, 'cm', function () {
                
                /* this function will be executed after the DistanceSensor connected to SPIKE Service 1 is farther than 10 cm from its facing surface */
                
                message.innerHTML = "serviceSPIKE1's DistanceSensor is 10 cm away from their facing surface!"
            })
        });

        serviceSPIKE2.executeAfterInit( function () {

            console.log("SPIKE Service 2 is initialized!");

            var distanceSensorObjects = serviceSPIKE2.getDistanceSensors();

            var servicesSPIKE2Distance = distanceSensorObjects[0];

            servicesSPIKE2Distance.wait_for_distance_farther_than(10, 'cm', function () {

                /* this function will be executed after the DistanceSensor connected to SPIKE Service 2 is farther than 10 cm from its facing surface */
                
                message.innerHTML = "servicesSPIKE2's DistanceSensor is 10 cm away from their facing surface!"
            })
        });
    </script>

</html>
```

<iframe id="example-result" width="100%" height="800" frameborder="0" src="servicedock_twoHubs.html"></iframe>
## ServiceDock HTML template
Begin your HTML file with the ServiceDock template and include `<service-spike>`, the SPIKE Service's DOM element. Once you render this page, you should only see your ServiceDock on the top left corner of your page with the SPIKE Service button. Refer to code below for the template.

```HTML
<html>
    <head>
        <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface@0.1.1/cdn/ServiceDock.min.js"></script>
    </head>
    <body>
        <div id="servicedock" style="float:right;">
            <service-spike id="service_spike"></service-spike>
        </div>
    </body>
    <script>
        // Use ServiceDock here!
    </script>
</html>
```

## Initializing SPIKE Service
You can connect your SPIKE Prime to ServiceDock. Try clicking on the button and selecting the serial port to which your brick is connected. 

The status light for your SPIKE Service should have turned from red to green. You just initialized the SPIKE Service. In this tutorial, we will use the SPIKE Service to start a Motor. 

## Obtaining SPIKE Service object
Although what you just clicked was the `<service-spike>` element, what was initialized is the SPIKE Service object that can be obtained by running `getService()` on the `<service-spike>` element as such:

```javascript
var buttonServiceSPIKE = document.getElementById("service_spike");
var serviceSPIKE = buttonServiceSPIKE.getService();
```

`serviceSPIKE` is the SPIKE Service object with which you can program with your SPIKE Prime. The SPIKE Service, `serviceSPIKE`, gets automatically initialized when the user of your webpage clicks on `<service-spike>` and connects their SPIKE Prime to Google Chrome. So far, your `<script>` should look like this

```html
<script>
    var buttonServiceSPIKE = document.getElementById("service_spike");
    var serviceSPIKE = buttonServiceSPIKE.getService();
</script>
```

## Programming with SPIKE Service

You will now write the code within the `<script>` that, after SPIKE Service is initialized, starts the Motor that is connected to port "A". 

First, you need to make sure that the code you write will execute after the SPIKE Service initializes. If you were to execute the code before initialization, you would be attempting to run a motor when your ServiceDock is not even connected to your SPIKE Prime.

The method below allows you to write code that runs after initialization.

```javascript
serviceSPIKE.executeAfterInit( function () {
    // code in this scope will be executed after SPIKE Service is initialized
});
```

Notice that a function was passed in as a paramter to `executeAfterInit()`. 

## SPIKE Service Motor object
Next, you have to start the Motor in the callback function of `executeAfterInit()`. The Motor object can be declared be referring to `serviceSPIKE` and getting a Motor connected to port A:
```javascript
var motor = new serviceSPIKE.Motor("A");
```
Note that if no Motor is detected at port A when you declare this Motor object, ServiceDock will throw an error, so it is very important to declare these in the callback function of `executeAfterInit()`. 

To start `motor` with speed of 100, all you need to do is the following, much like micropython.
```javascript
motor.start(100);
```
There are more things you can do with a Motor than this! Refer to the API documentation to find the Motor object and its methods. You can find more interfaces other than the Motor in the API documentation. Feel free to change things up, but the code below will simply start the motor with speed of 100. 

We now piece together the SPIKE Service code we wrote above as such

```javascript
serviceSPIKE.executeAfterInit( function () {
    console.log("SPIKE Service is initialized!");

    // declare Motor object at port "A"
    var motor = new serviceSPIKE.Motor("A")

    // start Motor at speed 100
    motor.start(100)
})
```

## Running the Example
Now save the HTML and run the web page again. Connect a Motor to port "A". Click the SPIKE Service button, and see your motor run. The final HTML is below.

```html
<html>
    <head>
        <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface@0.1.1/cdn/ServiceDock.min.js"></script>
    </head>
    <body>
        <div id="servicedock" style="float:left;">
            <!-- this style must be kept for normal visualization-->
            <service-spike id="service_spike"></service-spike>
        </div>
    </body>
    <script>
        var buttonServiceSPIKE = document.getElementById("service_spike"); // get <service-spike>
        var serviceSPIKE = buttonServiceSPIKE.getService(); // get SPIKE Service object

        
        serviceSPIKE.executeAfterInit(function () {

            /* all code inside the callback function of executeAfterInit will run only after SPIKE Service is initialized */

            console.log("SPIKE Service is initialized!");

            var motor = new serviceSPIKE.Motor("A"); // get the Motor object connected to port A

            motor.start(100); // start the Motor at speed 100
        })

    </script>
</html>
```

<!-- Taken from documentation folder, which got the files from examples --->
<iframe id="example-result" width="100%" height="800" frameborder="0" src="servicedock_simpleMotor.html"></iframe>
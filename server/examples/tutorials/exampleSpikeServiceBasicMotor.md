## ServiceDock HTML template
Begin your HTML file with the ServiceDock template and include \<service-spike>, the SPIKE Service. Once you render this page, you should only see your ServiceDock on the top left corner of your page with the SPIKE Service button. Refer to code below for the template.

```HTML
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
        // Use ServiceDock here!
    </script>
</html>
```

## Initializing SPIKE Service
You can connect your SPIKE Prime to ServiceDock. Try clicking on the button and selecting the serial port to which your brick is connected. 

The status light for your SPIKE Service should have turned from red to green. You just initialized the SPIKE Service. In this tutorial, we will use the SPIKE Service to start a Motor. 

## Programming ServiceDock

Let's go back to the HTML file. You will now write the code within the \<script> that, after SPIKE Service is initialized, starts the Motor that is connected to port "A". First, you need to make sure that the code you write will execute after the SPIKE Service initializes. If you were to execute the code before initialization, you would be attempting to run a motor when your ServiceDock is not even connected to your SPIKE Prime.

The method below allows you to write code that runs after initialization.

```javascript
mySPIKE.executeAfterInit( function () {
    // code in this scope will be executed after SPIKE Service is initialized
})
```

Next, you have to start the Motor in the scope. Refer to the API documentation to find the Motor object and its methods. You can find more interfaces other than the Motor in the API documentation. Feel free to change things up, but the code below will simply start the motor with speed of 100.

```javascript
mySPIKE.executeAfterInit( function () {

    // declare Motor object at port "A"
    var motor = new mySPIKE.Motor("A")

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
        var mySPIKE = document.getElementById("service_spike").getService()

        mySPIKE.executeAfterInit(function () {

            var motor = new mySPIKE.Motor("A")

            motor.start(100)
        })

    </script>
</html>
```

<!-- Taken from documentation folder, which got the files from examples --->
<iframe id="example-result" width="100%" height="800" frameborder="0" src="servicedock_simpleMotor.html"></iframe>
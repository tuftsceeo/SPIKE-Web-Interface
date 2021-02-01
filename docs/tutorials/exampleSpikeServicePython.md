## Running Pre-Loaded Programs
For cases when a project seems better suited to MicroPython control rather than JavaScript, but you still want to connect it to a webpage, the JavaScript library allows you to upload and run MicroPython programs using the SPIKE Service. The following program, for example, would simply run whatever was pre-loaded into slot 1 on the SPIKE Prime:

```HTML
<html>
    <head>
        <script type="text/javascript" src="./modules/ServiceDock_SPIKE.js"></script>
    </head>
    <body>
        <div id="servicedock" style="float:left;">
            <service-spike id="service_spike"></service-spike>
        </div>
    </body>
    <script>
        var serviceSPIKE = document.getElementById("service_spike").getService()

        serviceSPIKE.executeAfterInit(function () {

            serviceSPIKE.executeProgram(1)
        })
    </script>
</html>
```

## Writing Programs to the SPIKE
In some cases, we may not know all of the python code before beginning the program, such as when taking speeds or distances as user input. Instead of using pre-loaded code, then, we have to write code to the hub using writeProgram(projectName, data, slotid, callback). The following example is of a robotic car, with motors plugged into ports "A" and "B," that drives a user-specified distance (in wheel rotations) when the "Go" button is pressed:

```HTML
<html>
    <head>
        <script type="text/javascript" src="./modules/ServiceDock_SPIKE.js"></script>
        <style>
            #controls {
                text-align: center;
                padding: 20px;
            }
        </style>
    </head>
    <body>
        <div id="servicedock" style="float:left;">
            <service-spike id="service_spike"></service-spike>
        </div>
        <div id="controls">
            <label for="dist-box">Distance (wheel rotations):</label>
            <input id="dist-box">
            <button onclick="goCurrentDistance()">Go!</button>
        </div>
    </body>
    <script>
        var serviceSPIKE = document.getElementById("service_spike").getService()

        function goCurrentDistance() {
            // getting distance from textbox input, or setting it to zero if input is invalid
            distance = document.getElementById("dist-box").value
            if(isNaN(distance))
                distance = 0
            
            // writing micropython program to hub slot 0 using specified distance
            // in this example, the python lines are in separate strings for readability, but this is not necessary as long as the whitespace is correct
            serviceSPIKE.writeProgram("drive distance", "from spike import MotorPair \n"
                                                    + "driveTrain = MotorPair('A', 'B') \n"
                                                    + "driveTrain.move(" + distance + ", 'rotations', 0)", 
                                 0), function() { serviceSPIKE.executeProgram(0) }; // note the callback function- this runs after the code is successfully uploaded to the SPIKE, and in this case tells the SPIKE to run whatever was just uploaded
        }
    </script>
</html>
```
<iframe id="example-result" width="100%" height="800" frameborder="0" src="servicedock_usingPython.html"></iframe>

And here would be the same program purely in JavaScript, for comparison:

```HTML
<html>
    <head>
        <script type="text/javascript" src="./modules/ServiceDock_SPIKE.js"></script>
        <style>
            #controls {
                text-align: center;
                padding: 20px;
            }
        </style>
    </head>
    <body>
        <div id="servicedock" style="float:left;">
            <service-spike id="service_spike"></service-spike>
        </div>
        <div id="controls">
            <label for="dist-box">Distance (wheel rotations):</label>
            <input id="dist-box">
            <button onclick="goCurrentDistance()">Go!</button>
        </div>
    </body>
    <script>
        var serviceSPIKE = document.getElementById("service_spike").getService()
        var leftWheel, rightWheel;

        // initializing left and right wheen variables for later use (cannot be done until SPIKE itself is initialized)
        serviceSPIKE.executeAfterInit(function() {
            leftWheel = serviceSPIKE.Motor('A')
            rightWheel = serviceSPIKE.Motor('B')
        })

        function goCurrentDistance() {
            // getting distance from textbox input, or setting it to zero if input is invalid
            distance = document.getElementById("dist-box").value
            if(isNaN(distance))
                distance = 0
            
            // running motors specified distance
            leftWheel.run_for_degrees(360 * distance)
            rightWheel.run_for_degrees(360 * distance)
        }
    </script>
</html>
```

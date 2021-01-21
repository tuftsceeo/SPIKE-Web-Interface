## Python Integration
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
        var mySPIKE = document.getElementById("service_spike").getService()

        mySPIKE.executeAfterInit(function () {

            mySPIKE.executeProgram(1)
        })
    </script>
</html>
```

## Writing Programs to the SPIKE
In some cases, we may not know all of the python code before beginning the program, such as when taking speeds or distances as user input. Instead of using pre-loaded code, then, we have to write code to the hub using writeProgram(projectName, data, slotid, callback). The following example is of a robotic car, with motors plugged into ports "A" and "B," that drives a user-specified distance when the "Go" button is pressed. It also uses stopCurrentProgram() to give the user a failsafe in case they input a wrong distance:

```HTML
<html>
    <head>
        <script type="text/javascript" src="./modules/ServiceDock_SPIKE.js"></script>
    </head>
    <body>
        <div id="servicedock" style="float:left;">
            <service-spike id="service_spike"></service-spike>
        </div>
        <!-- text input goes here -->
        <button>Stop</button>
    </body>
    <script>
        var mySPIKE = document.getElementById("service_spike").getService()
        
        function goDistance(dist) {
            mySPIKE.writeProgram("drive distance", "", 0);
        }

        function abort() {
            mySPIKE.stopCurrentProgram()
        }
    </script>
</html>
```
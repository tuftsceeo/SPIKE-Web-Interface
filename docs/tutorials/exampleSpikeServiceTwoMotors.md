## Moving Multiple Motors
Unlike in the Python library, the JavaScript functions for running motors for specific distances or times are **non-blocking**. This is helpful if you want to, say, make two different motors go specified distances at the same time, without having to worry about directly checking sensors. The following example code makes two motors, plugged into ports 'A' and 'B,' start at the same time and each move one full rotation at differing speeds.

```HTML
<html>
    <head>
        <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface@0.1.1/cdn/ServiceDock.min.js"></script>
    </head>
    <body>
        <div id="servicedock" style="float:left;">
            <service-spike id="service_spike"></service-spike>
        </div>
    </body>
    <script>
        var mySPIKE = document.getElementById("service_spike").getService()

        mySPIKE.executeAfterInit(function () {

            var fastMotor = new mySPIKE.Motor("A")
            var slowMotor = new mySPIKE.Motor("B")

            fastMotor.run_for_degrees(360, 100)
            slowMotor.run_for_degrees(360, 50)
        })

    </script>
</html>
```

## MotorPairs
You can also use MotorPairs to control motors simultaneously, though they can get complicated if trying to move for specified distances/degrees of rotation. The following code runs two motors, plugged into ports "A" and "B", for three seconds. Note the use of the JavaScript "setTimeout" function, which can be used to delay the running of a function for a specified number of miliseconds.

```HTML
<html>
    <head>
        <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface@0.1.1/cdn/ServiceDock.min.js"></script>
    </head>
    <body>
        <div id="servicedock" style="float:left;">
            <service-spike id="service_spike"></service-spike>
        </div>
    </body>
    <script>
        var mySPIKE = document.getElementById("service_spike").getService()

        mySPIKE.executeAfterInit(function () {

            var pair = new mySPIKE.MotorPair("A", "B")

            pair.start(50, 50)

            setTimeout(function(){ pair.stop() }, 3000)
        })

    </script>
</html>
```
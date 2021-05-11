## Moving Multiple Motors
Unlike in the Python library, the JavaScript functions for running motors for specific distances or times are **non-blocking**. This is helpful if you want to, say, make two different motors go specified distances at the same time, without having to worry about directly checking sensors. The following example code makes two motors, plugged into ports 'A' and 'B,' start at the same time and each move one full rotation at differing speeds.

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

            var fastMotor = new mySPIKE.Motor("A")
            var slowMotor = new mySPIKE.Motor("B")

            fastMotor.run_for_degrees(360, 100)
            slowMotor.run_for_degrees(360, 50)
        })

    </script>
</html>
```

<iframe id="example-result" width="100%" height="800" frameborder="0" src="servicedock_twoMotors.html"></iframe>

## MotorPairs

## Timeouts
Another helpful tool for timing events in JavaScript programs is `setTimeout(function, milliseconds)`. This is a built-in JavaScript function that sets up `function` to run after `milliseconds` milliseconds have elapsed. Notably, `setTimeout` is also non-blocking; the program
```javascript
setTimeout(function() { console.log("hello") }, 1000)
console.log("world")
```
would print "world" first, followed by "hello" a second later. Still, it can be a useful tool for, say, showing a message on the screen for a certain amount of time, adding delays between various phases of a program. Our use of `setTimeout` in this particular program won't get any more complicated than that, but a more in-depth tutorial on JavaScript timing events can be found [here](https://www.w3schools.com/js/js_timing.asp).

## MotorPairs Final Code
You can also use MotorPairs to control motors simultaneously, though they can get complicated if trying to move for specified distances/degrees of rotation. The following code runs two motors, plugged into ports "A" and "B", for three seconds. Note the use of the JavaScript `setTimeout` function, which can be used to delay the running of a function for a specified number of miliseconds.

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
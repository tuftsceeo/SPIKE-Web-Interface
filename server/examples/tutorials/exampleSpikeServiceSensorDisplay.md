## Sensor Interaction
One of the main advantages of using the ServiceDock SPIKE to control the robot directly instead of uploading python is the ability to receive and process information from your robot on the webpage. The following code receives data every two seconds from a distance sensor plugged into port "A", and displays that data on the webpage.

```HTML
<html>
    <head>
        <script type="text/javascript" src="./modules/ServiceDock_SPIKE.js"></script>
    </head>
    <body>
        <div id="servicedock" style="float:left;">
            <service-spike id="service_spike"></service-spike>
        </div>
        <div id="text-box">Distance: unknown</div>
    </body>
    <script>
        var mySPIKE = document.getElementById("service_spike").getService()
        var textBox = document.getElementById("text-box")

        mySPIKE.executeAfterInit(updateDist)

        function updateDist() {
            var sensor = mySPIKE.DistanceSensor("A")

            //updating onscreen text with current distance
            textBox.innerText = "Distance: " + sensor.get_distance_cm()

            //setting up for next update if SPIKE is still connected
            if(mySpike.isActive())
                setTimeout(updateDist, 2000)
        }
    </script>
</html>
```

<iframe id="example-result" width="100%" height="800" frameborder="0" src="servicedock_sensorDisplay.html"></iframe>
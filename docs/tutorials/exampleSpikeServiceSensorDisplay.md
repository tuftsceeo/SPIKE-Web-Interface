## Sensor Interaction
One of the main advantages of using the Spike Service SMTH to control the robot directly instead of uploading python is the ability to receive and process information from your robot on the webpage. The following code receives data every two seconds from a distance sensor plugged into port "A", and displays that data on the webpage.

```HTML
<html>
    <head>
        <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface@0.1.1/cdn/ServiceDock.min.js"></script>
    </head>
    <body>
        <div id="servicedock" style="float:left;">
            <service-spike id="service_spike"></service-spike>
        </div>
        <div id="text-box">Distance: undefined</div>
    </body>
    <script>
        var mySPIKE = document.getElementById("service_spike").getService()
        var textBox = document.getElementById("text-box")

        mySPIKE.executeAfterInit(updateDist)

        function updateDist() {
            var sensor = mySPIKE.DistanceSensor("A")

            //updating onscreen text with current distance
            textBox.innerText = "Distance: " + sensor.get_distance_cm()

            //setting up for next update
            if(mySpike.isActive())
                setTimeout(updateDist, 2000)
        }
    </script>
</html>
```
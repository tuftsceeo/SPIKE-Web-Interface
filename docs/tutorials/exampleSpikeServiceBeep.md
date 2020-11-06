```html
<html>
    <head>
        <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface/cdn/ServiceDock.js"
            type="text/javascript"></script>
        <script src="./modules/libraries/jquery_351.js" type="text/javascript"></script>
            <style>
            .slidecontainer {
                position: absolute;
                top: 200px;
                width: 400px;
                /* Width of the outside container */
                background-color: #4CE0D2;
                height: 200px;
                border: solid;
                left: 400px;
            }

            /* The slider itself */
            .slider {
                position: relative;
                top: 50px;
                -webkit-appearance: none;
                /* Override default CSS styles */
                appearance: none;
                width: 100%;
                /* Full-width */
                height: 25px;
                /* Specified height */
                background: #d3d3d3;
                /* Grey background */
                outline: none;
                /* Remove outline */
                opacity: 0.7;
                /* Set transparency (for mouse-over effects on hover) */
                transition: opacity .2s;
            }

            /* Mouse-over effects */
            .slider:hover {
                opacity: 5;
                /* Fully shown on mouse-over */
            }
        </style>
    </head>
    <body>
        <!-- ServiceDock -->
        <div id="servicedock" style="float:left;">
            <service-spike id="service_spike"></service-spike>
        </div>
        <!-- from w3schools -->
        <div id="demobox" class="slidecontainer">
            <p>Control beeping Pitch with the slider</p>
            <input type = "button" id = "start" value = "start beeping">
            <input type="button" id ="stop" value="stop beeping">
            <input type="range" min="0" max="200" value="0" class="slider" id="myRange">
        </div>
    </body>
    <script>
        /* SPIKE Service code*/
        var mySPIKE = document.getElementById("service_spike").getService();
        var hub = mySPIKE.PrimeHub();
        var pitch; // pitch at which the hub beeps
        var beepingInterval; // interval at which hub is beeping
        mySPIKE.executeAfterInit(SPIKE_main);

        async function SPIKE_main() {

            $("#start").on("click", function() {
                beepingInterval = setInterval(startBeeping, 500);
            })

            $("#stop").on("click", function () {
                clearInterval(beepingInterval);
                hub.speaker.stop();
            })
        }

        function startBeeping() {
            hub.speaker.start_beep(pitch);
        }


        /* Slider Code*/

        var slider = document.getElementById("myRange");
        pitch = slider.value; // Display the default slider value

        // Update the current slider value (each time you drag the slider handle)
        slider.oninput = function () {
            pitch = this.value;
        }
    </script>
</html>
```
<!-- Taken from documentation folder, which got the files from examples --->
<iframe id="example-result" width="100%" height="800" frameborder="0" src="servicedock_beepSlider.html"></iframe>
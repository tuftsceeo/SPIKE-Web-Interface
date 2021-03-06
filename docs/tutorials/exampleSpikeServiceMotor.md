```html
<html>
    <head>
        <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface/cdn/ServiceDock.js"
            type="text/javascript"></script>
        <script src="./modules/libraries/jquery_351.js" type="text/javascript"></script>
        <!--Service Dock-->
        <div id="servicedock" style="float:left;">
            <service-spike id="service_spike"></service-spike>
        </div>
    </head>

    <body>
        <div id = "demobox" class="slidecontainer">
            <p>Control a motor with the slider</p>
            <select id="portSelect" class="select_components target_ignore">
            </select>
            <input id="selectport" type="button" value="select">
            <input type="range" min="-100" max="100" value="0" class="slider" id="myRange">
        </div>
    </body>
    <script>
        /* SPIKE Service code*/
        var mySPIKE = document.getElementById("service_spike").getService();
        var motor;
        var port; // port to which motor is connected
        var power; // power to run motor with
        mySPIKE.executeAfterInit(SPIKE_main);

        /* append the motor ports to select HTML element */
        async function initPortSelect(motorPorts) {
            for (var port in motorPorts) {
                $("#portSelect").append("<option id = " + motorPorts[port] + ">" + motorPorts[port] + "</option>");
            }
        }

        async function SPIKE_main() {
            var motorPorts = await mySPIKE.getMotorPorts(); // get ports connected to motors

            initPortSelect(motorPorts); // append ports to <select>
            
            $("#selectport").on("click", async function (){
                // get the selected port
                port = await $("#portSelect option:selected").val();
                motor = new mySPIKE.Motor(port);
                
                var motorPowerInterval = setInterval(changeMotorPower, 500);
                // control motor's power
                
                motor.start_at_power(power)

            })
        }

        function changeMotorPower() {
            motor.start_at_power(power)
        }


        /* Slider Code*/
        var slider = document.getElementById("myRange");
        power = slider.value; // Display the default slider value

        // Update the current slider value (each time you drag the slider handle)
        slider.oninput = function () {
            power = this.value;

        }
    </script>
    <style>
        .slidecontainer {
            position: absolute;
            top: 200px;
            width: 400px; /* Width of the outside container */
            background-color: #4CE0D2;
            height: 200px;
            border: solid;
            left: 400px;
        }

        /* The slider itself */
        .slider {
            position: relative;
            top: 50px;
            -webkit-appearance: none;  /* Override default CSS styles */
            appearance: none;
            width: 100%; /* Full-width */
            height: 25px; /* Specified height */
            background: #d3d3d3; /* Grey background */
            outline: none; /* Remove outline */
            opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
            transition: opacity .2s;
        }

        /* Mouse-over effects */
        .slider:hover {
            opacity: 5; /* Fully shown on mouse-over */
        }
    </style>
</html>
```
<!-- Taken from documentation folder, which got the files from examples --->
<iframe id="example-result" width="100%" height="800" frameborder="0" src="servicedock_motorSlider.html"></iframe>
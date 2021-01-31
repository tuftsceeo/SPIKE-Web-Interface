## Keeping Track of Multiple Values
Description coming soon

# Remote
```html
<html>
    <head>
        <script type="text/javascript" src="./modules/ServiceDock_Airtable.js"></script>
        <style>
            #controls {
                text-align: center;
                font-size: 30px;
                padding: 100px;
            }
        </style>
    </head>
    <body style="background-image: url('./modules/views/CEEOInnovationsbackground.png');">
         <div id = "servicedock" style = "float:right;">
            <service-airtable id = "service_airtable"></service-airtable>
        </div>
        <div id = "controls">
            <label for="left_speed_slider">Left Speed (0 to 100): </label>
            <input type="range" id="left_speed_slider" onchange="sendSliderVal('left_speed', this.value)" min="0" max="100">
            <br>
            <label for="right_speed_slider">Right Speed (0 to 100): </label>
            <input type="range" id="right_speed_slider" onchange="sendSliderVal('right_speed', this.value)" min="0" max="100">
            <br>
            <label for="right_speed_slider">Angle (-90 to 90): </label>
            <input type="range" id="right_speed_slider" onchange="sendSliderVal('shooter_angle', this.value)" min="-90" max="90">
            <br><br>
            <button onclick="shoot()">Fire!</button>
        </div>
    </body>
    <script>
        var airtableElement = document.getElementById("service_airtable")
        var myTable = airtableElement.getService()

        myTable.executeAfterInit(function() { 
            // set up table with default values
            sendSliderVal("left_speed", 0)
            sendSliderVal("right_speed", 0)
            sendSliderVal("shooter_angle", 0)
            sendSliderVal("shoot_mode", "wait")
        })

        function shoot() {
            myTable.setEntryValueStrict("shoot_mode", "shoot")
        }

        function sendSliderVal(entryName, val) {
            myTable.setEntryValueStrict(entryName, parseInt(val))
        }
    </script>
</html>
```

# Local
```html
<html>
    <head>
        <script type="text/javascript" src="./modules/ServiceDock_Airtable.js"></script>
        <script type="text/javascript" src="./modules/ServiceDock_SPIKE.js"></script>
        <style>
            #displays {
                text-align: center;
                font-size: 30px;
                padding: 100px;
                background-color:rgb(0,255,133)
            }
        </style>
    </head>
    <body style="background-image: url('./modules/views/CEEOInnovationsbackground.png');">
         <div id = "servicedock" style = "float:right;">
            <service-airtable id = "service_airtable"></service-airtable>
            <service-spike id="service_spike"></service-spike>
        </div>
        <div id = "displays">
            <div id = "angle_display">angle: unknown</div>
            <div id = "left_speed_display">left speed: unknown</div>
            <div id = "right_speed_display">right speed: unknown</div>
        </div>
    </body>
    <script>
        var airtableElement = document.getElementById("service_airtable")
        var myTable = airtableElement.getService()

        var mySPIKE = document.getElementById("service_spike").getService()

        var motorSpeeds = {
            left: null,
            right: null,
        }

        myTable.executeAfterInit(function() {
            // start the periodic checks and updates
           checkTable({})
        })


        // checks current table values against those of last check and controls motors and page displays accordingly
        function checkTable(pastTable) {
            var  currentTable = myTable.getEntriesInfo()

            checkEntry("shooter_angle", currentTable, pastTable, updateAngle)
            checkEntry("left_speed", currentTable, pastTable, function(newSpeed) { updateSpeed("left", newSpeed) } )
            checkEntry("right_speed", currentTable, pastTable, function(newSpeed) { updateSpeed("right", newSpeed) })

            if(currentTable["shoot_mode"] != undefined && currentTable["shoot_mode"].value == "shoot")
                shoot()

            // check again in one second
            setTimeout(function() { checkTable(currentTable) }, 1000)
        }

        // runs action if value of entry called name is different in pastTable than currentTable
        function checkEntry(name, currentTable, pastTable, action) {
            if(currentTable[name] != undefined && (pastTable[name] == undefined || currentTable[name].value != pastTable[name].value)) {
                action(currentTable[name].value)
                console.log("running action for " + name)
            }
        }

        // runs shooting motors at specified speeds
        function shoot() {
            // change display div color to indicate shooting mode
            document.getElementById("displays").style.backgroundColor = "rgb(163,255,143)"

            // if spike is connected, run shooter motors w/ specified speeds
            if(mySPIKE.isActive()) {
                mySPIKE.Motor("A").run_for_seconds(2, motorSpeeds.left)
                mySPIKE.Motor("B").run_for_seconds(2, -motorSpeeds.right)
            }

            // revert div color back once shooting is done
            setTimeout(function() { document.getElementById("displays").style.backgroundColor = "rgb(0,255,133)" }, 2000)

            myTable.setEntryValueStrict("shoot_mode", "wait")
        }

        /* updates stored speed value and screen display for specified side (a)
         * NOTE: assumes side is "left" or "right"
         */
        function updateSpeed(side, newSpeed) {
            if(side == "left")
                motorSpeeds.left = newSpeed
            else if(side == "right")
                motorSpeeds.right = newSpeed

            document.getElementById(side + "_speed_display").innerText = side + " speed: " + newSpeed
        }

        // changes angle displayed on page and repositions angle motor to given newAngle
        function updateAngle(newAngle) {
            document.getElementById("angle_display").innerText = "angle: " + newAngle
            
            // run motor to new position if SPIKE is connected
            if(mySPIKE.isActive())
                mySPIKE.Motor("C").run_to_degrees_counted(newAngle)
        }
    </script>
</html>
```

<iframe id="remote-example-result" width="100%" height="450" frameborder="0" src="servicedock_airtableShooterRemote.html"></iframe>

<iframe id="local-example-result" width="100%" height="450" frameborder="0" src="servicedock_airtableShooterLocal.html"></iframe>
## Keeping Track of Multiple Values
The previous example used only one Airtable entry (motor speed). Here, we're going to get a little more complicated with a program that keeps multiple entries at once.

## Robot Specs
We're going to write code for a robot that shoots projectiles at a remotely controlled speed and angle. Personally, I'm imagining a contraption with wheels on either side of the projectile that spin in opposite directions to launch said projectile into the air. However, it could also work with various configurations of arms, or any number of other designs (such is the fun of SPIKE Prime). The important part for our purposes is that two separate motors control the left and right side of the shooter, such that the user can run one faster than the other if they want the ball to veer off at an angle. 

There's also a third motor determining the angle at which the shooter points, which is also user-controlled, this time by picking a desired angle for the motor to sit at. Then, once the user has their desired speeds and angle set, all they need is a way to tell the robot to launch its projectile, which we're going to do with a shoot button. This makes four Airtable entries to keep track of in total: left speed, right speed, angle, and shooter mode.

## The Remote Page
For the first three values, we're doing pretty much the same thing as in the last example: sending values in from sliders. The code will therefore look pretty much the same, though it's a good idea to generalize the value-sending function a little (called whenever a slider is changed) so you can use the same one for all three and avoid redundant code. That would look something like this:

```javascript
function sendSliderVal(entryName, val) {
    myTable.setEntryValueStrict(entryName, parseInt(val))
}
```

Then, there's the shoot button. For this, we're going to essentially have the Airtable keep track of what "mode" the shooter is currently in; when the user clicks the shoot button, it will be put in shoot mode, and will stay there until the launch is complete, at which point the remote page will set it back to "wait" mode. All we need from the remote side, then, is to set the value of "shoot_mode" entry to "shoot"- we'll handle the rest on the local page.

## The Local Page
This is where the majority of the differences from the single-entry example will come in. Technically, we could do the exact same thing as that one, making the periodic checking function into one big long chain of if statements like this:

```javascript
function checkAndUpdate(pastLeftSpeed, pastRightSpeed, pastAngle) {
    var currentLeftSpeed, currentRightSpeed, currentAngle;

    if(myTable.getEntriesInfo()["left_speed"] != undefined)
        currentLeftSpeed = myTable.getEntryValue("left_speed")

    if(myTable.getEntriesInfo()["right_speed"] != undefined)
        currentRightSpeed = myTable.getEntryValue("right_speed")
    
    if(myTable.getEntriesInfo()["shooter_angle"] != undefined)
        currentAngle = myTable.getEntryValue("shooter_angle")

    if(currentLeftSpeed != undefined && currentLeftSpeed != pastLeftSpeed)
        // update page/control robot accordingly

    if(currentRightSpeed != undefined && currentRightSpeed != pastRightSpeed)
        // update page/control robot accordingly

    if(currentAngle != undefined && currentAngle != pastAngle)
        // update page/control robot accordingly

    if(currentMode == "shoot")
        // update page/control robot accordingly

    // check again in one second
    setTimeout(function() { checkAndUpdate(currentLeftSpeed, currentRightSpeed, currentAngle) }, 1000)
}
```

Small thing you may have noticed: in this case, I decided to do away with the separate `startChecking()` function from the single-entry example, and instead moved all the checks for whether or not an entry exists in the table into the main checking function. This is because I want updates to happen even when the user hasn't changed every cloud value yet. For example, if the user started with an empty table and then moved the angle slider, we'd want the local page to receive and drive the corresponding motor to that angle, despite left_speed, right_speed, and shooter_mode not existing in the table yet.

This function would work. But, as you can probably tell, the code is far from ideal. There's a lot of parameters floating around (just imagine how ugly it would get for a program with even *more* cloud values), and the body includes a lot of repeated code.

## Using the Entire Table
The first possible change that jumps out to me is cleaning up all those variables. Right now, we're passing each value in individually, which is already getting a little messy, and would only get more so if we decided to add more cloud variables later on. We're already using the object returned by the `getEntriesInfo` function to make sure entries exist in the table before we get their values, but, as it turns out, we can also use it to get the values of said entries once know they exist, eg `myTable.getEntriesInfo()["left_speed"].value`. 

If we get our values this way, we no longer have to worry about passing each one in separately as a parameter for the next check- we can just pass in the entire table, and check values from the current and past tables against each other. With that change, our checking function would look something like this:

```javascript
function checkAndUpdate(pastTable) {
    var currentTable = myTable.getEntriesInfo()

    if(currentTable["left_speed"] != undefined && pastTable["left_speed"].value != undefined 
        && currentTable["left_speed"].value != pastTable["left_speed"].value)
        // update page/control robot accordingly

    if(currentTable["right_speed"] != undefined && pastTable["right_speed"].value != undefined 
        && currentTable["right_speed"].value != pastTable["right_speed"].value)
        // update page/control robot accordingly

    if(currentTable["shooter_angle"] != undefined && pastTable["shooter_angle"].value != undefined 
        && currentTable["shooter_angle"].value != pastTable["shooter_angle"].value)
        // update page/control robot accordingly

    if(currentTable["shooter_mode"]!= undefined && currentTable["shooter_mode"].value == "shoot")
        // update page/control robot accordingly

    // check again in one second
    setTimeout(function() { checkAndUpdate(currentTable) }, 1000)
}
```
Better, but still redundant-looking. Let's see if we can consolidate those if statements.

## Generalizing Entry Checks

Essentially, for both the speeds and angle, all we're doing is checking the current value of an entry in Airtable against the locally stored one from the previous check, and, if the two are not equal, running some update function. Since JavaScript has very easy-to-use functionality for sending functions in as parameters to other functions, this sequence could easily be turned into a function! Making that change would give us something like this:

```javascript
function checkAndUpdate(pastTable) {
    var currentTable = myTable.getEntriesInfo()

    checkEntry("left_speed", currentTable, pastTable, /* desired update function */)
    checkEntry("right_speed", currentTable, pastTable, /* desired update function */)
    checkEntry("shooter_angle", currentTable, pastTable, /* desired update function */)

    if(currentTable["shooter_mode"]!= undefined && currentTable["shooter_mode"].value == "shoot")
        // update page/control robot accordingly

    // check again in one second
    setTimeout(function() { checkAndUpdate(currentTable) }, 1000)
}

// runs action if value of entry called name is different in pastTable than currentTable
function checkEntry(name, currentTable, pastTable, action) {
    if(currentTable[name] != undefined && (pastTable[name] == undefined || currentTable[name].value != pastTable[name].value)) {
        action(currentTable[name].value)
        console.log("running action for " + name)
    }
}
```

That looks a lot better! You might notice we didn't use `checkEntry` on shooter_mode- in that case, we are waiting for a specific value rather than simply listening for any change, so we'd need a different function. If we had multiple instances of that functionality (if we added a stop button, perhaps? Or a reset one?), we might make some sort of `checkEntryForValue` function to consolidate all of those, but as it stands we can just leave shooter_mode's if statement `checkAndUpdate`.

## Controlling the Robot and Page

So now, we've got our value checking. All that's left to do is control the robot and webpage! Since this is a Service_Airtable tutorial rather than a Service_SPIKE one, we're not going to go too in-depth on that here, but here are my functions for updating the speed and angle displays on the page (the latter part is unnecessary, but I personally find it helpful to be able to see the user input on the local page to make sure everything is working).

```javascript
// object for storing most recent motor speeds (for use in shooting)
var motorSpeeds = {
    left: null,
    right: null,
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
```

And the shoot function:

```javascript
// runs shooting motors at specified speeds
function shoot() {
    // if spike is connected, run shooter motors w/ specified speeds
    if(mySPIKE.isActive()) {
        mySPIKE.Motor("A").run_for_seconds(2, motorSpeeds.left)
        mySPIKE.Motor("B").run_for_seconds(2, -motorSpeeds.right)
    }

    myTable.setEntryValueStrict("shoot_mode", "wait")
}
```

And that's all the functions we need! You can see them all put together, as well as try it for yourself with your own shooter (or just three motors plugged into a hub) below.

## Remote
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
    <body>
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
            <label for="right_speed_slider">Angle (-45 to 45): </label>
            <input type="range" id="right_speed_slider" onchange="sendSliderVal('shooter_angle', this.value)" min="-45" max=45">
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

## Local
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
    <body>
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

        // object for storing most recent motor speeds (for use in shooting)
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
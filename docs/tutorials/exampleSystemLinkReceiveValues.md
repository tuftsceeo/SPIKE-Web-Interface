## The Local Page

Continuing with the slider-controlled motor example, we now have the remote page down. But what about the local one? The two main steps we need to accomplish here are 1) getting the speed out of SystemLink, and 2) sending that speed to the SPIKE Prime. Let's start with step 1.

## Listening for Change
Assuming we have everything set up correctly, with creation and initialization of a Service_SystemLink object identical to that of the remote page, getting a value out of SystemLink is fairly trivial; all we have to do is call `getTagValue(name)` on the Service_SystemLink object and use the value returned however we please. But how do we know when to check?

As developers, *we* know that the speed in the cloud is updated whenever the slider on the remote page is moved. But how does the local page know that? And even if it did, how would it be at all aware of when some user halfway across the world happened to click that slider? On the local end, we *don't* know when a change will occur, so we have to write a function to regularly check for one.

A common first instinct for this problem, especially for someone accustomed to writing MicroPython SPIKE Prime programs, might be to just put the `getTagValue` call in a while loop and call it a day. Unfortunately, this is likely to run *too* often and cause the webpage to crash with the overload of commands. Instead, we want to set up our checks to happen at regular intervals, which can be accomplished with JavaScript timing functions.

In this tutorial, we're going to use `setTimeout(function, milliseconds)`, which schedules a given function to run a given number of milliseconds after the setTimeout line runs. We could also just as easily use `setInterval(function, milliseconds)`, which schedules periodic calls of a given function, as explained [here](https://www.w3schools.com/js/js_timing.asp); my use of `getTimeout` instead is mostly an aesthetic choice. 

Knowing that, the code becomes fairly simple; we get the current speed from SystemLink, and, if it is different than the speed from the last check, update our speed display on the page (and/or the speed of a connected SPIKE motor, but we aren't tackling that part yet). Then, at the end of that checking function, we schedule the next check for one second later, and so on into infinity (or until we close the page).

In code, that process would look something like this:

```javascript
serviceSystemLink.executeAfterInit(function() {
    // start the periodic checks and updates
    checkAndUpdate(0)
})

// checks SystemLink for new motor speed, updates page display accordingly, and sets up next check if program is still active
function checkAndUpdate(pastSpeed) {
    var currentSpeed = serviceSystemLink.getTagValue("motor_speed")
    // if speed has been changed since last check, update page display
    if(currentSpeed != pastSpeed)
    updateSpeed(currentSpeed)

    // check again in one second
    setTimeout(function() { checkAndUpdate(currentSpeed) }, 1000)
}

// changes speed displayed on page to given newSpeed
function updateSpeed(newSpeed) {
    document.getElementById("speed_display").innerText = "Speed: " + newSpeed;
}
```

## An Edge Case
Suppose a user connects a local page to System Link before a remote page is ever connected. Since a value for motor_speed has never been set, the `getTagValue` will throw an error, which will halt our regular cloud checks such that even if a remote page is later connected, the local page will not receive any values. Before starting those periodic checks, we therefore have to make sure the motor_speed entry exists in order to prevent the page from trying to get a nonexistent value.

The Service_SystemLink function `getTagsInfo()` returns an object with a field representing each System Link tag. You can access one such tag by putting its name in brackets, such that, if motor-speed exists in System Link, the line `myTable.getTagsInfo()["motor-speed"]` will return an object containing the name "motor-speed" and its current value. If the motor-speed entry is not in the cloud, it will return `undefined`.

Knowing that, we can write a function very similar to `checkAndUpdate` that checks if motor-speed exists and, if so, starts the periodic calls of `checkAndUpdate`. If not, it can schedule itself to check again in one second, and continue doing so until a motor-speed entry is found. In code, that would look like this:

```javascript
function startChecking() {
    if(serviceSystemLink.getTagsInfo()["motor_speed"] != undefined)
        checkAndUpdate(null)
    else
        setTimeout(startChecking, 1000)
}
```

## Adding In the SPIKE
Now that we have the speed, all we have to do is send it to a motor! Assuming some familiarity with JavaScript-based SPIKE Prime control, adding this in should be fairly trivial (if not, feel free to check out [this tutorial](https://tuftsceeo.github.io/SPIKE-Web-Interface/tutorial-exampleSpikeServiceBasicMotor.html), where we connect to and start a SPIKE motor). After adding in and initialize a Service_SPIKE, we just have to add a few lines to `updateSpeed` to send the new speed to the attached SPIKE motor. The final code will look something like this:

```HTML
<html>
    <head>
        <script type="text/javascript" src="./modules/ServiceDock_SystemLink.js"></script>
        <script type="text/javascript" src="./modules/ServiceDock_SPIKE.js"></script>
        <style>
            #speed_display {
                text-align: center;
                font-size: 30px;
                padding: 100px;
            }
        </style>
    </head>
    <body>
         <div id = "servicedock" style = "float:right;">
            <service-systemlink id = "service_SystemLink"></service-systemlink>
            <service-spike id="service_spike"></service-spike>
        </div>
        <div id = "speed_display">Speed: unknown</div>
    </body>
    <script>
        var systemLinkElement = document.getElementById("service_SystemLink")
        systemLinkElement.setAttribute("apikey", "your_API_key")
        systemLinkElement.init()

        var serviceSystemLink = systemLinkElement.getService()
        var serviceSPIKE = document.getElementById("service_spike").getService()


        serviceSystemLink.executeAfterInit(function() {
            // start the periodic checks and updates
            startChecking()
        })

        function startChecking() {
            if(serviceSystemLink.getTagsInfo()["motor_speed"] != undefined)
                checkAndUpdate(null)
            else
                setTimeout(startChecking, 1000)
        }

        // checks SystemLink for new motor speed, updates page display and SPIKE motor accordingly, and sets up next check if program is still active
        function checkAndUpdate(pastSpeed) {
            var currentSpeed = serviceSystemLink.getTagValue("motor_speed")
            // if speed has been changed since last check, update page display
            if(currentSpeed != pastSpeed)
                updateSpeed(currentSpeed)

            // check again in one second
            setTimeout(function() { checkAndUpdate(currentSpeed) }, 1000)
        }

        // changes speed displayed on page and speed of SPIKE motor to given newSpeed
        function updateSpeed(newSpeed) {
            document.getElementById("speed_display").innerText = "Speed: " + newSpeed

            // run motor if SPIKE is connected
            if(serviceSPIKE.isActive())
                serviceSPIKE.Motor("A").start(newSpeed)
        }
    </script>
</html>
```
And we're done! Both the remote and local page are on display below; feel free to plug in a SPIKE and test them out (note that the SystemLink service is uninitialized in these displays, so you're going to have to click the SystemLink icon and input your own API Key each page for it to work).

**Remote:**
<iframe id="remote-example-result" width="100%" height="450" frameborder="0" src="servicedock_systemLinkSimpleRemote.html"></iframe>

**Local:**
<iframe id="local-example-result" width="100%" height="450" frameborder="0" src="servicedock_systemLinkSimpleLocal.html"></iframe>
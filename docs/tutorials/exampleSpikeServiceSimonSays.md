## Simon Says
In this tutorial, we're going to use the SPIKE Prime hub to play a simple game of Simon Says, where we give commands on a webpage that the user then has an ever-decreasing amount of time to follow. In doing so, we can get a feel for the general structure of sensor reading, especially as it relates to timing and how we can make functions run as synchronously as they would in MicroPython.

## Callback Functions
In the JavaScript SPIKE library, functions involving waiting for a certain event to happen often take a "callback" function, which runs once that condition is reached. This is essentially a workaround for the fact that, unlike in MicroPython, most of the functions we use here are non-blocking. Fore example, if we wanted to print the message "done!" to the console after spinning a motor 360 degrees at half speed, the following code
```javascript
mySPIKE.Motor('A').run_for_degrees(360, 50)
console.log("done!")
```
wouldn't actually work as intended; since `run_for_degrees` is non-blocking, "done!" would print right after the motor started running, instead of waiting until 360 degrees was reached. Luckily, if we look at the definition of `run_for_degrees` in the `Service_SPIKE.Motor` documentation, we see that it can actually take a callback function as an optional third parameter. Therefore, we can amend our code to
```javascript
mySPIKE.Motor('A').run_for_degrees(360, 50, function() { console.log("done!") })
```
Another thing to note, for those unfamiliar: you might notice how, even though all the callback function does is call another function (`console.log`), I still had to wrap it in an inline function instead using console.log as the callback directly (ie `run_for_degrees(360, 50, console.log("done!"))`. This is a quirk of the language- if passing in a function as a parameter of another function, you have to use its name without parentheses, or else it will be called at the same time as the function taking the parameter. For example, if we had a function `foo(callback)` and wanted to pass in the function `bar()` as callback, we would say `foo(bar)` rather than `foo(bar())`. A consequence of this is that we couldn't use `bar` directly if it needed any parameters, and would instead have to say `foo(function() { bar(parameter) })`.

## Timeouts
Another helpful tool for timing events in JavaScript programs is `setTimeout(function, milliseconds)`. This is a built-in JavaScript function that sets up `function` to run after `milliseconds` milliseconds have elapsed. Notably, `setTimeout` is also non-blocking; the program
```javascript
setTimeout(function() { console.log("hello") }, 1000)
console.log("world")
```
would print "world" first, followed by "hello" a second later. Still, it can be a useful tool for, say, showing a message on the screen for a certain amount of time, adding delays between various phases of a program. Our use of `setTimeout` in this particular program won't get any more complicated than that, but a more in-depth tutorial on JavaScript timing events can be found [here](https://www.w3schools.com/js/js_timing.asp).

## The Game
In any round of this game, the three major steps are: 1. choose and display a desired move, as well as a time that move must be completed in, 2. read in the move made by the user and how long that move took, and 3. check that move/time combination against the desired move/time, and either end the game or begin another round. 

Step 1 could be done in many ways, and is fairly independent of the SPIKE Prime. In this example, we're going to hold the four possible commands in an array, and then use the command stored at a random index of that array for each round. For time, we're going to start at 5000 miliseconds, and subtract 100 ms for each successful round played until we reach a minimum time of 1000 ms. Those two functions would look like this:

```javascript
function calculateRoundTime(roundNum) {
    return Math.max(5000 - roundNum * 100, 1000);
}

function getNewCommand() {
    var commands = ["Tap!", "Shake!", "Flip Left!", "Flip Right!"]
    return commands[Math.floor(Math.random() * 4)]
}
```

Steps 2 and 3 are where it gets more interesting. For step 2, we're going to use the hub's built in motion sensor, accessed with `mySPIKE.PrimeHub().motion_sensor`, which tracks both its orientation in space and various "gestures" such as being tapped or shaken. The motion sensor has a `wait_for_new_gesture(callback)` function, which waits for a new gesture to occur and then runs a callback function with the name of the gesture ("tapped", "doubletapped", "shaken", or "freefall") as a parameter. If we use this function as our step 2, we can have our step 3 be the callback function, ensuring that it will run only after a move is made. There is also an analogous function for orientations (with each orientation correspinding to which side of the spike is facing up) called `wait_for_new_orientation(callback)`

In code, that would look like this:

```javascript
function checkGesture(targetGesture, roundTime){
    var startTime = Date.now(); // storing the time right before the hub starts waiting for a gesture, to be compared to the time after gesture is completed
    mySPIKE.PrimeHub().motion_sensor.wait_for_new_gesture(function(newGesture) { 
        processMove(newGesture, targetGesture, Date.now() - startTime, roundTime) 
    })
}

function checkOrientation(targetOrientation, roundTime) {
    var startTime = Date.now();
    mySPIKE.PrimeHub().motion_sensor.wait_for_new_orientation(function(newOrientation) { 
        processMove(newOrientation, targetOrientation, Date.now() - startTime, roundTime) 
    })
}

function processMove(newVal, targetVal, timeSpent, roundTime) {
    if(newVal == targetVal) {
        if(timeSpent <= roundTime) {
            // update score and move on to next round
        } else {
            // move was too slow! end game
        }
    } else {
        // move was incorrect! end game
    }
}
```
Now all we need to do is link step 1 to steps 2 and 3, which is mostly a matter of linking commands to gesture names and writing a function that plays one round by calling `checkGesture` using the generated target gesture and time. We also need to add some HTML interaction functions for displaying commands and game over messages on the webpage. These functions are all pretty short, and will be on display in...

## The Final Product
```HTML
<html>
    <head>
        <script type="text/javascript" src="./modules/ServiceDock_SPIKE.js"></script>
        <style>
            #controls {
                text-align: center;
                font-size: 30px;
                padding: 100px;
            }
            #message {
                font-size: 50px;
            }
        </style>
    </head>

    <body>
        <div id="servicedock" style="float:left;">
            <service-spike id="service_spike"></service-spike>
        </div>
        <div id="controls">
            <button onclick = startGame()>Start</button>
            <div id="message"><br></div>
            <div id="score">Score: 0</div>
        </div>
    </body>
    <script>
        var mySPIKE = document.getElementById("service_spike").getService()
        var messageDisplay = document.getElementById("message");
        var score = 0;

        // workaround for wait_for_new_orientation giving starting orientation of hub the first time it is called
        mySPIKE.executeAfterInit(function() {
            mySPIKE.PrimeHub().motion_sensor.wait_for_new_orientation( function() { console.log("Ready to go!")})
        })

        // resets score to zero and begins a new game
        function startGame() {
            updateScore(0)
            messageDisplay.innerHTML = "Simon Says..."

            // waiting a second before starting round so user can read "Simon Says" message
            setTimeout(function() { startNewRound(0) }, 1000);
        }

        // picks a command and time for new round, shows command to user, and gives them roundTime amount of milliseconds to follow given command
        function startNewRound(roundNum) {
            var command = getNewCommand()
            var roundTime = calculateRoundTime(roundNum)

            document.getElementById("message").innerText = command
            switch(command) {
                case "Tap!":
                    checkGesture("tapped", roundTime)
                    break
                case "Shake!":
                    checkGesture("shaken", roundTime)
                    break
                case "Flip Left!":
                    checkOrientation("leftside", roundTime)
                    break
                case "Flip Right!":
                    checkOrientation("rightside", roundTime)
                    break
            }
        }

        // waits for player to tap or shake hub, records move made and time taken for further processing
        function checkGesture(targetGesture, roundTime){
            var startTime = Date.now();
            mySPIKE.PrimeHub().motion_sensor.wait_for_new_gesture(function(newGesture) { 
                processMove(newGesture, targetGesture, Date.now() - startTime, roundTime) 
            })
        }

        // waits for player to turn hub (for flip commands), records move made and time taken for further processing
        function checkOrientation(targetOrientation, roundTime) {
            var startTime = Date.now();
            mySPIKE.PrimeHub().motion_sensor.wait_for_new_orientation(function(newOrientation) { 
                processMove(newOrientation, targetOrientation, Date.now() - startTime, roundTime) 
            })
        }

        // uses move made, target move, time spent making the move, and maximum round time to discern whether user has won or lost round, and either continues or ends game accordingly
        function processMove(newVal, targetVal, timeSpent, roundTime) {
            // checking if correct move was made
            if(newVal == targetVal) {
                // checking if move was made in appropriate time
                if(timeSpent <= roundTime) {
                    updateScore(score + 1)
                    messageDisplay.innerText = "Simon Says..."
                    setTimeout(function() { startNewRound(score) }, 1000)
                } else {
                    messageDisplay.innerText = "Too Slow!"
                    setTimeout(gameOver, 2000);
                }
            } else {
                messageDisplay.innerText = "Wrong Move!"
                setTimeout(gameOver, 2000);
            }
        }

        // notifies user of game ending
        function gameOver() {
            messageDisplay.innerText = "Game Over!"
        }
    
        // calculates time for next round based om how many rounds have already occured (such that difficulty decreases as the game goes on)
        function calculateRoundTime(roundNum) {
            return Math.max(5000 - roundNum * 100, 1000);
        }

        // randomly chooses and returns a new command
        function getNewCommand() {
            var commands = ["Tap!", "Shake!", "Flip Left!", "Flip Right!"]
            return commands[Math.floor(Math.random() * 4)]
        }

        // sets score to given newScore and updates onscreen display to match
        function updateScore(newScore) {
            score = newScore
            document.getElementById("score").innerText = "Score: " + score
        }
    </script>
</html>
```

Feel free to plug in a hub and play a few rounds below, or copy-and-paste the game into your own code and see what new commands, cool graphics, or more sophisticated time/command-choosing algorithms you can add.

<iframe id="example-result" width="100%" height="800" frameborder="0" src="servicedock_simonSays.html"></iframe>
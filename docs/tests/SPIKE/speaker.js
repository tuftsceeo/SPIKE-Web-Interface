
//                                      //
//            Speaker Tests             //
//                                      //


var testBeep = document.getElementById("beep");
testBeep.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON Primehub.speaker.beep(100,3) #######")
    console.log("Test: Hub will beep for 3 seconds")
    var hub = mySPIKE.PrimeHub();
    var speaker = hub.speaker;
    console.log("speaker object", speaker);
    speaker.beep(100, 3);
    console.log("###### ENDING UNIT TEST ON Primehub.speaker.beep(100,3)#######")
})

var testStartBeep = document.getElementById("startBeep");
testStartBeep.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON Primehub.speaker.start_beep(100) #######")
    console.log("Test: Hub will beep unless stopped (use speaker.stop())");
    var hub = mySPIKE.PrimeHub();
    var speaker = hub.speaker;
    speaker.start_beep(100);
    console.log("###### ENDING UNIT TEST ON Primehub.speaker.start_beep(100)#######")
})

var testStopBeep = document.getElementById("stopBeep");
testStopBeep.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON Primehub.speaker.stop() #######")
    console.log("hub beeping will stop");
    var hub = mySPIKE.PrimeHub();
    var speaker = hub.speaker;
    speaker.stop();
    console.log("###### ENDING UNIT TEST ON Primehub.speaker.stop() #######")
})
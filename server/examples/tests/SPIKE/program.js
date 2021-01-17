
//                                      //
//            program Tests             //
//                                      //

var testWriteProgram = document.getElementById("writeProgram");
testWriteProgram.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON writeProgram() #######");
    console.log("Test: write hello world progam on slot 1 in python");
    console.log("write your python command for SPIKE on textbox and press write program");

    var writeProgramButton = document.getElementById("writeTheProgram");

    writeProgramButton.addEventListener("click", function () {
        var dataTextBox = document.getElementById("writeProgramData");

        var dataToWrite = dataTextBox.value;

        console.log(dataToWrite);
        /* using writeProgram (old way) */
        var programname = "test program";
        mySPIKE.writeProgram(programname, dataToWrite, 0);

        /* using micropython (new way) */
        // mySPIKE.micropython(0, dataToWrite);
    })
    console.log("###### ENDING UNIT TEST ON writeProgram() #######");
})

var testMicropython = document.getElementById("micropython");
testMicropython.addEventListener("click", function () {

    parseCommand(`
from spike import PrimeHub, LightMatrix, Motor, MotorPair
from spike.control import wait_for_seconds, wait_until, Timer

hub = PrimeHub() 

hub.light_matrix.write(run_for_seconds(2))

run_for_seconds(3)
        `)
})

//parse the cloudTagValue() command inserted at the textbox and execute it
async function parseCommand(rawContent) {

    let index_runForSeconds = await rawContent.indexOf("run_for_seconds(");
    if (index_runForSeconds > -1) {
        //find the index of rawContent at which the runForSeconds function ends
        let index_lastparen = await rawContent.indexOf(")", index_runForSeconds);

        //divide the rawContent into parts before the runForSeconds and after
        let first_rawContent_part = await rawContent.substring(0, index_runForSeconds);
        let second_rawContent_part = await rawContent.substring(index_lastparen + 1, rawContent.length);

        //find the argument of the runForSeconds
        let runForSeconds_string = await rawContent.substring(index_runForSeconds, index_lastparen + 1);
        let index_first_paren = runForSeconds_string.indexOf("(");
        let index_last_paren = runForSeconds_string.indexOf(")");
        let tagName = runForSeconds_string.substring(index_first_paren + 1, index_last_paren);

        // get the tag's value from the cloud
        var yield = "yield(" + tagName + "000)";

        //send the final UJSONRPC script to the hub.
        let final_RPC_command;

        console.log("typeof", typeof yield);

        final_RPC_command = await first_rawContent_part + yield + second_rawContent_part;

        return parseCommand(final_RPC_command);
    }
    else {
        console.log(rawContent);
        return rawContent;
    }
}

var testConcatProgram = document.getElementById("concatenateProgram");
testConcatProgram.addEventListener("click", function () {
    console.log("###### BEGINNING UNIT TEST ON source code for concatenating micropy with template.py #######");
    console.log("Test: write micropy program in the textbox");

    var writeProgramButton = document.getElementById("writeTheProgram");

    writeProgramButton.addEventListener("click", function () {
        var firstPart = "from runtime import VirtualMachine\n\n# Stack for execution:\nasync def stack_1(vm, stack):\n"
        var secondPart = "# Setup for execution:\ndef setup(rpc, system, stop):\n\n # Initialize VM:\n    vm = VirtualMachine(rpc, system, stop, \"Target__1\")\n\n    # Register stack on VM:\n    vm.register_on_start(\"stack_1\", stack_1)\n\n    return vm"

        var dataTextBox = document.getElementById("writeProgramData");

        var dataToWrite = dataTextBox.value;

        var stringifiedData = JSON.stringify(dataToWrite);
        stringifiedData = stringifiedData.substring(1, stringifiedData.length - 1);
        var result = "";

        var splitData = stringifiedData.split(/\\n/);
        console.log(splitData);
        for (var index in splitData) {

            var addedTab = "    " + splitData[index] + "\n";
            console.log(addedTab);
            result = result + addedTab;
        }

        console.log("result before parsed: ")
        console.log("\n" + result);

        console.log("converted data without parse");
        result = firstPart + result + secondPart;
        console.log("converted data: ");
        console.log("\n" + result);


    })
    console.log("###### ENDING UNIT TEST ON source code for concatenating micropy with template.py #######");
})

var testGetProjects = document.getElementById("getProjects");
testGetProjects.addEventListener("click", async function () {
    console.log("###### BEGINNING UNIT TEST ON mySPIKE.getProjects() #######");

    var hubProjects = await mySPIKE.getProjects();
    console.log(hubProjects);
    console.log("Expected result: console log of an object listing all slots in the SPIKE Prime");
    console.log("###### ENDING UNIT TEST ON mySPIKE.getProjects()#######");
})

var testParseUJSON = document.getElementById("parseUJSON");
testParseUJSON.addEventListener("click", async function () {

    var array = ['{ "m": 2, "p": ', '[8.326, 100] }\r', '{ "m": 0, "p": [[48, [0, 0, 109, 0]], [48, [0, 0, -176, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 383]], [61, [1, null, 7, 9, 7]], [62, [10]], [4, -8, 989], [0, 0, 0], [-4, ', '0, 0], "", 0] }\r{ "m": 0, "p": [[48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49', ', [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]], [62, [10]], [4, -8, 990], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 383]], [61, [1, ', 'null, 7, 7, 7]], [62, [', '10]]', ', [4, -6, 989], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0', ', 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]', '], [62, [10]], [4, -7, 990], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, 109', ', 0]], [48, ', '[0, 0, -177, 0]], ', '[49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 8, 9, 7]], [62, [10]], [4, -6, 990], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, 109, 0]], [48, [0, ', '0, -176, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61', ', [1, null, 7, 9, 7]], [62, [10]], [4, -6, 990], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, 109, 0]], [48', ', [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 9, 7]], [62, [10]], [4, -', '6, 992], [0, 0, 0], [-4, 0, 0], ""', ', 0] }\r', '{ "m": 0, "p": [[48, [0, 0, ', '109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]], [', '62, [10]], [4, -5, 990], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, 109, 0]], [48, ', '[0, 0, -176, 0]], [49, [0, 0, ', '166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]], [62, [10]], [4, -6, 989], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, ', '109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 383]], [61, [1, null, 7, 7, 7]], [62, [10]], [5, -8', ', 991], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": ', '[[48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 383]], [61, [1, null, 7, 7, 7]], [62, [10]], [3, -7, 990], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0', ', "p": [[48, [0, 0, 109, 0]], [', '48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 9, 7]], [62, [10]], [3, -10, 991], [', '0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, 109, 0]], [48, [0, ', '0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 383]], [61, [1, n', 'ull, 7, 9, 7]], [62, [10]], [4, -5, 989], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, 109, 0]], [48', ', [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]], ', '[62, [10]], ', '[5, -7, 990], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ ', '"m": 0, "p": [[48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]], [62, [10]], [2, -8, ', '989], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, 109, 0', ']], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0', ']], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]], [62, [10]], [4, -7, 990], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [', '[48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 9, 7]], [62, [10]], [4, -8, 991], ', '[0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [', '0, 0, 109, 0]], [48, [0, 0, -176, 0]], [49, [0, 0, 166, 0]], [63, [0, ', '0, 384]], [61, [1, null, 7, 9, 7]], [62, [10]], [4, -6, 990], [0, 0, 0', '], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0', ', 0, 109, 0]], [48, [0, ', '0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 383]], [61, [1, null, 7, 7, 7]], [62, [10]], [4, -6, 992], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, ', '7, 7]], [62, [10]], [6, -6, 990], [0, 0, 0], [-4, 0, 0], "", 0] }\r{ "m": 2, "p": [8.323, 100] }\r', '{ "m": 0, "p": ', '[[48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]], [62, [10]], [4, -6, 991], [0, 0, 0], [-4, ', '0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, ', '[0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]], [62, [10]], [4, -5, 991], [0, 0, 0], [-4, 0, ', '0], "", 0] }\r', '{ "m": 0, "p": [[48, [', '0, 0, 109, 0]], [48, [0, 0, -177, 0]], [', '49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 8, 9, 7]], [62, [10]], [5, -7, 991], [0, 0, 0], [-4, ', '0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, ', '0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1', ', null, 7, 9, 7]], [62, [10', ']], [4, -7, 991], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0', ', "p": [[48, [0, 0, 109, 0', ']], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]], [62, [10]', '], [4, -5, 989], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [', '[48, [0, 0, 1', '09, 0]], [48, [', '0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]], [62, [10]], [3, -7, 991], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [', '[48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [', '61, [1, null, 7, 7, 7]], [62, [10]], [5, -7, 991], [0, 0, 0], [-4', ', 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 383]], [61, [1, null, 7, 7, 7]], [62, [10]], [6, -5, 989], [0, 0, 0], [-4, 0, 0], ', '"", 0] }\r', '{ "m": 0, "p": [[48, ', '[0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [', '1, null, 7, 7, 7]]', ', [62, [10]], [4, -7, 990], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0', ', "p": [[48, [0, 0, 109, 0]], [48, [0, ', '0, -177, 0]], [49, [0, ', '0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 9, 7]], [62, [10]], ', '[3, -6, 992], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, 109', ', 0]], [48, [0, 0, -176, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]], [62, [10]', '], [4, ', ' - 8, 991], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": ', '[[48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [', '61, [1, null, 7, 7, 7]], [62, [10]], [5, -6, 989], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": ', '[[48, [0, 0, 109, 0]], ', '[48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]], [62, [10]], [3, -7, 991], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0', ', "p": [[48, [', '0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, ', 'null, 7, 7, 7]], [62, [10]], [4, -7, 990], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, 109, 0]], [48, [', '0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 9, 7]], [62, [10]], [5, -6, 991], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[', '48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 9, 7]], [62, [10]], [4, -7, 990], [0, 0, 0]', ', [-4, 0, 0], "", 0]', '}\r', '{ "m": 0, "p": [[48, [0, 0, ', '109, 0]], [48, [0, 0, -176, 0]], [49, [0, 0, 166, ', '0]], [63, [0, 0, 384]], [61, [1, null, 7, 9, 7]], [62, [10]], [3, -7, 989], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, ', '[0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]]', ', [62, [10]], [5, -6, 990]', ', [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0', ', "p": [[48, ', '[0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 383]], [61, [1, null, 7, 7, 7]], [62, [10]], [3, -6, ', '992], [0, 0, 0], [-4, 0, 0], "", 0]', '}\r', '{ "m": 0, "p": [[48, [0, 0, 109, 0]], [48, [0', ', 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]], [62, [10]], [3, -8, 992], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 2, "p": [8.323, 100] }\r', '{ "m": 0, "p": [[48, [0, 0, 109, 0]], [48, ', '[0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, ', '384]], [61, [1, null, 7, 7, 7]], [62, [10]], [5, -7, 990], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, ', '109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 8, 9, 7]], [62', ', [10]], [3, -6, 990], [0, 0, 0], [-4', ', 0, 0], "", 0] }\r', '{ "m": 0, "p": ', '[[48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 9, 7]], [62, [', '10]], [4, -6, 991], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0, 0, 109, 0]], [', '48, [0, 0, -177, 0]], ', '[49, [0, 0, 166, 0]], [63, [0, 0, 383]], [61, [1, null, 7, 7, 7]], [62, [10]], [4, -8, 989], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": ', '[[48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]', '], [62, [1', '0]], [4, -6, 989], [0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, [0', ', 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 7, 7]], [62, [10]], [3, -7, 992], [', '0, 0, 0], [-4, 0, 0], "", 0] }\r', '{ "m": 0, "p": [[48, ', '[0, 0, ', '109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 8, 9, 7]], [62, [10]], [', '3,- 7, 989], [0, 0, 0], [-4, 0, 0], "", 0]}\r', '{ "m": 0, "p": [[', '48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], ', '[61, [1, null, 7, 9, 7]], [62, [10]], [4, -6, 990], [0, 0, 0], [-4, 0, 0], "", 0] }\r ', '{ "m": 0, "p": [[48, [0, 0, 109, 0]], [48, [0, 0, -177, 0]], [49, [0, 0, 166, 0]], [63, [0, 0, 384]], [61, [1, null, 7, 9, 7]], [62, [10', ']], [4, -7, 990], [0, 0, 0], [-4, 0, 0], ', '"", 0] }\r {"i": "ECSn", "r": ', '{ "blocksize": 512', ', "transferid": "53766" }', '}\r']
    var array2 = ['']
    parseUJSON(array);

    async function parseUJSON(streamArray) {

        console.log("here");

        //define for json concatenation
        let jsonline = "";

        // contains latest full json object from SPIKE readings
        let lastUJSONRPC;

        for (var index in streamArray) {
            var value = streamArray[index];
            //concatenate UJSONRPC packets into complete JSON objects
            if (value) {
                // stringify the packet to look for carriage return
                var json_string = await JSON.stringify(value);

                let findEscapedQuotes = /\\"/g;
                let findNewLines = /\\n/g;

                var cleanedJsonString = json_string.replace(findEscapedQuotes, '"');
                cleanedJsonString = cleanedJsonString.substring(1, cleanedJsonString.length - 1);
                // cleanedJsonString = cleanedJsonString.replace(findNewLines,'');

                jsonline = jsonline + cleanedJsonString; // concatenate packet to data

                // regex search for carriage return
                let pattern = /\\r/g;
                var carriageReIndex = jsonline.search(pattern);

                // there is at least one carriage return in this packet
                if (carriageReIndex > -1) {

                    // the concatenated packets start with a left curly brace (start of JSON)
                    if (jsonline[0] == "{" || jsonline.substring(0, 2) == " {") {

                        lastUJSONRPC = jsonline.substring(0, carriageReIndex);

                        // look for conjoined JSON packets: there's at least two carriage returns in jsonline
                        if (jsonline.match(/\\r/g).length > 1) {

                            var conjoinedPacketsArray = jsonline.split(/\\r/); // array that split jsonline by \r

                            // last index only contains "" as it would be after \r
                            for (var i = 0; i < conjoinedPacketsArray.length - 1; i++) {

                                // for every JSON object in array, perform data handling

                                lastUJSONRPC = conjoinedPacketsArray[i];

                                try {
                                    var parseTest = await JSON.parse(lastUJSONRPC)

                                    // // update hub information using lastUJSONRPC
                                    console.log("lastUJSONRPC: ", lastUJSONRPC);

                                }
                                catch (e) {
                                    console.log(e);
                                    console.log("error parsing lastUJSONRPC: ", lastUJSONRPC);
                                    console.log("current jsonline: ", jsonline);
                                    console.log("current cleaned json_string: ", cleanedJsonString)
                                    console.log("current json_string: ", json_string);
                                    console.log("current value: ", value);

                                }

                                jsonline = "";

                            }
                        }
                        else {
                            lastUJSONRPC = jsonline.substring(0, carriageReIndex);

                            // // parsing test
                            try {
                                console.log("lastUJSONRPC: ", lastUJSONRPC);
                            }
                            catch (e) {
                                console.log(e);
                                console.log("error parsing lastUJSONRPC: ", lastUJSONRPC);
                                console.log("current jsonline: ", jsonline);
                                console.log("current cleaned json_string: ", cleanedJsonString)
                                console.log("current json_string: ", json_string);
                                console.log("current value: ", value);
                                console.log("from a jsonline that has only one carriage return")

                            }

                            jsonline = jsonline.substring(carriageReIndex + 1, jsonline.length);
                        }

                    }
                    // there was a carriage return in jsonline but a full JSON object wasnt formed
                    // usually when it's the first packet
                    else {

                        console.log("RESETTING JSONLINE WOOOOOOOOOO")
                        console.log("jsonline: ", jsonline);
                        // reset jsonline for next concatenation
                        jsonline = "";
                    }
                }

            }
        }
    }

})
// DROPPED FEATURE AND TEST IS NOT CORRECT
var testWaitForSeconds = document.getElementById("waitForSeconds");
testWaitForSeconds.addEventListener("click", function () {
    mySPIKE.micropython(0, `
from spike import PrimeHub
from spike.control import wait_for_seconds
def sub_func():
    hub.light_matrix.write('HAPPY')
    wait_for_seconds(2)
    hub.light_matrix.write('SAD')

hub = PrimeHub()
hub.light_matrix.write('start')
wait_for_seconds(2)
hub.light_matrix.write('start2')
sub_func()
hub.light_matrix.write('done')
            `);
})

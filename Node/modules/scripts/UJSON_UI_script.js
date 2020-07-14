//html table elements for all device types
var motorInfo = "<div id = \"motorInfo\">" + "<span>MOTOR</span>" + "<table id = \"motorTable\">" +"<tr>" +"<th>Speed:</th>" +"<td id = \"Mspeed\"> 0</td>" +"</tr>" +
    "<tr>" + "<th>Angle:</th>" + "<td id = \"Mangle\"> 0</td>" + "</tr>" + "<tr>" + "<th>Angle (unit circle):</th>" + "<td id = \"Muangle\" > 0</td>" +
    "</tr>" + "<tr>" + "<th> Power: </th>" + "<td id = \"Mpower\"> 0</td>" + "</tr>" + "</table>" + "</div>";

var ultraInfo = "<div id = \"ultraInfo\">" + "<span>ULTRASONIC</span>" +  "<table id = \"ultraTable\">" + "<tr>" + "<th>Distance:</th>" + "<td id = \"Udist\"> 0</td>" + "</tr>" +
                    "</table>" + "</div>";

var forceInfo = "<div id = \"forceInfo\">"  + "<span>FORCE</span>" + "<table id = \"forceTable\">" +  "<tr>" + "<th>Force (1-10):</th>" +
                    "<td id = \"Famount\"> 0</td>" + "</tr>" + "<tr>" + "<th>Binary</th>" + "<td id = \"Fbinary\"> 0</td>" + "</tr>" +
                "<tr>" + "<th>Force (Sensitive):</th>" +  "<td id = \"Fbigamount\" > 0</td>" +  "</tr>" + "</table>" + "</div>";


var colorInfo = "<div id = \"colorInfo\">" + "<span>COLOR</span>" + "<table id = \"colorTable\">" +  "<tr>" +  "<th> Reflectivity:</th>" + "<td id = \"Cdist\"> 0</td>" +
                "</tr>" + "<tr>" + "<th>Ambient Light:</th>" +  "<td id = \"Cunknown\"> 0</td>" + "</tr>" + "<tr>" + "<th> Color (RGB):</th>" +
                "<td id = \"Crgb\">" + "<div id = \"rgbbox\" data-r = \"0\", data-g = \"0\", data-b = \"0\"> </div> " + "</td>" +
                    "</tr>" + "</table>" + "</div>";

//let REPL = $("#REPL");
var current_message;
var getvalueInt;
var show_datastream = true;

//parse information about devices connected to the ports
async function display_port() {
    var display_port_Int;
    ports = await get_devices();
    value = await retrieve_data();
    parsed = await JSON.parse(value);
    data = await parsed.p;
    var index_to_port = ["A","B","C","D","E","F"];
    //parse connected devices' readings
    for ( var key = 0; key < 6; key++ ) {
        letter = index_to_port[key];
        device_type = ports[letter];
        if ( device_type != "None" ) {

            //populate the options in portSelect
            $("#" + letter).html(device_type + "(" + letter + ")");

            if ( device_type == "Motor" ) {
                await $("#port" + letter + "info").html(motorInfo);
                Mspeed = await data[key][1][0];
                Mangle = await data[key][1][1];
                Muangle = await data[key][1][2];
                Mpower = await data[key][1][3];

                $("#port" + letter).find("#Mspeed").text(Mspeed);
                $("#port" + letter).find("#Mangle").text(Mangle);
                $("#port" + letter).find("#Muangle").text(Muangle);
                $("#port" + letter).find("#Mpower").text(Mpower);
            }
            if ( device_type == "Ultrasonic" ) {
                await $("#port" + letter + "info").html(ultraInfo);
                Udist = await data[key][1][0];
                $("#port" + letter).find("#Udist").text(Udist);
            }
            if ( device_type == "Force") {
                await $("#port" + letter + "info").html(forceInfo);
                Famount = await data[key][1][0];
                Fbinary = await data[key][1][1];
                Fbigamount = await data[key][1][2];
                $("#port" + letter).find("#Famount").text(Famount);
                $("#port" + letter).find("#Fbinary").text(Fbinary);
                $("#port" + letter).find("#Fbigamount").text(Fbigamount);
            }
            if ( device_type == "Color" ) {
                await $("#port" + letter + "info").html(colorInfo);
                Cdist = await data[key][1][0];
                Cunknown = await data[key][1][1];
                Cr = await data[key][1][2];
                Cg = await data[key][1][3];
                Cb = await data[key][1][4];
                $("#" + letter).find("#Cdist").text(Cdist);
                $("#" + letter).find("#Cunknown").text(Cunknown);
                $("#" + letter).find("#rgbbox").css("background-color", "rgb(" + Cr + "," + Cg + "," + Cb + ")");
            }
        }
        else {
            await  $("#port" + letter + "info").html("");
        }
    }
    //parse hub information
    gyro_x = data[6][0];
    gyro_y = data[6][1];
    gyro_z = data[6][2];
    $("#gyro").text(gyro_x + ", " + gyro_y + "," + gyro_z);
    accel_x = data[7][0];
    accel_y = data[7][1];
    accel_z = data[7][2];
    $("#accel").text(accel_x + ", " + accel_y + ", " + accel_z);
    posi_x = data[8][0];
    posi_y = data[8][1];
    posi_z = data[8][2];
    $("#posi").text(posi_x + ", " + posi_y + ", " + posi_z);
}

async function toggleStream() {
    console.log("hihi");
    if (show_datastream) {
        $("#datastream").css("display","none");
        $("#portdatastream").css("display","block");
        show_datastream = false;
    }
    else {
        $("#datastream").css("display","block");
        $("#portdatastream").css("display","none");
        show_datastream = true;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("UJSON_interface DOM loaded")

    $("#delay_amount").on("input", function (event) {
        change_retrieval_interval()
    });

    $("#reboot").on("click", async () => {
            // SEND Hub Reboot (control-C + control-D)
        reboot_hub()
    })

    $("#connect").on("click", async () => {
        await setup_port()
        read_stream()
        await sleep(3000)
        setPortInt = setInterval( async () => {
            await display_port();
        }, 100);
    })

    $("#send").on("click", async () => {
        console.log("ok")
        sendDATA($("#data").val());
    })

    $("#toggleStream").on("click", async () => {
        toggleStream();
    })

    //make the interface draggable
    dragElement("ujsonrpcbox");

    change_retrieval_interval()
})

//set or change the interval at which data is retrieved
var setInt
async function change_retrieval_interval() {
    let REPL = document.getElementById("REPL");
    console.log($("#delay_amount").val())
    clearInterval(setInt)
    setInt = setInterval( async () => {
        try {
            retrieve_data().then((value => REPL.value = value))
        }
        catch (e){

        }
    }, $("#delay_amount").val() * 1000
    )
}

//sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
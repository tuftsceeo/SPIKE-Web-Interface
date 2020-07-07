var APIkey = ""
var all_tags = [];

document.addEventListener("DOMContentLoaded", () => {
    console.log ("systemlink DOM lodaded")
    keyinputfield = document.getElementById("keyinputfield");
    keyinputfield.addEventListener("change", async function () {
        if( await auth_key(keyinputfield.value) ) {
            $("#key_valid").html("Valid APIkey!");
            APIkey =keyinputfield.value;
            //get all tag names from cloud and display it on UI
            await get_tag_list(APIkey).then(
                (tags_list) => update_tag_selects(tags_list), 
                (tags_list) => all_tags = tags_list
            );
            //display the first selected tag
            display_select_value();
            get_value_interval();
        }
    })

    //when "Submit" button is clicked, update value
    $("#updateTagValue").click(change_current_value)

    //make the interface draggable
    dragElement("syslinkbox");
})

//update the scroll down list with available tags
function update_tag_selects(tags_list) { 
    var number_of_tags = tags_list.length
    console.log("total count:" + number_of_tags)
    for (var i = 0; i < number_of_tags; i++) {
        var select_element = $("<option></option>").text(tags_list[i])
        $("#tagSelect").append(select_element)
    }
}

//shows the selected tag's current value
async function display_select_value() {
    var selected_option = $("#tagSelect option:selected").text(); 
    get_value(APIkey, selected_option).then((value) => $("#currVal").text(value))
}

//change the current value of tag
async function change_current_value() {
    var selected_option = await $("#tagSelect option:selected").text(); 
    var new_value = await $("#tagValInput").val();
    console.log("new_value", new_value)
    console.log("selected option", selected_option)
    var exists = false;
    console.log("newvalue", new_value)
    for (var i = 0; i < all_tags.length; i++) {
        if ( all_tags[i] == selected_option ) {
            exists = true;
        }
    }
    //check type of new_value
    var inputType = input_type(new_value);
    await update_value(APIkey, selected_option, inputType, new_value);
    display_select_value()
}


//returns the data type indicator of tag based on given argument
function input_type(new_value) {
    //if the value is not a number
    if ( isNaN(new_value) ) {
        //if the value is a boolean
        if (new_value == "true" || new_value == "false") {
            return "BOOLEAN";
        }
        //if the value is a string
    return "STRING"; 
    }
    //value is a number
    else {
        //if value is an integer
        if ( Number.isInteger(parseFloat(new_value)) ) {
            return "INT"
        }
        //if value is a double
        else {
            return "DOUBLE"
        }
    }
}

async function get_value_interval() {
    getValInt = setInterval( async () => {
    display_select_value()
    }, 1000
)
}
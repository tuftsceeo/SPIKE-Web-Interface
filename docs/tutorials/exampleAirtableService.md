```html

<html>
<head>
    <!-- Import ServiceDock -->
    <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface/cdn/ServiceDock.js"></script>
    <!-- Link Airtable functions to DOM Elements-->
    <script>
        // global variables for interacting with Service Dock's Airtable Service
        var airtableElement;
        var my_airtable;

        function updateOnAirtable(key, newValue) {
            /* check if given key already exists on Airtable*/
            var names = my_airtable.getNames();
            var exists = false;
            for (var index in names) {
                if (names[index] == key) {
                    exists = true;
                    break;
                }
            }

            // key already exists, only update
            if (exists) {
                // update key and value on Airtable
                my_airtable.updateValue(key, newValue);
            }
            // key does not exist, create a new pair
            else {
                my_airtable.createNameValuePair(key, newValue)
            }
        }

        //Wrapper functions for updating airtable based on button, slider, and text input
        function button_function(elem) {
            // retrieve key & value pairs from buttons' attributes
            var key = elem.getAttribute('airtable_value');
            var newValue = elem.innerHTML;

            // update or create Name & Value pair on Airtable
            updateOnAirtable(key, newValue);

            // alert user of change
            alert('Set airtable attribute "' + key + '" to be "' + newValue + '"');

        }
        function range_function(elem) {
            // retrieve key & value pairs from buttons' attributes
            var key = elem.getAttribute('airtable_value');
            var newValue = elem.value;

            // update or create Name & Value pair on Airtable
            updateOnAirtable(key, newValue);

            // alert user of change
            alert('Set airtable attribute "' + key + '" to be "' + newValue + '"');
        }

        function text_function(elem) {
            // retrieve key & value pairs from buttons' attributes
            var key = elem.getAttribute('airtable_value');
            var newValue = elem.value;

            // update or create Name & Value pair on Airtable
            updateOnAirtable(key, newValue);

            // alert user of change
            alert('Set airtable attribute "' + key + '" to be "' + newValue + '"');
        }

        //Setup for assigning elements to wrapper functions
        function setup() {
            d = document.querySelectorAll("button");
            for (i = 0; i < d.length; i++) {
                d[i].onclick = function () { button_function(this); }
            }
            d = document.querySelectorAll("input[type=range]");
            for (i = 0; i < d.length; i++) {
                d[i].onclick = function () { range_function(this); }
            }
            d = document.querySelectorAll("form[type=textinput]");
            for (i = 0; i < d.length; i++) {

                var current_form = d[i];
                var text_entry = d[i].elements[0];
                var submit_button = d[i].elements[1];

                submit_button.onclick = function () { text_function(text_entry); }

            }
        }

        window.addEventListener('load', function () {
            // setup the onclick listeners for the interactive webpage elements
            setup();
            // setup the ServiceDock
            airtableElement = document.getElementById("service_airtable");
            my_airtable = airtableElement.getService();
        });

    </script>
    <style>
        /* This is where you can make changes to the
        appearance of your different blocks.

        For info on CSS, copy and paste the link
        below into your browser!

        https://www.w3schools.com/css/default.asp

        */

        .buttonBlock{
            /*Give your button block some style!
            Add color, change the border, and
            change the size using CSS styling*/
            background-color:lightblue;
            border:solid;
            padding-top: 10px;
            padding-bottom: 10px;
            padding-left: 40px;
            width:30%;
        }

        .sliderBlock{
            /*Give your slider block some style!
            Add color, change the border, and
            change the size using CSS styling*/
            background-color:orange;
            border:solid;
            padding-top: 10px;
            padding-bottom: 10px;
            padding-left: 40px;
            width:30%;
        }

        .textBlock{
            /*Give your text block some style!
            Add color, change the border, and
            change the size using CSS styling*/
            background-color:lightgreen;
            border:solid;
            padding-top: 10px;
            padding-bottom: 10px;
            padding-left: 40px;
            width:30%;
        }

    </style>
<!-- --------------------------------------------- -->
</head>
<body style="background-color: none">

    <!-- Create ServiceDock visual interface-->
    <div id="servicedock" style="float:right;">
        <service-airtable id="service_airtable"></service-airtable>
    </div>
    <br>

    <!-- INPUTS: -->

    <!-- Types of input: Button -->

<!--
    Add buttons using the button tag. The name in airtable_value
    will be set to whatever is in between the button tag.
    In the case of the first button below, 'action' will be set
    to 'Slower'
-->

    <div class='buttonBlock'>
    <p>Robot Control Buttons</p> <!-- Name your button(s) in this paragraph tag -->
	<button airtable_value='action'>Slower</button>
	<button airtable_value='action'>Faster</button>
	<button airtable_value='action'>Stop</button>
    </div>

    <!-- Types of input: Slider -->

<!--
    Add sliders & buttons together by using the <input type='range'>
    tag and the button tag. The slider can have a min/max value
    and a starting value called 'value'. The name in airtable_value
    will be set to the value of the slider whenever it is dragged.
-->

    <div class='sliderBlock'>
    <p>Motor Control with Slider</p> <!-- Name your slider(s) in this paragraph tag -->
	<button airtable_value='motor1'>Forward</button>
	<button airtable_value='motor1'>Backward</button>
	<button airtable_value='motor1'>Stop</button>
    <input type="range" min="1" max="100" value="50" airtable_value='motor1_speed'>
    </div>

    <!-- Types of input: Text -->

<!--
    Add text input using the <form> tag with an <input type='text'>
    tag inside. The form requires a submit button, which can be
    copied and pasted below the text input tag. Make sure to use
    1 form per 1 text input! The name in airtable_value will be
    set to whatever the user enters into the text input.
-->

    <div class='textBlock'>
    <p>Text Input</p> <!-- Name your text input in this paragraph tag -->
    <form type='textinput'>
        <input type='text' airtable_value='text_input'>
        <input type='button' value='Submit'>
    </form>
    </div>

<!-- That's it for the HTML side! -->

</body>
</html>
```
<!-- Taken from documentation folder, which got the files from examples --->
<iframe id="example-result" width="100%" height="800" frameborder="0" src="servicedock_airtableEN1.html"></iframe>
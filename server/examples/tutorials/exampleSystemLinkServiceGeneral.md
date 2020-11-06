```html
<html>
    <!-- Include ServiceDock -->
    <head>
        <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface/cdn/ServiceDock.min.js"></script>
        <style>
            input {
                width: 100px;
                height: 20px;
            }
            
            #interface {
                position: relative;
                display: flex;
                flex-direction: column;
                left: 400px;
                top: 100px;
                background-color: #4CE0D2;
                height: 400px;
                width: 500px;
                border: solid;
            }

            .action {
                margin: 5%;
                position: relative;
                justify-content: center;
            }
        </style>
    </head>
    <body>
        <div id="servicedock" style="float:left;">
            <!-- Include systemlink service-->
            <service-systemlink id="service_systemlink"></service-systemlink>
        </div>
        <div id = "interface">
            <div class = "action">
                <h3>
                    Change existing tags
                </h3>
                <div id="changeTag">
                    <select id="existingTags">
                    
                    </select>
                    <input id="changeTagValue" type="text" placeholder="Value">
                    <input id="changeTagSubmit" type="submit" value="change">
                </div>
                <div>
                    Current value:
                    <span id="currentValue">
                    
                    </span>
                </div>
            </div>
            <div class = "action">
                <h3>
                    Create tags
                </h3>
                <div id="createTag">
                    <input id="createTagName" type="text" placeholder="Tag Name">
                    <input id="createTagValue" type="text" placeholder="Value">
                    <input id = "createTagSubmit" type="submit" value="Create">
                </div>
                <div>
                    Status:
                    <span id="createTagStatus">
                
                    </span>
                </div>
            </div>
        </div>
    </body>
    <script>
        //Use ServiceDock here!
        var SystemLinkService = document.getElementById("service_systemlink");

        var mySL = SystemLinkService.getService(); // your Service object

        var realTimeTagsInfo = {}; // real time System Link Cloud tags

        /* HTML Elements */
        var existingTagsElement = document.getElementById("existingTags");
        var currentValue = document.getElementById("currentValue");
        var changeTagValue = document.getElementById("changeTagValue");
        var createTagValue = document.getElementById("createTagValue");
        var createTagName = document.getElementById("createTagName");
        var createTagStatus = document.getElementById("createTagStatus");

        // populate <select> with all tags on the cloud and display the selected Tag's (first Tag) value
        mySL.executeAfterInit( function() {
            populateSelection();
            displayCurrentValue();
        });
        
        SystemLinkService.init(); 
        
        // append <option> of Tags to <select>
        function populateSelection() {
            existingTagsElement.innerHTML = ""; //reset <select>
            // get all tags information from Cloud
            realTimeTagsInfo = mySL.getTagsInfo();

            // append each to <select>
            for (var key in realTimeTagsInfo) {
                var optionElement = document.createElement("option");
                optionElement.innerHTML = key;
                existingTagsElement.appendChild(optionElement);
            }
        }

        // when another <option> is selected
        existingTagsElement.addEventListener("change", function() {
            displayCurrentValue();
        })

        // display the value of the currently "selected" Tag option
        function displayCurrentValue() {
            // get the name of currently selected Tag
            var key = existingTagsElement.options[existingTagsElement.selectedIndex].text;

            // get the value of the Tag
            var value = mySL.getTagValue(key);

            // update display
            currentValue.innerHTML = value;
        }

        // button to change Tag's value was clicked
        var changeTagButton = document.getElementById("changeTagSubmit");
        changeTagButton.addEventListener("click", function () {
            // get the name of Tag to change
            var key = existingTagsElement.options[existingTagsElement.selectedIndex].text;

            // get the value to change Tag to
            var newValue = changeTagValue.value;
            
            changeTagValue.value = ""; // reset input field
            
            // change Tag's value
            mySL.setTagValue(key, newValue, function() {
                displayCurrentValue();
            })
        })

        var createTagButton = document.getElementById("createTagSubmit");
        createTagButton.addEventListener("click", function() {

            createTagStatus.innerHTML = "creating tag"

            // get the name of Tag to create
            var nameInput = createTagName.value;
            var key = nameInput;

            // get the value to create the Tag with
            var newValue = createTagValue.value;

            // convert the value's type based on input
            var convertedValue = convertValue(newValue);

            // reset input fields
            createTagValue.value = ""; 
            createTagName.value = "";

            // create new Tag
            mySL.createTag(key, newValue, function () {
                populateSelection();
                displayCurrentValue();
                createTagStatus.innerHTML = "tag was created!"
            })
        })

        // change value from <input> to be of correct type
        function convertValue(new_value) {
            var convertedValue;
            //if the value is not a number
            if (isNaN(new_value)) {
                //if the value is a boolean
                if (new_value == true) {
                    convertedValue = true;
                } 
                if (new_value == false) {
                    convertedValue = false;
                }
                // value is a string, no change needed.
                else {
                    convertedValue = new_value;
                }
            }
            //value is a number
            else {
                // value is a number, no change needed
                convertedValue = new_value;
            }

            return convertedValue;
        }
    </script>

</html>
```
<!-- Taken from documentation folder, which got the files from examples --->
<iframe id="example-result" width="100%" height="800" frameborder="0" src="servicedock_systemlink.html"></iframe>
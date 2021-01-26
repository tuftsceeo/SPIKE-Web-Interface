## Initializing Your Airtable
Assuming you have successfully set up a table on your Airtable account, you should now have a Base ID, API Key, and Table Name. You probably want to store these in variables so you know which is which and can easily edit them if needed later.

As explained in the "Using ServiceDock" tutorial, ServiceDock allows for communication between your webpage and various "services" such as the SPIKE Prime. Airtable is one such service, and you can set up and access a Service_Airtable object in much the same way as a Service_SPIKE. Then, you can link it to your existing table with `init(APIKey, BaseID, TableName, pollIntervalInput)` (pollIntervalOutput is how often, in milliseconds, the webpage will pull tags down from the cloud, with a default value of 1000). All of that put together would look like this:

```HTML
<html>
    <head>
        <script type="text/javascript" src="./modules/ServiceDock_Airtable.js"></script>
    </head>
    <body>
         <div id = "servicedock" style = "float:right;">
            <service-airtable id = "service_airtable"></service-airtable>
        </div>
        <label for="speed_slider">Motor Speed (-100 to 100): </label>
        <input type="range" id="speed_slider" onchange="sendMotorSpeed(this.value)" min="-100" max="100">
    </body>
    <script>
        var myTable = document.getElementById("service_airtable").getService();
        // your API key, base ID, and table name go here
        var apiKey = "your_API_key";
        var baseID = "your_base_ID";
        var tableName = "your_table_name";

        myTable.init(apiKey, baseID, tableName)
    </script>
</html>
```

## Sending Values
So, we have now sucessfully linked our webpage to an Airtable. But how do we use it? Typically, when controlling a SPIKE remotely, we would have two webpages: the remote one, which sends values to the table based on user input, and the local page, which would run on the computer connected to the SPIKE and pull those values down from Airtable for use in a SPIKE Prime program. Let's start with the remote page.

Suppose we want to build a robot with a motor that can be controlled **remotely** with a slider. On our remote page, then, we'd want to have a slider that sends its value into Airtable every time said value is changed. We can accomplish this using an HTML "range" input and the `setTagValue(name, value, callback)` function of Service_Airtable, where `name` is the name of the Airtable entry you want to change and `value` is the slider value you want to send (you can also add a callback function to run after the value is sent, but we won't be using that for now). 

Notably, `setTagValue` will throw an error if you attempt to change a tag that doesn't exist in your table, so we might want to add some code for ensuring the existence of the tags we plan on using in the `executeAfterInit` function of our table. This can be accomplished with the `Service_Airtable`'s `getTagsInfo()` function, which returns an object with a field corresponding to each row in the table. For example, if our table had a row called "speed", `myTable.getTagsInfo()["speed"]` would return an object containing the name "speed" and the current value corresponding to "speed" in the table. If "speed" didn't exist, that line would return an undefined value, allowing us to use `myTable.getTagsInfo()["tag_name"] == undefined` to check if a tag called "tag_name" exists in the table, and either create or update an existing tag accordingly.

Our final code would look like this:

```html
<html>
    <head>
        <script type="text/javascript" src="./modules/ServiceDock_Airtable.js"></script>
    </head>
    <body>
         <div id = "servicedock" style = "float:right;">
            <service-airtable id = "service_airtable"></service-airtable>
        </div>
        <label for="speed_slider">Motor Speed (-100 to 100): </label>
        <input type="range" id="speed_slider" onchange="sendMotorSpeed(this.value)" min="-100" max="100">
    </body>
    <script>
        var myTable = document.getElementById("service_airtable").getService();
        // your API key, base ID, and table name go here
        var apiKey = "your_API_key";
        var baseID = "your_base_ID";
        var tableName = "your_table_name";

        myTable.init(apiKey, baseID, tableName)

        myTable.executeAfterInit(function() {
            if(myTable.getTagsInfo()["motor_speed"] == undefined)
                myTable.createTag("motor_speed", 0)
            else
                myTable.setTagValue("motor_speed", 0)
        })

        function sendMotorSpeed(speed) {
            myTable.setTagValue("motor_speed", parseInt(speed))
        }
    </script>
</html>
```
Copy-and-pasting this into your own code and plugging in your own baseID, apiKey, and tableName should yield a webpage with a slider that, when moved, changes the value under "motor_speed" in your airtable. In the next tutorial, we'll look at what *do* with that value.

## Additional Note: Types
You may have noticed my use of `parseInt(speed)` instead of just `speed` when sending the slider value into Airtable. In many coding languages, such as Java and C, variables have types corresponding to what sort of data they hold, such as an integer, character, or string of text. JavaScript does not explicitly have these types- when creating a variable, you do not have to specify what type of data it is meant to hold, or even stick to the type of its initial value throughout the program. Service_Airtable, however, *does* recognize these differences, and will throw errors if you attempt to, say, set a string of text as the value of a tag that originally held an integer. In this code, `speed` on its own would actually be received as a string *containing* the integer from the slider, hence my use of `parseInt()` (a built-in JavaScript function) to essentially convert that string into an integer. 

`Service_Airtable` also happens to have a function called `setTagValueNotStrict(name, value, callback)` that would do this conversion for us, which probably would've been fine for our purposes in this particular program, but can lead to unpredictable outcomes in other cases. Regardless, types are a good thing to be aware of, especially when trying to debug issues with using values from Airtable.
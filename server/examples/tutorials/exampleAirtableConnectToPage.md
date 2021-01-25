## Initializing Your Airtable
Assuming you have successfully set up a table on your Airtable account, you should now have a Base ID, API Key, and Table Name. You probably want to store these in variables so you know which is which and can easily edit them if needed later.

As explained in the "Using ServiceDock" tutorial, ServiceDock allows for communication between your webpage and various "services" such as the SPIKE Prime. Airtable is one such service, and you can set up and access a Service_Airtable object in much the same way as a Service_SPIKE. Then, you can link it to your existing table with `init(APIKey, BaseID, TableName, pollIntervalInput)` (TODO: add short explanation for pollIntevalInput). All of that put together would look like this:

```HTML
<html>
    <head>
        <script type="text/javascript" src="./modules/ServiceDock_Airtable.js"></script>
    </head>
    <body>
         <div id = "servicedock" style = "float:left;">
            <service-systemlink id = "service_airtable"></service-systemlink>
        </div>
    </body>
    <script>
        var myAirtable = document.getElementById("service_airtable").getService();
        // your API key, base ID, and table name go here
        var baseID = "your_base_ID";
        var apiKey = "keyXXXXXXXXXXXXXXX";
        var tableName = "your_table_name";

        myAirtable.init(baseID, apiKey, tableName, 2000)
    </script>
</html>
```

## Sending Values
So, we have now sucessfully linked our webpage to an airtable. But how do we use it? Typically, when controlling a SPIKE remotely, we would have two webpages: the remote one, which sends values to the table based on user input, and the local page, which would run on the computer connected to the SPIKE and pull those values down from airtable for use in a SPIKE Prime program. Let's start with the simpler half, which is the remote page.

Suppose we want to build a robot with a motor that can be controlled **remotely** with a slider. On our remote page, then, we'd want to have a slider that sends its value into Airtable every time said value is changed. We can accomplish this using an HTML "range" input and the `setTagValue(name, value, callback)` function of Service_Airtable, where `name` is the name of the airtable entry you want to change and `value` is the slider value you want to send (you can also add a callback function to run after the value is sent, but we won't be using that for now). Our final code would look like this:

```html
<html>
    <head>
        <script type="text/javascript" src="./modules/ServiceDock_Airtable.js"></script>
    </head>
    <body>
         <div id = "servicedock" style = "float:left;">
            <service-systemlink id = "service_airtable"></service-systemlink>
        </div>
        <label for="speed_slider">Motor Speed (-100 to 100): </label>
        <input type="range" id="speed_slider" onchange="sendMotorSpeed(this.value)" min="-100" max="100">
    </body>
    <script>
        var myTable = document.getElementById("service_airtable").getService();
        // your API key, base ID, and table name go here
        var baseID = "your_base_ID";
        var apiKey = "keyXXXXXXXXXXXXXXX";
        var tableName = "your_table_name";

        myTable.init(baseID, apiKey, tableName, 2000)

        function sendMotorSpeed(speed) {
            myTable.setTagValue("motorSpeed", speed)
        }
    </script>
</html>
```

Copy-and-pasting this into your own code and plugging in your own baseID, apiKey, and tableName should yield a webpage with a slider that, when moved, changes the value under "motorSpeed" in your airtable. In the next tutorial, we'll learn what *do* with that value.
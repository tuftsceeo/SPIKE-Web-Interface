## Initializing Your Airtable
Assuming you have successfully set up a table on your Airtable account, you should now have a Base ID, API Key, and Table Name. But where do we put them?

As explained in the "Using ServiceDock" tutorial, ServiceDock allows for communication between your webpage and various "services" such as the SPIKE Prime. Airtable is one such service, and you can set up and access a Service_Airtable object in much the same way as a Service_SPIKE.

Once you have that, there are two ways of linking the Service_Airtable to your existing table. One is to do it all inline, using the function `init(APIKey, BaseID, TableName, pollIntervalInput)` (pollIntervalOutput is how often, in milliseconds, the webpage will pull tags down from the cloud, with a default value of 1000). With that method, your code would look like this:

```HTML
<html>
    <head>
        <script type="text/javascript" src="./modules/ServiceDock_Airtable.js"></script>
    </head>
    <body>
         <div id = "servicedock" style = "float:right;">
            <service-airtable id = "service_airtable"></service-airtable>
        </div>
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

Alternatively, you can set the API Key, Base ID, and Table Name individually as attributes of the `service_airtable` HTML object. This works the same as any HTML attribute, such as `onclick` or `id`; you can do this either in HTML, e.g.
```html
    <service-airtable id = "service_airtable" apikey = "your_API_key" baseid = "your_base_ID" tableName = "your_table_name"></service-airtable>
```
or JavaScript
```javascript
var airtableElement = document.getElementById("service_airtable")
// note that we are setting attributes of the HTML element, and not the Service_Airtable object itself (which we would access by calling .getService() on airtableElement)
airtableElement.setAttribute("apikey", "your_API_key")
airtableElement.setAttribute("baseid", "your_base_ID")
airtableElement.setAttribute("tablename", "your_table_name")
```
Once these are set, we would then call `init()` (with no parameters) **on the HTML element** (NOT on the Service_Airtable object), eg
```javascript
var airtableElement = document.getElementById("service_airtable")
// note that we are setting attributes of the HTML element, and not the Service_Airtable object itself (which we would access by calling .getService() on airtableElement)
airtableElement.setAttribute("apikey", "your_API_key")
airtableElement.setAttribute("baseid", "your_base_ID")
airtableElement.setAttribute("tablename", "your_table_name")
airtableElement.init()
```

The third and final way to initialize your Service_Airtable is done on the webpage itself rather than in code. As with the SPIKE Service, the `<service-airtable>` HTML tag puts a square icon on the page, with a red or green circle indicating whether or not the table has been initialized. If the circle is red, you can click on the icon and manually enter an API Key, Base ID, and Table Name, then click the icon a second time to initialize the table.

## Sending Values
So, we have now successfully linked our webpage to an Airtable. But how do we use it? Typically, when controlling a SPIKE remotely, we would have two webpages: the remote one, which sends values to the table based on user input, and the local page, which would run on the computer connected to the SPIKE and pull those values down from Airtable for use in a SPIKE Prime program. Let's start with the remote page.

Suppose we want to build a robot with a motor that can be controlled **remotely** with a slider. On our remote page, then, we'd want to have a slider that sends its value into Airtable every time said value is changed. We can accomplish this using an HTML "range" input and either the `setEntryValueStrict(name, value, callback)` or function `setEntryValueNotStrict(name, value, callback)` of Service_Airtable, where `name` is the name of the Airtable entry you want to change and `value` is the slider value you want to send (you can also add a callback function to run after the value is sent, but we won't be using that for now). 

But hold on, which one do we use? Why is one "strict" and the other "not strict"? In order to answer that, we're unfortunately going to have to go on a little bit of a tangent.

## Strict vs Not Strict (Data Types)
In many coding languages, such as Java and C++, variables have types corresponding to what sort of data they hold, such as an integer, character, or string of text. JavaScript does not explicitly have these types- when creating a variable, you do not have to specify what type of data it is meant to hold, or even stick to the type of its initial value throughout the program. A JavaScript program will compute `0 == "0"` as `true`, regardless of one being an integer and the other a string.

However, in certain contexts, types are still an important thing to keep in mind. As previously mentioned, JavaScript considers number zero on its own equivalent to a string containing the number zero using the `==` operator (though not the `===` one). But with the `+` operator, those two zeroes will behave differently; JavaScript would compute `1 + 0` as `1`, but `1 + "0"` as `"10"`. If you were trying to, say, make a calculator in JavaScript, you'd therefore have to be mindful of which data type the program was receiving user input as, and convert it into integers accordingly.

The difference between `setEntryValueStrict` and `setEntryValueNotStrict` is the adherence to these types. If we were to run
```javascript
myTable.setEntryValueStrict("speed", "10")
myTable.setEntryValueStrict("speed", 20)
```
the second line would throw an error, because we tried to put an integer into an entry that had previously held a string. But if we had instead used `setEntryValueNotStrict`, Service_Airtable would've performed its own conversion and run smoothly.

This might seem automatically preferable; why bother dealing with conversions on our end if we can just use non-strict mode and ignore types altogether? But think back to that calculator example; in that case, it might be nice to know for sure the type of the data we were receiving. Like the + operator, many Service_SPIKE functions, such as setting motor speeds, expect to receive numbers, and will throw errors if they get strings instead. In general, playing it too loosely with types can lead to unexpected behavior, and strict mode can help us keep things consistent.

## The Final Product
Putting all of this together, our final code would look like this:

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
        var airtableElement = document.getElementById("service_airtable")
        // your API key, base ID, and table name go here
        airtableElement.setAttribute("apikey", "your_API_key")
        airtableElement.setAttribute("baseid", "your_base_ID")
        airtableElement.setAttribute("tablename", "your_table_name")
        airtableElement.init()

        var myTable = airtableElement.getService();

        function sendMotorSpeed(speed) {
            myTable.setEntryValueStrict("motor_speed", parseInt(speed)) 
            // here, speed is actually coming in as a string, which would be a problem when trying to send it into a motor, hence the use of the built-in JavaScript function "parseInt" to convert it into an integer
        }
    </script>
</html>
```
Copy-and-pasting this into your own code and plugging in your own baseID, apiKey, and tableName should yield a webpage with a slider that, when moved, changes the value under "motor_speed" in your Airtable. In the next tutorial, we'll look at what *do* with that value.
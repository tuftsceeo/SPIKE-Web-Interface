## Initializing Your Airtable
Assuming you have successfully set up a table on your Airtable account, you should now have a Base ID, API Key, and Table Name. But where do we put them?

As explained in the "Using ServiceDock" tutorial, ServiceDock allows for communication between your webpage and various "services" such as the SPIKE Prime. Airtable is one such service, and you can set up and access a Service_Airtable object in much the same way as a Service_SPIKE. There are essentially three ways of linking the Service_Airtable to your existing table. 

## Method 1: Inline
One is to do it all inline, using the Service_Airtable function `init(APIKey, BaseID, TableName, pollIntervalInput)` (pollIntervalOutput is how often, in milliseconds, the webpage will pull tags down from the cloud, with a default value of 1000). With that method, your code would look like this:

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
        var myTable =  document.getElementById("service_airtable").getService();
        // your API key, base ID, and table name go here
        var apiKey = "your_API_key";
        var baseID = "your_base_ID";
        var tableName = "your_table_name";

        myTable.init(apiKey, baseID, tableName)
    </script>
</html>
```

## Method 2: HTML Attributes
Alternatively, you can set the API Key, Base ID, and Table Name individually as attributes of the `service-airtable` HTML object. This works the same as any HTML attribute, such as `onclick` or `id`; you can do it either in HTML, e.g.

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

## Method 3: On the Page
The third and final way to initialize your Service_Airtable is done on the webpage itself rather than in code. As with the SPIKE Service, the `<service-airtable>` HTML tag puts a square icon on the page, with a red or green circle indicating whether or not the table has been initialized. If you click on the icon while the circle is red, the page will prompt you for an API Key, Base ID, and Table Name, which you can manually input in order to connect.

## Initialiing the HTML Object
Once your values are set, you have to initialize the HTML `service-airtable` element (which is, again, different from the Service_Airtable object accessed by calling `getService()` on said HTML element) with either the `init()` function, e.g.

```javascript
var airtableElement = document.getElementById("service_airtable")

// code for setting key/id/name goes here

airtableElement.init()
```
or, if using method 3, by clicking the Airtable icon a second time.

Regardless of which way you choose, the end result is the same: you have now connected your local webpage to a cloud-based table via a Service_Airtable object, which you can then use to send and receive data (more on that in the next few tutorials).
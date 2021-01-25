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
    </body>
    <script>
        var myAirtable = document.getElementById("service_airtable").getService();
        //TODO: make a table & initialize these
        var baseID;
        var apiKey;
        var tableName;

        myAirtable.init(baseID, apiKey, tableName, 2000)
    </script>
</html>
```

## Sending Values
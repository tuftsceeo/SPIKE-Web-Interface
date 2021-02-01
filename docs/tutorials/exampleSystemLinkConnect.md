## Initializing Service_SystemLink

As explained in the "Using ServiceDock" tutorial, ServiceDock allows for communication between your webpage and various "services" such as the SPIKE Prime. SystemLink is one such service, and you can set up and access a Service_SystemLink object in much the same way as a Service_SPIKE. There are essentially three ways of linking the Service_SystemLink to your existing database (if you happen to have experience using Service_Airtable, these are going to look very familiar). 

## Method 1: Inline
One is to do it all inline, using the Service_SystemLink function `init(APIKey, pollIntervalInput)` (pollIntervalOutput is how often, in milliseconds, the webpage will pull tags down from the cloud, with a default value of 1000). With that method, your code would look like this:

```HTML
<html>
    <head>
        <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface@1.0/cdn/ServiceDock.min.js"></script>
    </head>
    <body>
         <div id = "servicedock" style = "float:right;">
            <service-systemlink id = "service_systemlink"></service-systemlink>
        </div>
    </body>
    <script>
        var serviceSystemLink = document.getElementById("service_systemlink").getService();
        // your API key goes here
        var apiKey = "your_API_key";  

        serviceSystemLink.init(apiKey)
    </script>
</html>
```

## Method 2: HTML Attributes
Alternatively, you can set the API Key as attribute of the `service-systemlink` HTML object. This works the same as any HTML attribute, such as `onclick` or `id`; you can do it either in HTML, e.g.

```html
    <service-systemlink id = "service_systemlink" apikey = "your_API_key"></service-systemlink>
```
or JavaScript
```javascript
var elementServiceSystemLink = document.getElementById("service_systemlink")
// note that we are setting an attribute of the HTML element, and not the Service_SystemJink object itself (which we would access by calling .getService() on elementServiceSystemLink)
elementServiceSystemLink.setAttribute("apikey", "your_API_key")
```

## Method 3: On the Page
The third and final way to initialize your Service_SystemLink is done on the webpage itself rather than in code. As with the SPIKE Service, the `<service-systemlink>` HTML tag puts a square icon on the page, with a red or green circle indicating whether or not the System Link has been initialized. If you click on the icon while the circle is red, the page will prompt you for an API Key which you can manually input in order to connect.

## Initialiing the HTML Object
Once your values are set, you have to initialize the HTML `service-systemlink` element (which is, again, different from the Service_SystemlLink object accessed by calling `getService()` on said HTML element) with either the `init()` function, e.g.

```javascript
var elementServiceSystemLink = document.getElementById("service_systemlink")

// code for setting API Key goes here

elementServiceSystemLink.init()
```
or, if using method 3, by clicking the System Link icon a second time.

Regardless of which way you choose, the end result is the same: you have now connected your local webpage to the cloud via a Service_SystemLink object, which you can then use to send and receive data (more on that in the next few tutorials).
# ServiceDock for SPIKE Prime

## Overview
ServiceDock is a Javascript framework that allows incorporation of LEGO SPIKE Prime and third party services in interactive web pages. Have various web services at the tip of your fingertips and speed up your prototyping process with ServiceDock's intuitive visual interface and API. 

Users can interact with your dynamic webpage by clicking on the ServiceDock icons to activate various Services. 

![Demonstration](servicedockDemo.gif)

*Geolocation icon attributed to Freepik

## Latest Version
1.0.0

## Framework 

To use ServiceDock, you will need to import the framework from a CDN as shown. 

```html
<head>
    <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface@1.0/cdn/ServiceDock.min.js"></script>
    <!-- ServiceDock -->
    <div id = "servicedock" style = "float:left;">
        <!--Airtable Service -->
        <service-airtable id = "service_airtable"></service-airtable>
        <!-- SystemLink Cloud Service -->
        <service-systemlink id = "service_systemlink"></service-systemlink>
        <!-- SPIKE Service -->
        <service-spike id = "service_spike"></service-spike>
        <!-- Etc. -->
    </div>
</head>
```

Please refer to the documentation and the tutorials to get started with using ServiceDock!

## Development
ServiceDock is still a work in progress. If you encounter any difficulties, bugs, or questions, please submit an issue at our [Github!](https://github.com/tuftsceeo/SPIKE-Web-Interface)
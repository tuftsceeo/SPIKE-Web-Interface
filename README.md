# ServiceDock for SPIKE Prime

> A frontend Javascript framework for building web interfaces that combine SPIKE Prime with third party services

Note: access to this GitHub repository requires signing a LEGO Education NDA. If you haven't signed a LEGO Education NDA, please do not proceed further and immediately contact Ethan Danahy (ethan.danahy@tufts.edu).

## Development
1)  Install this repository in a directory
2) Get [MAMP](https://www.mamp.info)
3)  Set root directory to server folder, in which index.html will be the main portal page
- Use "API Documentation" for documented ServiceDock API

## Tutorial
- [ServiceDock setup](#ServiceDock)
- [Usage](#Usage)

## ServiceDock
Include the Services you want to use. In this example, the ServiceDock will only support SPIKE Prime and System Link cloud service
```html
<html>
    <head>
        <script src="./modules/ServiceDock.js"></script>
    </head>
    <!-- include the Services to use -->
    <body>
        <div id="servicedock" style="float:left;">
            <!-- this style must be kept for normal rendering-->
            <service-systemlink id="service_systemlink"></service-systemlink>
            <service-spike id="service_spike"></service-spike>
        </div>
    </body>
```

## Usage

## Service Objects
Every Service object can be retrieved from its corresponding ServiceDock HTML element with document.getElementById("service ID").getService().

```html
<!-- Use the Services with Javascript -->
<script>

    var mySPIKE = document.getElementById("service_spike").getService(); // a SPIKE object
    
    var mySL = document.getElementById("service_systemlink").getService(); // SystemLink cloud object
```


These objects are initialized when their respective ServiceDock buttons are activated on the web page.

You can use object.executeAfterInit() to set a function to run after a Service is activated, or use object.isActive() to check if the Service is already activated.

```js
    /* execute following function when SystemLink is initialized */
    mySL.executeAfterInit( function () {

        var messageToDisplay = await mySL.getTagValue("message"); // retrieve "message" tag from cloud

        // execute only when SPIKE object is initialized
        if ( mySPIKE.isActive() ) {

            var hub = new mySPIKE.PrimeHub(); // PrimeHub object

            hub.light_matrix.write(messageToDisplay); // display message on Prime hub
        }
    })
</script>
```

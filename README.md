# ServiceDock for SPIKE Prime

> A frontend Javascript framework for building web interfaces that combine SPIKE Prime with third party services

Note: access to this GitHub repository requires signing a LEGO Education NDA. If you haven't signed a LEGO Education NDA, please do not proceed further and immediately contact Ethan Danahy (ethan.danahy@tufts.edu).

## Example Usage
```html
<html>
    <!-- ServiceDock -->
    <!-- include the Services to use -->
    <head>
        <script src="./modules/ServiceDock_SystemLink.js"></script>
        <script src="./modules/ServiceDock_SPIKE.js"></script>
        <script src="./modules/ServiceDock_GeoLocation.js"></script>
        <script src="./modules/ServiceDock_Gmail.js"></script>
    </head>
    <!-- ServiceDock setup -->
    <body>
        <div id="servicedock" style="float:left;">
            <!-- this style must be kept for normal rendering-->
            <service-systemlink id="service_systemlink"></service-systemlink>
            <service-spike id="service_spike"></service-spike>
            <service-geolocation id="service_geo"></service-geolocation>
            <service-gmail id="service_gmail"></service-gmail>
        </div>
    </body>

    <!-- Use the Services with Javascript -->
    <script>

        var mySPIKE = document.getElementById("service_spike").getService(); // a SPIKE object
        
        var mySL = document.getElementById("service_systemlink").getService(); // SystemLink cloud object

        /* execute following function when SystemLink is initialized */
        mySL.executeAfterInit( function () {

            var messageToDisplay = await mySL.getTagValue("message"); // retrieve "message" tag from cloud

            // execute only when SPIKE object is initialized
            if ( mySPIKE.isActive() ) {

                var hub = new mySPIKE.PrimeHub(); // PrimeHub object

                hub.light_matrix.write(messageToDisplay); // display message on screen
            }
        })

    </script>
</html>
```

## Table of Contents
- [Installation](#installation)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Tests](#tests)
- [FAQ](#faq)
- [Support](#support)
- [Team](#team)
- [License](#license)

## Installation
- TBD

## Documentation
> [documentation files](https://github.com/tuftsceeo/SPIKE-Web-Interface/tree/master/documentation)

## Contributing

## Tests

## FAQ

## Support

## Team

## License
## SPIKE Service

ServiceDock SPIKE allows you to connect your LEGO® SPIKE™ Prime to your webpage via a webserial connection. 

## Dependencies

The webserial API is only supported on Google Chrome. **Visitors that wish to connect their SPIKE Prime to your web page must ensure that the following requirements are fulfilled**: 

To use the SPIKE™ Prime hardware, you must enable the **WebSerial API** in your browser. To do so, please make sure:

1. You are using the [Google Chrome browser](https://www.google.com/chrome/).
2. The following chrome flags are enabled on chrome://flags.
Mac OSX user? #enable-experimental-web-platform-features

Windows user? #enable-experimental-web-platform-features AND #new-usb-backend

To enable these flags:

1. In your Chrome Browser URL, visit chrome://flags
2. Set the your required flags to "Enabled" via dropdown
3. Relaunch the browser to have changes take effect

When using SPIKE Service, make sure that your SPIKE Prime is connected (via USB or Bluetooth) to your computer and *you don't have any other applications or browser windows connected to your SPIKE Prime.*

#enable-experimental-web-platform-features

![ExperimentalWebPlatformFeatures](enableflag.png)

#new-usb-backend

![NewUSBBackend](enableflagwindows.png)
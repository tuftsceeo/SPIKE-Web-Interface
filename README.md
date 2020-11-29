# ServiceDock for SPIKE Prime

## A frontend Javascript framework for building web interfaces that combine SPIKE Prime with third party services

## Overview

ServiceDock allows you to easily integrate your LEGO SPIKE Prime into interactive web pages. 
![Demonstration](./jsdocTemplate/images/servicedockDemo.gif)

## Development

### Setup
1) Install this repository in a directory
2) Get [MAMP](https://www.mamp.info)
3)  Set root directory to server folder, in which index.html will be the main portal page of all usage examples of Service Dock
4) You will need npm (node) to easily develop on ServiceDock. To install needed packages, run the following in the directory where package.json resides
```npm install```

### Developing on Service Dock
Develop in the ```ServiceDock_```files in ```server/examples/modules```. Contributions made to these files DO NOT automatically go into production. 

### Testing
Unit test new contributions on ```server/examples/servicedock_unitTesting.html```

### Production
1.  After you have tested your contributions, push them to the CDN by running the following command in the root directory and pushing the commit to the master branch

```npm run combine```


2) Update the API documentation with the following and push to master as well

```npm run builddocs```
const http = require('http');
const express = require('express');
const request = require('request');
const fs = require('fs');
const path = require('path');

const app = express();

const hostname = '127.0.0.1';
const port = 3000;


console.log(path.parse(__filename));


//route to index file
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
})

//route to libraries

app.get('/UJSONRPClib.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/libraries/UJSONRPClib.js'));
})

app.get('/SLajaxlib.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/libraries/SLajaxlib.js'));
})

app.get('/hoverscript_jquery.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/libraries/hoverscript_jquery.js'));
})

//link examples

app.get('/cloudmessageexample.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/examples/cloudmessageexample.html'));
})

app.get('/pong.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/examples/pong.html'));
})

app.get('/servicedockexample.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/examples/servicedockexample.html'));
})


//link modules

app.get('/navbar.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/navbar.html'));
})

app.get('/UJSON_interface.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/UJSON_interface.html'));
})

app.get('/syslink_interface.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/syslink_interface.html'));
})

app.get('/sd_syslink_interface.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/sd_syslink_interface.html'));
})

app.get('/UJSONRPC_send.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/UJSONRPC_send.html'));
})

app.get('/servicedock.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/servicedock.html'));
})

app.get('/grapher.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/grapher.html'));
})

app.get('/SL_UJSONRPC.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/SL_UJSONRPC.html'));
})

//link scripts
app.get('/SL_UI_script.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/scripts/SL_UI_script.js'));
})

app.get('/UJSON_UI_script.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/scripts/UJSON_UI_script.js'));
})


//open the server

app.listen(port, hostname, () => {
	console.log(`Server listening on 3000`)
})

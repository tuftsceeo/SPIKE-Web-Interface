/*
Project Name: SPIKE Prime Web Interface
File name: app.js
Author: Jeremy Jung
Date: 7/7/20
Description: point jquery loads to correct html files
Credits/inspirations:
History: 
    Created by Jeremy on 6/17/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)

Usage:
node app.js in the server folder to start server
*/

const express = require('express');
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

app.get('/servicedock_index.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/examples/servicedock_index.html'));
})

app.get('/servicedock_pong.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/examples/servicedock_pong.html'));
})

app.get('/pong_copy.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/examples/pong_copy.html'));
})
//link modules

app.get('/navbar.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/navbar.html'));
})

app.get('/UJSON_interface.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/UJSON_interface.html'));
})

app.get('/main_syslink_interface.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/main_syslink_interface.html'));
})

app.get('/SL_interface.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/SL_interface.html'));
})

app.get('/UJSONRPC_send.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/UJSONRPC_send.html'));
})

app.get('/servicedock.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/servicedock.html'));
})

app.get('/graph_interface.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/graph_interface.html'));
})

app.get('/SLxUJSONRPC_interface.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/modules/SLxUJSONRPC_interface.html'));
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

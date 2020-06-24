const http = require('http');
const express = require('express');
const request = require('request');
const fs = require('fs');
const path = require('path');

const app = express();

const hostname = '127.0.0.1';
const port = 3000;


console.log(path.parse(__filename));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/syslinkex.html'));
})

app.get('/style.css', function (req, res) {
    res.sendFile(path.join(__dirname + '/style.css'));
})

app.get('/HTTPRequests.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/HTTPRequests.js'));
})

app.get('/UJSONRPC.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/UJSONRPC.js'));
})

app.get('/SLajaxlib.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/SLajaxlib.js'));
})


app.listen(port, hostname, () => {
	console.log(`Server listening on 3000`)
})

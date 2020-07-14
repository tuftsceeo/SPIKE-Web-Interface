/*
Project Name: SPIKE Prime Web Interface
File name: corsproxy.js
Author: Jeremy Jung
Date: 6/17/20
Description: to handle PUT requests for systemlink cloud 
Credits/inspirations:
History: 
    Created by Jeremy on 6/17/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));
    next();
});

app.get('/', function (req, res) {
    request(
        {
            
        }
    )
})

//WORKS!!! Changes the current value of name tag successfully.
app.get('/name', (req, res) => {
    request(
      { url: 'https://api.systemlinkcloud.com/nitag/v2/tags/name/values/current',
      method: "PUT",
      headers: {
          "Content-type": "application/json",
          "x-ni-api-key": "daciN5xlHb-J_eABvDQPRIYt4jrKmbUbCl-Zc2vta7"
      },
      json: {value: {value: "ethan", type: "STRING"}},
        },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
            console.log("ERROR HERE BOI", body.error)
            return res.status(500).json({ type: 'error', message: body.error.message});
        }
        res.send(body)
      }
    )
})


app.get('/goodbye', (req, res) => {
request(
    { url: 'https://api.systemlinkcloud.com/nitag/v2/tags/message/values/current',
    method: "PUT",
    headers: {
        "Content-type": "application/json",
        "x-ni-api-key": "daciN5xlHb-J_eABvDQPRIYt4jrKmbUbCl-Zc2vta7"
    },
    json: {value: {value: "GOODBYE", type: "STRING"}},
    },
    (error, response, body) => {
    if (error || response.statusCode !== 200) {
        console.log("ERROR HERE BOI", body.error)
        return res.status(500).json({ type: 'error', message: body.error.message});
    }
    res.send(body)
    }
)
})

app.get('/hello', (req, res) => {
    request(
        { url: 'https://api.systemlinkcloud.com/nitag/v2/tags/message/values/current',
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            "x-ni-api-key": "daciN5xlHb-J_eABvDQPRIYt4jrKmbUbCl-Zc2vta7"
        },
        json: {value: {value: "HELLO", type: "STRING"}},
        },
        (error, response, body) => {
        if (error || response.statusCode !== 200) {
            console.log("ERROR HERE BOI", body.error)
            return res.status(500).json({ type: 'error', message: body.error.message});
        }
        res.send(body)
        }
    )
    })


const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', () => console.log(`listening on ${PORT}`));


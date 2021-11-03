// create a new express server 
const express = require('express');
const app = express();
const path = require('path');
const WebSocket = require('ws')
var macaddress = require('macaddress');

const port = process.env.PORT || 8080;


macaddress.one(function (err, mac) {
    console.log("Mac address for this host: %s", mac);
});

app.get('/macid' , function (req, res) {
    macaddress.one(function (err, mac) {
        res.send(mac);
    });
});

app.get('/', function (req, res) {
    var options = {
        root: path.join(__dirname)
    };

    var fileName = 'index.html';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', function (ws) {
    ws.on('message', function incoming(data) {
        console.log('received: %s', data);
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
                client.send(JSON.stringify(data.toString()));
            }
        });
    });
})

app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);
});
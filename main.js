let port = 8787;

const express = require('express');
const app = express();
const yaml = require('js-yaml');
const path = require('path');

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');

let state = null;
let doc = null;
setInterval(() => {
  let newState = fs.readFileSync('./state.yaml', 'utf8');
  if(newState !== state) {
    state = newState;

    doc = yaml.load(state);
    io.emit('broadcast', doc);
    console.log('broadcasted');
  }
}, 10);

io.on('connect', (client) => {
  if(doc) {
    io.emit('broadcast', doc);
    console.log('broadcasted');
  }
});

app.use(express.static('.'));

server.listen(port, () => console.log(`Example app listening on port ${port}!`));
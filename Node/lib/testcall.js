var creds = require('./apikey.js')
var on =require("./onshape.js")
var add=require("./addition.js")
var app=require("./app.js")
var b=new on(creds);
/*
var buildNonce = function () {
  var chars = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0',
    '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ];
  var nonce = '';
  for (var i = 0; i < 25; i++) {
    nonce += chars[Math.floor(Math.random()*chars.length)];
  }
  return nonce;
}*/
console.log(creds.baseUrl)
//var a=b.get()
aaa=app.getDocuments({}, function (data) {
                var response = JSON.parse(data);
                console.log('Fetched ' + response.items.length + ' documents.');
             done();});
//console.lop(aaa)
console.log(app)
//var a=add.aaa()
//console.log(a)
// creds should look like:
// {
// 	'baseUrl': 'https://cad.onshape.com',
// 	'accessKey': 'accesskey',
// 	'secretKey': 'secretkey'
// }

var r=require('./app')

function client (creds) {
    return r(creds);

}

module.exports = client;

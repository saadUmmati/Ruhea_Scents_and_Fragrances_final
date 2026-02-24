const http = require('http');

http.get('http://localhost:3000', (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
}).on('error', (e) => {
    console.error(e);
});

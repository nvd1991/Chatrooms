const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const cache = {};

const server = http.createServer((req, res) => {
    let filePath = false;
    if(req.url === '/'){
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + req.url;
    }
    const absPath = './' + filePath;
    serveStatic(res, cache, absPath);
});
server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});

function send404(response) {
    response.writeHead(
        404,
        'Page not found',
        { 'Content-type': 'text/plain' }
    );
    response.write('404: Resource not found');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(
        200,
        'OK',
        { 'Content-type': mime.getType(path.basename(filePath)) }
    );
    response.end(fileContents);
}

function serveStatic(response, cache, absPath){
    if(cache[absPath]){
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, (exists) => {
            if(exists){
                fs.readFile(absPath, (err, data) => {
                    if(err){
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                })
            } else{
                send404(response);
            }
        });
    }
}
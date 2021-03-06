/*
 * Primary file for Homework Assignment 1
 *
 */

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// Instantiate the HTTP server
var httpServer = http.createServer(function(req, res){
    unifiedServer(req,res);    
});

// Start the HTTP server
httpServer.listen(3000, function(){
    console.log("The server is listening on port 3000");
});


// All the server logic for the http server
var unifiedServer = function(req,res) {

    // Get the URL and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path from the URL
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();

    // Get the headers as an object
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);
    });
    req.on('end',function(){
        buffer += decoder.end();

        // Choose the handler this request should go to. If one is not found, choose the notFound handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        // Route the request to the handler specified in the router
        chosenHandler(data,function(statusCode,payload){
            // Use the statuscode called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the response
            console.log('Returning this response: ', statusCode, ' Payload: ',payloadString);

        });

    });
};

// Define the handlers
var handlers = {};

// Hello Handler
handlers.hello = function(data,callback){
    callback(200,{message : 'Hello World - The first NodeJS Master Class Assignment is done!'});
};

// Not Found handler
handlers.notFound = function(data,callback){
    //Callback a http status code
    callback(404);
};

// Define a request router
var router = {
    'hello' : handlers.hello
};

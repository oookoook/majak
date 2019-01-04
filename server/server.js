var http = require('http');
var url = require('url');
var static = require('node-static');

var questions = require('./questions.js');
var morse = require('./morse.js');
var config = require('./config/server.json');

var file = new static.Server(config.static, { cache: 600 });

http.createServer(function (req, res) {
    
    var u = url.parse(req.url, true);

    if(u.path.indexOf('heartbeat') > -1) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        status = { status: true, errors: 0, timestamp: new Date() };
        res.write(JSON.stringify(status));
        res.end();
    } else if(u.path.indexOf('question') > -1) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        var q = questions.getQuestion(u.query)
        res.write(JSON.stringify(q));
        res.end();
        return;
    } else {
        console.log('Static');
        file.serve(req, res);
    }

}).listen(config.port);

morse.start(config.gpio);

// handing the LED unexport
// https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits

function exitHandler(options, err) {
    if (options.cleanup) {
        console.log('Calling morse.stop()...');
        morse.stop();
    }
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

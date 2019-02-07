const couchdbProxy = require("couchdb-auth-proxy");
const config = require('./config/config');
const http = require('http');
const authService = require("./services/openmrs-auth-service");
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
const server = http.createServer(couchdbProxy((req) => {
    const auth = req.headers['authorization']; 
    return authService.authenticate(auth).then((user) => {
        if (user) {
            return {
                name: user.username,
                roles: config.couch_db_user_roles
            }
        }
        return null;
    });
},{
    target: config.couchdb_url,
    secret: config.couch_proxy_auth_secret
}));

/**
* Listen on provided port, on all network interfaces.
*/

server.listen('5000');
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
import express  from 'express';
import config from './models/configLoader';
import {CreateWebSocket} from './models/socket';
import {createServer} from 'http';

// import routes
import controlPage from './routes/control';

// Config server
const app = express();

// Setting up routes
app.use(controlPage);

// Setting up web socket
const httpServer = createServer(app);
CreateWebSocket(httpServer);


// Start the servers
httpServer.listen(config.SERVER_PORT, () => console.log(`Control server listening on port: ${config.SERVER_PORT}`));
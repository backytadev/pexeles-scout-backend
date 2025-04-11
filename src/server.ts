import http from 'node:http';
import app from '@/config/express.config';
import { setupSocket } from '@/config/socket.config';

//* Create server with express
const server = http.createServer(app);

//* Config Sockets on same server
setupSocket(server);

export default server;

import express from 'express';
import http from 'http';

import WebSocketServer from './websocket';
import logger from './logging';
import league from './league';
import { AddressInfo } from 'net';

const log = logger('main');

const app = express();

const server = http.createServer(app);
const wsServer = new WebSocketServer(server);
wsServer.startHeartbeat();

log.info('  _          _       ____  ___   ____    _   _ ___ ');
log.info(' | |    ___ | |     |  _ \\( _ ) | __ )  | | | |_ _|');
log.info(' | |   / _ \\| |     | |_) / _ \\/\\  _ \\  | | | || | ');
log.info(' | |__| (_) | |___  |  __/ (_>  < |_) | | |_| || | ');
log.info(' |_____\\___/|_____| |_|   \\___/\\/____/   \\___/|___|');
log.info('                                                   ');

league.init();

server.listen(process.env.PORT || 8999, () => {
  if (server.address() === null) {
    return log.error('Failed to start server.');
  }
  const serverAddress = server.address() as AddressInfo;
  return log.info(`Server started on ${serverAddress}`);
});

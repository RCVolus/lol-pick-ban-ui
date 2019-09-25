import express from 'express';
import http from 'http';

import WebSocket from './websocket';
import logger from './logging';
const log = logger('main');
import league from './league';

const app = express();

const server = http.createServer(app);
new WebSocket(server);

log.info('  _          _       ____  ___   ____    _   _ ___ ');
log.info(' | |    ___ | |     |  _ \\( _ ) | __ )  | | | |_ _|');
log.info(' | |   / _ \\| |     | |_) / _ \\/\\  _ \\  | | | || | ');
log.info(' | |__| (_) | |___  |  __/ (_>  < |_) | | |_| || | ');
log.info(' |_____\\___/|_____| |_|   \\___/\\/____/   \\___/|___|');
log.info('                                                   ');

league.init();

server.listen(process.env.PORT || 8999, () => {
    log.info(`Server started on http://localhost:${server.address().port}`);
});
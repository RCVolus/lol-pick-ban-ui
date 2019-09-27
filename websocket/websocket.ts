import ws from 'ws';
import fs from 'fs';

import logger from '../logging';
const log = logger('websocket');
import state from '../state';
import lolcsui from "../types";
import StateData = lolcsui.dto.StateData;
import {IncomingMessage} from "http";


class WebSocket {
    server: ws.Server;
    clients: Array<any> = [];
    exampleClients: Array<any> = [];
    heartbeatInterval: NodeJS.Timeout;

    constructor(server: any) {
        this.server = new ws.Server({ server });

        this.sendHeartbeat = this.sendHeartbeat.bind(this);

        // Event listeners
        this.server.on('connection', (ws, request) => this.handleConnection(ws, request));
        state.on('stateUpdate', (state: any) => this.updateState(state));

        this.heartbeatInterval = setInterval(this.sendHeartbeat, 1000);
    }

    handleConnection(ws: any, request: IncomingMessage) {
        if (request.url && request.url === '/example') {
            log.info('New example client connected!');
            this.exampleClients.push(ws);
        } else {
            this.clients.push(ws);
            ws.send(JSON.stringify(state.data));
        }
    }

    updateState(newState: StateData) {
        log.debug(`New state: ${JSON.stringify(newState)}`);

        this.clients.forEach((client: any) => {
            client.send(JSON.stringify(newState));
        });
    }

    sendHeartbeat() {
        this.clients.forEach((client: any) => {
            client.send(JSON.stringify({'heartbeat': true}));
        });

        // example clients do not receive a heartbeat, they receive the file content instead
        const exampleData = fs.readFileSync('./example.json', 'utf8');
        this.exampleClients.forEach((client: any) => {
            client.send(JSON.stringify(JSON.parse(exampleData)));
        });
    }
}

export default WebSocket;

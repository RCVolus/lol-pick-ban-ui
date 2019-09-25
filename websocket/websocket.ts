import ws from 'ws';

import logger from '../logging';
const log = logger('websocket');
import state from '../state';
import lolcsui from "../types";
import StateData = lolcsui.dto.StateData;


class WebSocket {
    server: ws.Server;
    clients: any;
    heartbeatInterval: NodeJS.Timeout;

    constructor(server: any) {
        this.server = new ws.Server({ server });
        this.clients = [];

        this.sendHeartbeat = this.sendHeartbeat.bind(this);

        // Event listeners
        this.server.on('connection', ws => this.handleConnection(ws));
        state.on('stateUpdate', (state: any) => this.updateState(state));

        this.heartbeatInterval = setInterval(this.sendHeartbeat, 1000);
    }

    handleConnection(ws: any) {
        this.clients.push(ws);
        ws.send(JSON.stringify(state.data));
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
    }
}

export default WebSocket;

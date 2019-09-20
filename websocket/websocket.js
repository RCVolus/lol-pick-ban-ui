import ws from 'ws';

import logger from '../logging';
const log = logger('websocket');
import globalState from '../state';

class WebSocket {
    constructor(server) {
        this.server = new ws.Server({ server });
        this.clients = [];
        this.state = globalState.data;

        this.sendHeartbeat = this.sendHeartbeat.bind(this);

        // Event listeners
        this.server.on('connection', ws => this.handleConnection(ws));
        globalState.on('stateUpdate', state => this.updateState(state));

        this.heartbeatInterval = setInterval(this.sendHeartbeat, 1000);
    }

    handleConnection(ws) {
        this.clients.push(ws);
        ws.send(JSON.stringify(this.state));
    }

    updateState(newState) {
        log.debug(`New state: ${JSON.stringify(newState)}`);
        this.state = newState;

        this.clients.forEach(client => {
            client.send(JSON.stringify(this.state));
        })
    }

    sendHeartbeat() {
        this.clients.forEach(client => {
            client.send(JSON.stringify({'heartbeat': true}));
        })
    }
}

export default WebSocket;
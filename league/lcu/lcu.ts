import LCUConnector from 'lcu-connector';
import needle from 'needle';
import logger from '../../logging';
import state from '../../state';
import Timeout = NodeJS.Timeout;
const log = logger('lcu');

class LCU {
    connector = new LCUConnector('');
    connectionInfo!: ConnectionInfo;
    updateInterval!: Timeout;

    constructor() {
        this.onLeagueConnected = this.onLeagueConnected.bind(this);
        this.onLeagueDisconnected = this.onLeagueDisconnected.bind(this);
        this.updateFromLCU = this.updateFromLCU.bind(this);

        this.connector.on('connect', this.onLeagueConnected);
        this.connector.on('disconnect', this.onLeagueDisconnected);
        this.connector.start();
        log.info('Waiting for LeagueClient to connect');
    }

    async updateFromLCU() {
        const response = await needle('get', `https://127.0.0.1:${this.connectionInfo.port}/lol-champ-select/v1/session`, {
            json: true,
            rejectUnauthorized: false,
            username: this.connectionInfo.username,
            password: this.connectionInfo.password
        });
        if (response.statusCode === 404) {
            if (state.data.champSelectActive) {
                state.champselect.end();
            }
        } else {
            if (!state.data.champSelectActive) {
                state.champselect.start();
            }

            state.champselect.updateNewSession(response.body);
        }
    }

    onLeagueConnected(e: ConnectionInfo) {
        log.info('LeagueClient connected');
        this.connectionInfo = e;
        state.data.leagueConnected = true;
        state.triggerUpdate();

        this.updateInterval = setInterval(this.updateFromLCU, 200);
    }

    onLeagueDisconnected() {
        log.info('LeagueClient disconnected');
        state.data.leagueConnected = false;
        state.triggerUpdate();

        clearInterval(this.updateInterval);
    }
}

class ConnectionInfo {
    port!: number;
    username!: String;
    password!: String;
}

export default LCU;
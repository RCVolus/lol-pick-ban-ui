import LCUConnector from 'lcu-connector';
import needle from 'needle';
import logger from '../../logging';
import state from '../../state';
const log = logger('lcu');

class LCU {
    constructor() {
        this.connector = new LCUConnector();

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
            state.data.champSelectActive = false;
            state.triggerUpdate()
        } else {
            state.data.champSelectActive = true;

            console.log(response.body);

            state.triggerUpdate()
        }
    }

    onLeagueConnected(e) {
        log.info('LeagueClient connected');
        this.connectionInfo = e;
        state.data.leagueConnected = true;
        state.triggerUpdate();

        this.updateInterval = setInterval(this.updateFromLCU, 2000);
    }

    onLeagueDisconnected() {
        log.info('LeagueClient disconnected');
        state.data.leagueConnected = false;
        state.triggerUpdate();

        clearInterval(this.updateInterval);
    }
}

export default LCU;
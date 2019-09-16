import LCUConnector from 'lcu-connector';
import logger from '../../logging';
import state from '../../state';
const log = logger('lcu');

class LCU {
    constructor() {
        this.connector = new LCUConnector();

        this.connector.on('connect', this.onLeagueConnected);
        this.connector.on('disconnect', this.onLeagueDisconnected);
        this.connector.start();
        log.info('Waiting for LeagueClient to connect');
    }

    onLeagueConnected(e) {
        log.info('LeagueClient connected');
        state.data.leagueConnected = true;
        state.triggerUpdate();
    }

    onLeagueDisconnected() {
        log.info('LeagueClient disconnected');
        state.data.leagueConnected = false;
        state.triggerUpdate();
    }
}

export default LCU;
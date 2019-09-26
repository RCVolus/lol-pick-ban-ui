import LCUConnector from 'lcu-connector';
import needle from 'needle';
import logger from '../../logging';
import state from '../../state';
import Timeout = NodeJS.Timeout;
import lolcsui from "../../types";
import Session = lolcsui.lcu.Session;
import Cell = lolcsui.lcu.Cell;
const log = logger('lcu');

class LCU {
    connector = new LCUConnector('');
    connectionInfo!: ConnectionInfo;
    updateInterval!: Timeout;
    requestConfig = {
        json: true,
        rejectUnauthorized: false,
        username: '',
        password: ''
    };
    summoners: Array<any> = [];

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
        const response = await needle('get', `https://127.0.0.1:${this.connectionInfo.port}/lol-champ-select/v1/session`, this.requestConfig);
        if (response.statusCode === 404) {
            if (state.data.champSelectActive) {
                state.champselect.end();
            }
        } else {
            if (!state.data.champSelectActive) {
                state.champselect.start();

                // Fetch players
                this.fetchPlayers(response.body);
            }

            state.champselect.updateNewSession(response.body);
        }
    }

    fetchPlayers(session: Session) {
        const blueTeam = session.myTeam;
        const redTeam = session.theirTeam;

        const fetchPlayersFromTeam = (team: Array<Cell>) => {
            team.forEach(async cell => {
                const summoner = (await needle('get', `https://127.0.0.1:${this.connectionInfo.port}/lol-summoner/v1/summoners/${cell.summonerId}`, this.requestConfig)).body;
                this.summoners.push(summoner);
            });
        };

        fetchPlayersFromTeam(blueTeam);
        fetchPlayersFromTeam(redTeam);
    }

    getSummonerById(id: number) {
        return this.summoners.filter(summoner => summoner.summonerId === id)[0];
    }

    onLeagueConnected(e: ConnectionInfo) {
        log.info('LeagueClient connected');
        this.connectionInfo = e;
        this.requestConfig.username = this.connectionInfo.username;
        this.requestConfig.password = this.connectionInfo.password;
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
    username!: string;
    password!: string;
}

export default LCU;

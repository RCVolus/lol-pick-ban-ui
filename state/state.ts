import EventEmitter from 'events';
import ChampSelect from './champselect';
import logger from '../logging';
import lolcsui from "../types";
import StateData = lolcsui.dto.StateData;
import Team = lolcsui.dto.Team;
const log = logger('state');

class State extends EventEmitter {
    champselect: ChampSelect;
    data: StateData;

    constructor() {
        super();

        this.champselect = new ChampSelect();
        this.data = new StateData();

        this.champselect.on('started', () => {
            this.data.champSelectActive = true;
            this.triggerUpdate();
        });

        this.champselect.on('ended', () => {
            this.data.blueTeam = new Team();
            this.data.redTeam = new Team();
            this.data.champSelectActive = false;
            this.triggerUpdate();
        });

        this.champselect.on('newState', (state: any) => {
            this.data.blueTeam = state.blueTeam;
            this.data.redTeam = state.redTeam;
            this.triggerUpdate();
        });
    }

    triggerUpdate() {
        this.emit('stateUpdate', this.data)
    }

    getVersionCDN(): string {
        return this.data.meta.cdn + `/${this.data.meta.version.champion}`;
    }

    getCDN(): string {
        return this.data.meta.cdn;
    }
}

export default new State();

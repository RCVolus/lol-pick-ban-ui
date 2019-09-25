import EventEmitter from 'events';

import Team from './data/team';
import Meta from './data/meta';
import ChampSelect from './champselect/champselect';

import logger from '../logging';
const log = logger('state');

class State extends EventEmitter {
    champselect: ChampSelect;
    data: StateData;

    constructor() {
        super();

        this.champselect = new ChampSelect();

        const initialData = {
            leagueConnected: false,
            champSelectActive: false,
            blueTeam: new Team(),
            redTeam: new Team(),

            meta: new Meta()
        };

        this.data = Object.assign({}, initialData);

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
}

export default new State();
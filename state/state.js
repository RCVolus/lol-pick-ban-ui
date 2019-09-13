import EventEmitter from 'events';

import Team from './team';
import Meta from './meta';

class State extends EventEmitter {
    constructor() {
        super();

        this.data = {
            leagueConnected: false,
            blueTeam: new Team(),
            redTeam: new Team(),

            meta: new Meta()
        }
    }

    triggerUpdate() {
        this.emit('stateUpdate', this.data)
    }
}

export default new State();
import EventEmitter from 'events';

import logger from '../../logging';
import converter from "../converter";
const log = logger('champselect');

class ChampSelect extends EventEmitter {
    constructor() {
        super();

        this.lcuSession = {
            actions: [], // flattened
            blueTeam: [], // Todo verify this in spectator mode (in not spectator mode it's called myTeam and theirTeam)
            redTeam: []
        };
    }

    start() {
        log.info('Started!');
        this.emit('started')
    }

    end() {
        log.info('Ended!');
        this.emit('ended');
    }

    updateNewSession(session) {
        const newState = converter(session);

        this.emit('newState', newState);
    }

    updateActions(actions) {
        const flattenedActions = [].concat.apply([], actions);

        if (flattenedActions.length > this.lcuSession.actions.length) {
            for (let i = this.lcuSession.actions.length; i < flattenedActions.length; i++) {
                const action = flattenedActions[i];
                log.info(`New action: ${JSON.stringify(action)}`);

                this.emitChangedOrNewAction(action, true);
            }
        } else {
            // Check if last action changed
            if (JSON.stringify(this.lcuSession.actions[this.lcuSession.actions.length - 1]) !== JSON.stringify(flattenedActions[flattenedActions.length - 1])) {
                const action = flattenedActions[flattenedActions.length - 1];
                log.info(`Action changed: ${JSON.stringify(action)}`);

                this.emitChangedOrNewAction(action, false);
            }
        }

        this.lcuSession.actions = flattenedActions;
    }

    emitChangedOrNewAction(action, isNew) {
        const prefix = isNew ? 'new' : 'change';
        const team = action.actorCellId < 5 ? 'Blue' : 'Red';

        this.emit(`${prefix}Action`, action);

        if (action.type === 'ban') {
            this.emit(`${prefix}${team}Ban`, action);
        } else if (action.type === 'pick') {
            this.emit(`${prefix}${team}Pick`);
        }
    }
}

export default ChampSelect;
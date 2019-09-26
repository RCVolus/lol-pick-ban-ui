import EventEmitter from 'events';

import logger from '../logging';
import converter from './converter';
import lolcsui from '../types';
import Session = lolcsui.lcu.Session;
const log = logger('champselect');

class ChampSelect extends EventEmitter {
    start() {
        log.info('Started!');
        this.emit('started');
    }

    end() {
        log.info('Ended!');
        this.emit('ended');
    }

    updateNewSession(session: Session) {
        const newState = converter(session);
        this.emit('newState', newState);
    }
}

export default ChampSelect;
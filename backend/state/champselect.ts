import EventEmitter from 'events';

import logger from '../logging';
import converter from './converter';
import { Session } from '../types/lcu';

const log = logger('champselect');

class ChampSelect extends EventEmitter {
  start(): void {
    log.info('Started!');
    this.emit('started');
  }

  end(): void {
    log.info('Ended!');
    this.emit('ended');
  }

  updateNewSession(session: Session): void {
    const newState = converter(session);
    this.emit('newState', newState);
  }
}

export default ChampSelect;

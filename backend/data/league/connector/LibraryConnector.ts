import LCUConnector from 'lcu-connector';
import logger from '../../../logging';
import Connector, { ConnectorOptions, ConnectionInfo } from './Connector';
import { EventEmitter } from 'events';

const log = logger('LibraryConnector');

class LibraryConnectorOptions extends ConnectorOptions {}

export default class LibraryConnector extends EventEmitter
  implements Connector {
  options: LibraryConnectorOptions;

  libraryConnector: LCUConnector;

  constructor(options: LibraryConnectorOptions) {
    super();

    this.options = options;

    this.libraryConnector = new LCUConnector(this.options.leaguePath || '');

    this.libraryConnector.on('connect', (e: ConnectionInfo) =>
      this.emit('connect', e)
    );
    this.libraryConnector.on('disconnect', () => this.emit('disconnect'));

    log.debug('LibraryConnector initialized');
  }

  start() {
    this.libraryConnector.start();
    log.info('LibraryConnector started');
  }
}

import { EventEmitter } from 'events';
import cp from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import logger from '../../../logging';
import Connector, { ConnectorOptions, ConnectionInfo } from './Connector';

const log = logger('ExperimentalConnector');

class ExperimentalConnectorOptions extends ConnectorOptions {}

export default class ExperimentalConnector extends EventEmitter
  implements Connector {
  options: ExperimentalConnectorOptions;

  isConnected = false;

  constructor(options: ExperimentalConnectorOptions) {
    super();

    this.options = options;

    log.debug('ExperimentalConnector initialized');
    log.warn(
      'The experimental connector is another system used to find out how to talk to your local league client, in order to fetch real time information. It currently only' +
        ' supports windows, and will probably perform worse than the LibraryConnector. However, if you have no success with the LibraryConnector, you may also try this.'
    );
  }

  start() {
    log.info('ExperimentalConnector started');
    this.update();

    setInterval(() => this.update(), 5000)
  }

  update() {
    if (this.isConnected) {
      log.debug('Already connected, not checking.')
      return;
    }

    if (this.options.leaguePath) {
      const leaguePath = path.normalize(this.options.leaguePath)
      log.debug(`Using configured league path: ${leaguePath}`)
    } else {
      log.debug('Trying to detect league path automatically.')
    }

    const INSTALL_REGEX_WIN = /"--install-directory=(.*?)"/;
    const command = `WMIC PROCESS WHERE name='LeagueClientUx.exe' GET commandline`;

    cp.exec(command, async (err, stdout, stderr) => {
      if (err || !stdout || stderr) {
        log.debug(
          'Failed to find the league process. Is the LeagueClient running?', err
        );
        return;
      }

      const parts = stdout.match(INSTALL_REGEX_WIN) || [];
      const leaguePath = parts[1];
      log.debug('Found LeagueClient installation path: ' + leaguePath);

      // Read lockfile
      const lockfile = await fs.readFile(
        path.join(leaguePath, 'lockfile'),
        'utf8'
      );
      log.debug('Found lockfile: ' + lockfile);
      const splitted = lockfile.split(':');

      if (!this.isConnected) {
        this.isConnected = true;

        const connectionInfo: ConnectionInfo = {
          username: 'riot',
          port: parseInt(splitted[2], 10),
          password: splitted[3],
        };

        this.emit('connect', connectionInfo);
      }
    });
  }
}

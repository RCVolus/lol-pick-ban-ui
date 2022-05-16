import { EventEmitter } from 'events';
import cp from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import logger from '../../../logging';
import Connector, { ConnectorOptions, ConnectionInfo } from './Connector';
import { RequestOptions, Response } from 'league-connect';
import needle from 'needle';

const log = logger('ExperimentalConnector');

class ExperimentalConnectorOptions extends ConnectorOptions {}

export default class ExperimentalConnector extends EventEmitter
  implements Connector {
  options: ExperimentalConnectorOptions;
  connectionInfo?: ConnectionInfo

  isConnected = false;

  requestConfig = {
    json: true,
    rejectUnauthorized: false,
    username: '',
    password: '',
  };

  constructor(options: ExperimentalConnectorOptions) {
    super();

    this.options = options;

    log.debug('ExperimentalConnector initialized');
    log.warn(
      'The experimental connector is another system used to find out how to talk to your local league client, in order to fetch real time information. It currently only' +
        ' supports windows, and will probably perform worse than the LibraryConnector. However, if you have no success with the LibraryConnector, you may also try this.'
    );
  }

  start(): void {
    log.info('ExperimentalConnector started');
    this.update();

    setInterval(() => this.update(), 5000)
  }

  async request(args: RequestOptions<any>): Promise<Response<any> | undefined> {
    if (!this.connectionInfo) return
    return await needle(
      'get',
      `https://127.0.0.1:${this.connectionInfo.port}${args.url}`,
      this.requestConfig
    ) as unknown as Response<any>
  }

  update(): void {
    if (this.isConnected) {
      log.debug('Already connected, not checking.')
      return;
    }

    const readLockfile = async (leaguePath: string): Promise<void> => {
      // Read lockfile
      const lockFilePath = path.join(leaguePath, 'lockfile')
      if (!fs.existsSync(lockFilePath)) {
        log.info(`Failed to find lock file at ${lockFilePath}. Is the League Client running and the location correct?`)
        return
      }
      const lockfile = await fs.readFile(
        lockFilePath,
        'utf8'
      );
      log.debug('Found lockfile at: ' + lockFilePath);
      const splitted = lockfile.split(':');

      if (!this.isConnected) {
        this.isConnected = true;

        const connectionInfo: ConnectionInfo = {
          username: 'riot',
          port: parseInt(splitted[2], 10),
          password: splitted[3],
        };

        this.connectionInfo = connectionInfo

        this.requestConfig.password = splitted[3]
        this.requestConfig.username = 'riot'

        this.emit('connect', connectionInfo);
      }
    }

    if (this.options.leaguePath) {
      const leaguePath = path.normalize(this.options.leaguePath)
      log.debug(`Using configured league path: ${leaguePath}`)
      readLockfile(leaguePath)
    } else {
      log.debug('Trying to detect league path automatically.')

      const INSTALL_REGEX_WIN = /"--install-directory=(.*?)"/;
      const command = 'WMIC PROCESS WHERE name=\'LeagueClientUx.exe\' GET commandline';

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

        readLockfile(leaguePath)
      });
    }
  }
}

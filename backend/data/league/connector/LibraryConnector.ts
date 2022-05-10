import { authenticate, connect, LeagueClient, LeagueWebSocket, Credentials, request, RequestOptions, Response } from 'league-connect'
import logger from '../../../logging';
import Connector, { ConnectorOptions } from './Connector';
import { EventEmitter } from 'events';

const log = logger('LibraryConnector');

class LibraryConnectorOptions extends ConnectorOptions {}

export default class LibraryConnector extends EventEmitter
  implements Connector {
  options: LibraryConnectorOptions;

  leagueClient?: LeagueClient;
  credentials?: Credentials;
  ws?: LeagueWebSocket;

  constructor(options: LibraryConnectorOptions) {
    super();
    this.options = options;

    log.debug('LibraryConnector initialized');
  }

  async start() {

    try {
      const credentials = await authenticate()
      this.credentials = credentials
      this.credentials.password = credentials.password.replace('--app-port', '')

      this.ws = await connect(this.credentials);

      this.ws.onopen = () => {
        this.emit('connect', this.credentials)
        log.info('LibraryConnector started');
      }
  
      this.ws.onerror = e => {
        log.error(`LibraryConnector failed ${e}`);
        this.emit('disconnect')
      }

      this.leagueClient = new LeagueClient(this.credentials);
      this.leagueClient.start()
    } catch (error) {
      log.error(error)
    }

    this.leagueClient?.on('connect', (newCredentials) => {
      this.credentials = newCredentials
      this.credentials.password = newCredentials.password.replace('--app-port', '')
      this.emit('connect', this.credentials)
    })
    
    this.leagueClient?.on('disconnect', () => {
      this.credentials = undefined
      this.emit('disconnect')
    })
  }

  public async request (arg: RequestOptions): Promise<Response<any> | undefined> {
    if (!this.credentials) return

    try {
      const res = await request(arg, this.credentials)
      return res
    } catch (e) {
      log.error(e)
    }
  }
}

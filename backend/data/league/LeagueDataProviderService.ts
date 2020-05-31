import needle, { NeedleResponse } from 'needle';

import logger from '../../logging';
import { Session, Cell, Summoner } from '../../types/lcu';

import { CurrentState } from '../CurrentState';
import { EventEmitter } from 'events';
import DataProviderService from '../DataProviderService';
import Recorder from '../../recording/Recorder';
import GlobalContext from '../../GlobalContext';
import Connector, {
  ConnectionInfo,
  LibraryConnector,
  ExperimentalConnector,
} from './connector';
const log = logger('LCUDataProviderService');

class LeagueDataProviderService extends EventEmitter
  implements DataProviderService {
  connector: Connector;
  connectionInfo!: ConnectionInfo;
  recorder!: Recorder;

  requestConfig = {
    json: true,
    rejectUnauthorized: false,
    username: '',
    password: '',
  };

  summoners: Array<Summoner> = [];

  constructor() {
    super();

    if (GlobalContext.commandLine.experimentalConnector) {
      this.connector = new ExperimentalConnector({
        leaguePath: GlobalContext.commandLine.leaguePath,
      });
    } else {
      this.connector = new LibraryConnector({
        leaguePath: GlobalContext.commandLine.leaguePath,
      });
    }

    this.onLeagueConnected = this.onLeagueConnected.bind(this);
    this.onLeagueDisconnected = this.onLeagueDisconnected.bind(this);
    this.getCurrentData = this.getCurrentData.bind(this);

    if (GlobalContext.commandLine.record) {
      this.recorder = new Recorder(GlobalContext.commandLine.record);
      log.info('Recording to ' + GlobalContext.commandLine.record);
    }

    this.connector.on('connect', this.onLeagueConnected);
    this.connector.on('disconnect', this.onLeagueDisconnected);

    // TODO move this to the connector
    if (GlobalContext.commandLine.leaguePath === '') {
      log.info('Trying to detect league installation automatically.');
    } else {
      log.info(
        'Using manually configured league installation: ' +
          GlobalContext.commandLine.leaguePath
      );
    }

    this.connector.start();
    log.info('Waiting for LeagueClient to connect');
  }

  async getCurrentData(): Promise<CurrentState> {
    if (!this.connectionInfo) {
      log.debug('Not connected to LCU, but tried to get data.');
    }

    const response = await needle(
      'get',
      `https://127.0.0.1:${this.connectionInfo.port}/lol-champ-select/v1/session`,
      this.requestConfig
    );
    const currentState = new CurrentState(
      response.statusCode === 200,
      response.body
    );

    if (this.recorder) {
      this.recorder.addDataPoint(currentState);
    }

    return currentState;
  }

  async cacheSummoners(session: Session): Promise<void> {
    const blueTeam = session.myTeam;
    const redTeam = session.theirTeam;

    const fetchPlayersFromTeam = (
      team: Array<Cell>
    ): Array<Promise<NeedleResponse>> =>
      team.map((cell) =>
        needle(
          'get',
          `https://127.0.0.1:${this.connectionInfo.port}/lol-summoner/v1/summoners/${cell.summonerId}`,
          this.requestConfig
        )
      );

    const jobs = [
      ...fetchPlayersFromTeam(blueTeam),
      ...fetchPlayersFromTeam(redTeam),
    ];

    const completedJobs = await Promise.all(jobs);

    completedJobs.forEach((job: NeedleResponse) => {
      this.summoners.push(job.body);
    });

    if (this.recorder) {
      this.recorder.setSummoners(this.summoners);
    }
  }

  getSummonerById(id: number): Summoner {
    return this.summoners.filter((summoner) => summoner.summonerId === id)[0];
  }

  onLeagueConnected(e: ConnectionInfo): void {
    log.info('LeagueClient connected');
    this.connectionInfo = e;
    this.requestConfig.username = this.connectionInfo.username;
    this.requestConfig.password = this.connectionInfo.password;

    this.emit('connected');
  }

  onLeagueDisconnected(): void {
    log.info('LeagueClient disconnected');

    if (this.recorder) {
      this.recorder.save();
    }

    this.emit('disconnected');
  }
}

export default LeagueDataProviderService;

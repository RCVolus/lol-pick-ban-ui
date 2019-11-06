import { EventEmitter } from 'events';
import convertState from './converter';
import { CurrentState } from '../data/CurrentState';
import DataProviderService from '../data/DataProviderService';
import State from './state';
import DataDragon from '../data/league/datadragon';
import logger from '../logging/logger';

const log = logger('Controller');

export default class Controller extends EventEmitter {
  dataProvider: DataProviderService;
  state: State;
  ddragon: DataDragon;

  constructor(kwargs: { dataProvider: DataProviderService; state: State; ddragon: DataDragon }) {
    super();

    this.dataProvider = kwargs.dataProvider;
    this.state = kwargs.state;
    this.ddragon = kwargs.ddragon;

    this.dataProvider.on('connected', () => {
      log.debug('DataProvider connected!');
      this.state.leagueConnected();
    });

    this.dataProvider.on('disconnected', () => {
      log.debug('DataProvider disconnected!');
      this.state.leagueDisconnected();
    })
  }

  applyNewState(newState: CurrentState): void {
    if (!this.state.data.champSelectActive && newState.isChampSelectActive) {
      log.info('ChampSelect started!');
      this.state.champselectStarted();

      // Also cache information about summoners
      this.dataProvider.cacheSummoners(newState.session).then();
    }
    if (this.state.data.champSelectActive && !newState.isChampSelectActive) {
      log.info('ChampSelect ended!');
      this.state.champselectEnded();
    }

    // We can't do anything if champselect is not active!
    if (!newState.isChampSelectActive) {
      return;
    }

    const cleanedData = convertState(newState, this.dataProvider, this.ddragon);

    // TODO examine what events to fire

    this.state.newState(cleanedData);
  }
}

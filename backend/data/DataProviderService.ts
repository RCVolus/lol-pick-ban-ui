import { CurrentState } from './CurrentState';
import { Session, Summoner } from '../types/lcu';
import { EventEmitter } from 'events';
import logger from '../logging/logger';
import ReplayDataProviderService from './ReplayDataProviderService';
import LeagueDataProviderService from './league/LeagueDataProviderService';
import GlobalContext from '../GlobalContext';
const log = logger('DataProviderService');

export default interface DataProviderService extends EventEmitter {
  getCurrentData(): Promise<CurrentState | null>;
  cacheSummoners(session: Session): Promise<void>;
  getSummonerById(id: number): Summoner;
}

export const getDataProvider = (): DataProviderService => {
  if (GlobalContext.commandLine.data && GlobalContext.commandLine.data.startsWith('../recordings/')) {
    const recordingFile = GlobalContext.commandLine.data;
    log.info(`Using recording as data provider service: ${recordingFile}`);
    log.warn('THIS IS PROBABLY MEANT FOR TESTING USAGE AND SHOULD ONLY BE USED IN PRODUCTION, IF YOU KNOW WHAT YOU ARE DOING!');

    return new ReplayDataProviderService(recordingFile);
  }
  log.info('Using League Client as data provider service.');
  return new LeagueDataProviderService();
};

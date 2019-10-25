import { CurrentState } from './CurrentState';
import { Session } from '../types/lcu';

export interface DataProviderService {
  getCurrentData(): Promise<CurrentState>;
  cacheSummoners(session: Session): Promise<void>;
}
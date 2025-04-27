import { CurrentState } from '../data/CurrentState';
import { Session } from '../types/lcu';

export default class RecordingDatapoint extends CurrentState {
  time: Date;

  constructor(isChampSelectActive: boolean, session: Session, time: Date, config: any) {
    super(isChampSelectActive, session, config);

    this.time = time;
  }
}

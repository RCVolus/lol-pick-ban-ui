import { Session } from '../types/lcu';

export class CurrentState {
  isChampSelectActive: boolean;
  session: Session;

  constructor(isChampSelectActive: boolean, session: Session) {
    this.isChampSelectActive = isChampSelectActive;
    this.session = session;
  }
}
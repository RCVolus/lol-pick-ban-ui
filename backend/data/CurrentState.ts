import { Session } from '../types/lcu';

export class CurrentState {
  isChampSelectActive: boolean;
  session: Session;
  config: any;

  constructor(isChampSelectActive: boolean, session: Session, config: any) {
    this.isChampSelectActive = isChampSelectActive;
    this.session = session;
    this.config = config;
  }
}
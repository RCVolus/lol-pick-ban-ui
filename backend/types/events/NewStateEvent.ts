import PBEvent from './PBEvent';
import { StateData } from '../dto';

export default class NewStateEvent implements PBEvent {
  constructor(state: StateData) {
    this.state = state;
  }

  eventType = 'newState';
  state: StateData
}

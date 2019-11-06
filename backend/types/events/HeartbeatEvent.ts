import PBEvent from './PBEvent';
import { Config } from '../dto';

export default class HeartbeatEvent implements PBEvent {
  constructor(config: Config) {
    this.config = config;
  }

  eventType = 'heartbeat';
  config: Config
}

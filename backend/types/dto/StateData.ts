import { Config, Meta, Team } from './';

export class StateData {
  leagueConnected = false;
  champSelectActive = false;
  blueTeam = new Team();
  redTeam = new Team();
  meta = new Meta();
  timer = 0;
  state = 'PICK 1';
  config = new Config();
}

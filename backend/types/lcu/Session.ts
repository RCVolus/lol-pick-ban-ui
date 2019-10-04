import { Action, Cell, Timer } from './';

export class Session {
  myTeam: Array<Cell> = [];
  theirTeam: Array<Cell> = [];
  actions: Array<Array<Action>> = [];
  timer: Timer = new Timer();
}
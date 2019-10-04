import { ActionType } from './';

export class Action {
  completed!: boolean;
  championId!: number;
  type!: ActionType;
  actorCellId!: number;
}
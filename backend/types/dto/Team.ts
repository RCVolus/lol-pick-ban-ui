import { Ban, Pick, Actionable } from './';

export class Team implements Actionable {
  bans: Array<Ban> = [];
  picks: Array<Pick> = [];
  isActive = false;
}
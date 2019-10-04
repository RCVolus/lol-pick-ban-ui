import { Actionable, Champion } from './';

export class Ban implements Actionable {
  champion = new Champion();
  isActive = false;
}
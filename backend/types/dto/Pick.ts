import { Actionable, Champion, Spell } from './';

export class Pick implements Actionable {
  id: number;
  spell1!: Spell;
  spell2!: Spell;
  champion!: Champion;
  isActive = false;
  displayName = '';
  constructor(id: number) {
    this.id = id;
  }
}
import EventEmitter from 'events';
import * as fs from 'fs';
import { Config, StateData, Team } from '../types/dto';

class State extends EventEmitter {
    data: StateData;

    constructor() {
      super();

      this.data = new StateData();
      this.data.config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    }

    champselectStarted(): void {
      this.data.config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

      this.data.champSelectActive = true;
      this.triggerUpdate();
    }

    champselectEnded(): void {
      this.data.blueTeam = new Team();
      this.data.redTeam = new Team();
      this.data.timer = 0;
      this.data.champSelectActive = false;
      this.triggerUpdate();
    }

    newState (state: { redTeam: Team; blueTeam: Team; timer: number }): void {
      let shouldUpdate = false;

      if (JSON.stringify(this.data.blueTeam) !== JSON.stringify(state.blueTeam)) {
        this.data.blueTeam = state.blueTeam;
        shouldUpdate = true;
      }

      if (JSON.stringify(this.data.redTeam) !== JSON.stringify(state.redTeam)) {
        this.data.redTeam = state.redTeam;
        shouldUpdate = true;
      }

      if (this.data.timer !== state.timer) {
        this.data.timer = state.timer;
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        this.triggerUpdate();
      }
    }

    leagueConnected(): void {
      this.data.leagueConnected = true;
      this.triggerUpdate();
    }

    leagueDisconnected(): void {
      this.data.leagueConnected = false;
      this.triggerUpdate();
    }

    triggerUpdate(): void {
      this.emit('stateUpdate', this.data);
    }

    getVersionCDN(): string {
      return `${this.data.meta.cdn}/${this.data.meta.version.champion}`;
    }

    getCDN(): string {
      return this.data.meta.cdn;
    }

    getConfig(): Config {
      return this.data.config;
    }
}

export default State;

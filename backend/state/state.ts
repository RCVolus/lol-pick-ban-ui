import EventEmitter from 'events';
import ChampSelect from './champselect';
import { StateData, Team } from '../types/dto';

class State extends EventEmitter {
    champselect: ChampSelect;
    data: StateData;

    constructor() {
      super();

      this.champselect = new ChampSelect();
      this.data = new StateData();

      this.champselect.on('started', () => {
        this.data.champSelectActive = true;
        this.triggerUpdate();
      });

      this.champselect.on('ended', () => {
        this.data.blueTeam = new Team();
        this.data.redTeam = new Team();
        this.data.timer = 0;
        this.data.champSelectActive = false;
        this.triggerUpdate();
      });

      this.champselect.on('newState', (state: { redTeam: Team; blueTeam: Team; timer: number }) => {
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
      });
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
}

export default new State();

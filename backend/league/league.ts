import DDragon from './ddragon';
import LCU from './lcu';
import logger from '../logging';

const log = logger('league');

class League {
    ddragon = new DDragon();
    lcu!: LCU;

    init(): Promise<void> {
      this.lcu = new LCU();

      return this.ddragon.init().then(() => {
        log.info('Ddragon initialized!');
      });
    }
}

export default new League();

import DDragon from './ddragon';
import LCU from './lcu';
import logger from '../logging';
const log = logger('league');

class League {
    constructor() {
        this.ddragon = new DDragon();
    }

    init() {
        this.lcu = new LCU();

        this.ddragon.init().then(() => {
            log.info('Ddragon initialized!');
        });
    }
}

export default new League();
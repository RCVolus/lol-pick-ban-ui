import DDragon from './ddragon';
import logger from '../logging';
const log = logger('league');

class League {
    constructor() {
        this.ddragon = new DDragon();
    }

    init() {
        this.ddragon.init().then(() => {
            log.info('League initialized!');
        });
    }
}

export default new League();
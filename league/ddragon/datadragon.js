import needle from 'needle';

import globalState from '../../state';
import logger from '../../logging';
const log = logger('datadragon');

const realm = 'euw';

class DataDragon {
    constructor() {
        this.versions = {}
    }

    async init() {
        log.info('Getting latest versions from ddragon.');
        this.versions = (await needle('get', `https://ddragon.leagueoflegends.com/realms/${realm}.json`, { json: true })).body;

        globalState.data.meta.version = {
            champion: this.versions['n']['champion'],
            item: this.versions['n']['item']
        };
        globalState.data.meta.cdn = this.versions['cdn'];

        globalState.triggerUpdate();

        log.info(`Champion: ${globalState.data.meta.version.champion}, Item: ${globalState.data.meta.version.item}, CDN: ${globalState.data.meta.cdn}`)
    }
}

export default DataDragon;
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

        log.info(`Champion: ${globalState.data.meta.version.champion}, Item: ${globalState.data.meta.version.item}, CDN: ${globalState.data.meta.cdn}`);

        this.champions = Object.values((await needle('get', `${globalState.data.meta.cdn}/${globalState.data.meta.version.champion}/data/en_US/champion.json`, { json: true })).body.data);
        log.info(`Loaded ${this.champions.length} champions`);

        this.summonerSpells = Object.values((await needle('get', `${globalState.data.meta.cdn}/${globalState.data.meta.version.item}/data/en_US/summoner.json`, { json: true })).body.data);
        log.info(`Loaded ${this.summonerSpells.length} summoner spells`);
    }

    getChampionById(id) {
        return this.champions.find(champion => {
            if (parseInt(champion.key, 10) === id) {
                return champion;
            }
        });
    }

    getSummonerSpellById(id) {
        return this.summonerSpells.find(spell => {
            if (parseInt(spell.key, 10) === id) {
                return spell;
            }
        });
    }
}

export default DataDragon;
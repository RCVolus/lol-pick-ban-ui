import needle from 'needle';

import globalState from '../../state';
import logger from '../../logging';
import { Champion, Spell } from '../../types/dto';

const log = logger('datadragon');
const realm = 'euw';

class DataDragon {
    versions = {
      n: {
        champion: '',
        item: ''
      },
      cdn: ''
    };
    champions: Array<Champion> = [];
    summonerSpells: Array<Spell> = [];

    async init(): Promise<void> {
      log.info('Getting latest versions from ddragon.');
      this.versions = (await needle('get', `https://ddragon.leagueoflegends.com/realms/${realm}.json`, { json: true })).body;

      globalState.data.meta.version = {
        champion: this.versions.n.champion,
        item: this.versions.n.item,
      };
      globalState.data.meta.cdn = this.versions.cdn;
      globalState.triggerUpdate();

      log.info(`Champion: ${globalState.data.meta.version.champion}, Item: ${globalState.data.meta.version.item}, CDN: ${globalState.data.meta.cdn}`);

      this.champions = Object.values((await needle('get', `${globalState.data.meta.cdn}/${globalState.data.meta.version.champion}/data/en_US/champion.json`, { json: true })).body.data);
      log.info(`Loaded ${this.champions.length} champions`);

      this.summonerSpells = Object.values((await needle('get', `${globalState.data.meta.cdn}/${globalState.data.meta.version.item}/data/en_US/summoner.json`, { json: true })).body.data);
      log.info(`Loaded ${this.summonerSpells.length} summoner spells`);
    }

    getChampionById(id: number): Champion | null {
      return this.champions.find((champion: Champion) => {
        if (parseInt(champion.key || '0', 10) === id) {
          champion.splashImg = `${globalState.getCDN()}/img/champion/splash/${champion.id}_0.jpg`;
          champion.squareImg = `${globalState.getVersionCDN()}/img/champion/${champion.id}.png`;
          champion.loadingImg = `${globalState.getCDN()}/img/champion/loading/${champion.id}_0.jpg`;

          return champion;
        }
      }) || null;
    }

    getSummonerSpellById(id: number): Spell | null {
      return this.summonerSpells.find((spell: Spell) => {
        if (parseInt(spell.key as string, 10) === id) {
          spell.icon = `${globalState.getVersionCDN()}/img/spell/${spell.id}.png`;
          return spell;
        }
      }) || null;
    }
}

export default DataDragon;

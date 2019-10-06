import needle from 'needle';
import * as fs from 'fs';

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
      const config = globalState.getConfig();

      if (config.contentPatch === 'latest') {
        log.info('Getting latest versions from ddragon.');
        this.versions = (await needle('get', `https://ddragon.leagueoflegends.com/realms/${realm}.json`, {json: true})).body;
      } else {
        log.info(`Using version from configuration: ${config.contentPatch}`);
        this.versions = {
          cdn: config.contentCdn,
          n: {
            champion: config.contentPatch,
            item: config.contentPatch
          }
        }
      }

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

      // Download all champion images and spell images
      this.checkLocalCache();
    }

    getChampionById(id: number): Champion | null {
      return this.champions.find((champion: Champion) => {
        if (parseInt(champion.key || '0', 10) === id) {
          return this.extendChampion(champion);
        }
      }) || null;
    }

    extendChampion(champion: Champion): Champion {
      champion.splashImg = `${globalState.getCDN()}/img/champion/splash/${champion.id}_0.jpg`;
      champion.squareImg = `${globalState.getVersionCDN()}/img/champion/${champion.id}.png`;
      champion.loadingImg = `${globalState.getCDN()}/img/champion/loading/${champion.id}_0.jpg`;
      return champion;
    }

    getSummonerSpellById(id: number): Spell | null {
      return this.summonerSpells.find((spell: Spell) => {
        if (parseInt(spell.key as string, 10) === id) {
          spell.icon = `${globalState.getVersionCDN()}/img/spell/${spell.id}.png`;
          return spell;
        }
      }) || null;
    }

    extendSummonerSpell(spell: Spell) {

    }

    checkLocalCache(): void {
      const patch = globalState.data.meta.version.champion;

      const patchFolder = `./cache/${patch}`;

      if (fs.existsSync(patchFolder)) {
        log.info(`Directory ${patchFolder} exists already. Please remove it if you want to re-download it.`);
        return;
      }
      fs.mkdirSync('./cache');
      fs.mkdirSync(patchFolder);
      fs.mkdirSync(patchFolder + '/champion');
      fs.mkdirSync(patchFolder + '/spell');

      log.info('Download process started. This could take a while. Downloading to: ' + patchFolder);

      const downloadFile = (targetUrl: string) => {

      };

      this.champions.forEach(champion => {
        downloadFile(globalState.getVersionCDN());
      });
    }
}

export default DataDragon;

import needle from 'needle';
import * as fs from 'fs';
import cliProgress from 'cli-progress';

import logger from '../../logging';
import { Champion, Spell } from '../../types/dto';
import State from '../../state';

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
    state: State;

    constructor(state: State) {
      this.state = state;
    }

    async init(): Promise<void> {
      const config = this.state.getConfig();

      if (config.contentPatch === 'latest') {
        log.info('Getting latest versions from ddragon.');
        this.versions = (await needle('get', `https://ddragon.leagueoflegends.com/realms/${realm}.json`, { json: true })).body;
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

      this.state.data.meta.version = {
        champion: this.versions.n.champion,
        item: this.versions.n.item,
      };
      this.state.data.meta.cdn = this.versions.cdn;
      this.state.triggerUpdate();

      log.info(`Champion: ${this.state.data.meta.version.champion}, Item: ${this.state.data.meta.version.item}, CDN: ${this.state.data.meta.cdn}`);

      this.champions = Object.values((await needle('get', `${this.state.data.meta.cdn}/${this.state.data.meta.version.champion}/data/en_US/champion.json`, { json: true })).body.data);
      log.info(`Loaded ${this.champions.length} champions`);

      this.summonerSpells = Object.values((await needle('get', `${this.state.data.meta.cdn}/${this.state.data.meta.version.item}/data/en_US/summoner.json`, { json: true })).body.data);
      log.info(`Loaded ${this.summonerSpells.length} summoner spells`);

      // Download all champion images and spell images
      await this.checkLocalCache();
    }

    getChampionById(id: number): Champion | null {
      return this.champions.find((champion: Champion) => {
        if (parseInt(champion.key || '0', 10) === id) {
          return this.extendChampionLocal(champion);
        }
      }) || null;
    }

    extendChampion(champion: Champion): Champion {
      champion.splashImg = `${this.state.getCDN()}/img/champion/splash/${champion.id}_0.jpg`;
      // champion.splashCenteredImg = `https://cdn.communitydragon.org/${this.state.getVersion()}/champion/${champion.id}/splash-art/centered`;
      // Data Dragon CDN broken workaround
      champion.splashCenteredImg = `https://raw.communitydragon.org/${this.state.getMajorMinorVersion()}/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/${champion.key}/${champion.key}000.jpg`;
      champion.squareImg = `${this.state.getVersionCDN()}/img/champion/${champion.id}.png`;
      champion.loadingImg = `${this.state.getCDN()}/img/champion/loading/${champion.id}_0.jpg`;
      return champion;
    }
    extendChampionLocal(champion: Champion): Champion {
      champion.splashImg = `/cache/${this.versions.n.champion}/champion/${champion.id}_splash.jpg`;
      champion.splashCenteredImg = `/cache/${this.versions.n.champion}/champion/${champion.id}_centered_splash.jpg`;
      champion.squareImg = `/cache/${this.versions.n.champion}/champion/${champion.id}_square.png`;
      champion.loadingImg = `/cache/${this.versions.n.champion}/champion/${champion.id}_loading.jpg`;
      return champion;
    }

    getSummonerSpellById(id: number): Spell | null {
      return this.summonerSpells.find((spell: Spell) => {
        if (parseInt(spell.key as string, 10) === id) {
          return this.extendSummonerSpellLocal(spell);
        }
      }) || null;
    }

    extendSummonerSpell(spell: Spell): Spell {
      spell.icon = `${this.state.getVersionCDN()}/img/spell/${spell.id}.png`;
      return spell;
    }
    extendSummonerSpellLocal(spell: Spell): Spell {
      spell.icon = `/cache/${this.versions.n.item}/spell/${spell.id}.png`;
      return spell;
    }

    async checkLocalCache(): Promise<void> {
      const patch = this.state.data.meta.version.champion;

      const patchFolder = `./cache/${patch}`;
      const patchFolderChampion = patchFolder + '/champion';
      const patchFolderSpell = patchFolder + '/spell';

      if (fs.existsSync(patchFolder)) {
        log.info(`Directory ${patchFolder} exists already. Please remove it if you want to re-download it.`);
        return;
      }
      try {
        fs.mkdirSync('./cache');
      } catch (e) {
        log.debug('Directory ./cache exists already or cannot be created.');
      }
      fs.mkdirSync(patchFolder);
      fs.mkdirSync(patchFolderChampion);
      fs.mkdirSync(patchFolderSpell);

      log.info('Download process started. This could take a while. Downloading to: ' + patchFolder);

      const downloadFile = (targetUrl: string, targetPath: string) => (): Promise<void> => new Promise<void>((resolve, reject): void => {
        needle('get', targetUrl, {
          // eslint-disable-next-line @typescript-eslint/camelcase
          open_timeout: 0
        })
            .then(function(resp) {
              const out = fs.createWriteStream(targetPath);
              out.write(resp.raw);
              out.close();
              resolve();
            })
            .catch(function(err) {
              reject(err);
            });
      });

      const tasks: Array<() => Promise<void>> = [];

      this.champions.forEach(champion => {
        champion = this.extendChampion(champion);
        tasks.push(downloadFile(champion.loadingImg, `${patchFolderChampion}/${champion.id}_loading.jpg`));
        tasks.push(downloadFile(champion.splashImg, `${patchFolderChampion}/${champion.id}_splash.jpg`));
        tasks.push(downloadFile(champion.splashCenteredImg, `${patchFolderChampion}/${champion.id}_centered_splash.jpg`));
        tasks.push(downloadFile(champion.squareImg, `${patchFolderChampion}/${champion.id}_square.png`));
      });

      this.summonerSpells.forEach(spell => {
        spell = this.extendSummonerSpell(spell);
        tasks.push(downloadFile(spell.icon, `${patchFolderSpell}/${spell.id}.png`));
      });

      log.info(`Downloading ${tasks.length} assets from datadragon!`);
      const batchSize = 10;

      const bar = new cliProgress.Bar({
        format: 'Downloading assets [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}'
      });

      bar.start(tasks.length, 0);
      for (let i = 0; i < tasks.length; i = i + batchSize) {
        const currentTasks = tasks.slice(i, i + batchSize);

        await Promise.all(currentTasks.map(task => task()));
        bar.update(i + 1);
      }
      bar.stop();

      log.info(`Downloading ${tasks.length} assets finished.`);
    }
}

export default DataDragon;

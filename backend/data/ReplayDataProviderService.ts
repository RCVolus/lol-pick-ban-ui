import DataProviderService from "./DataProviderService";
import {EventEmitter} from "events";
import fs from 'fs';
import {Session, Summoner} from "../types/lcu";
import {CurrentState} from "./CurrentState";
import logger from "../logging/logger";
const log = logger('ReplayDataProviderService');

export default class ReplayDataProviderService extends EventEmitter implements DataProviderService {
  replayFilePath: string;
  recording: {
    summoners: Array<Summoner>,
    dataPoints: Array<CurrentState>
  };
  numberOfPoints: number;
  currentTime = new Date();

  constructor(replayFile: string) {
    super();

    this.replayFilePath = replayFile + '.json';

    const recordingString = fs.readFileSync(this.replayFilePath, 'utf8');

    this.recording = JSON.parse(recordingString);
    this.numberOfPoints = this.recording.dataPoints.length;
  }

  async cacheSummoners(session: Session): Promise<void> {
    // Nothing to do here - summoners are loaded already :)
  }

  async getCurrentData(): Promise<CurrentState> {
    log.info(`${this.numberOfPoints - this.recording.dataPoints.length} / ${this.numberOfPoints}`);

    const nextPoint = this.recording.dataPoints.shift();

    if (!nextPoint) {
      return new CurrentState(false, new Session());
    }

    return nextPoint;
  }

  getSummonerById(id: number): Summoner {
    return this.recording.summoners.filter((summoner) => summoner.summonerId === id)[0];
  }
}

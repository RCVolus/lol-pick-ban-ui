import {CurrentState} from "../data/CurrentState";
import fs from 'fs';
import {Summoner} from "../types/lcu";
import logger from "../logging/logger";
import RecordingDatapoint from "./RecordingDatapoint";
const log = logger('Recorder');

export default class Recorder {
  name: string;
  dataPoints: Array<RecordingDatapoint> = [];
  summoners: Array<Summoner> = [];

  constructor(name: string) {
    this.name = name;
  }

  addDataPoint(state: CurrentState) {
    const dataPoint = new RecordingDatapoint(state.isChampSelectActive, state.session, new Date());
    this.dataPoints.push(dataPoint);
  }

  setSummoners(summoners: Array<Summoner>) {
    this.summoners = summoners;
  }

  save() {
    const recordingsPath = './recordings';

    if (!fs.existsSync(recordingsPath)) {
      fs.mkdirSync(recordingsPath);
    }

    const jsonString = JSON.stringify({
      dataPoints: this.dataPoints,
      summoners: this.summoners
    });

    fs.writeFileSync(recordingsPath + '/' + this.name + '.json', jsonString);
    log.info(`Recording ${this.name} saved!`);
  }
}

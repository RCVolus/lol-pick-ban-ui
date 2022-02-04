import { CurrentState } from '../data/CurrentState';
import fs from 'fs';
import { Summoner } from '../types/lcu';
import logger from '../logging/logger';
import RecordingDatapoint from './RecordingDatapoint';
const log = logger('Recorder');

export default class Recorder {
  name: string;
  dataPoints: Array<RecordingDatapoint> = [];
  summoners: Array<Summoner> = [];

  constructor(name: string) {
    this.name = name;
  }

  addDataPoint(state: CurrentState): void {
    const dataPoint = new RecordingDatapoint(state.isChampSelectActive, state.session, new Date());
    this.dataPoints.push(dataPoint);
  }

  setSummoners(summoners: Array<Summoner>): void {
    this.summoners = summoners;
  }

  save(): void {
    const recordingsPath = '../recordings';

    if (!fs.existsSync(recordingsPath)) {
      fs.mkdirSync(recordingsPath);
    }

    // Remove duplicates from datapoints. This ensures that we have the pace of 1 state change / second!
    /* const distinctDataPoints = this.dataPoints.filter((value, index, self) => {
      if (index === 0) {
        return true;
      }
      if (JSON.stringify(self[index - 1].session) === JSON.stringify(value.session)) {
        return false;
      }
      return true;
    }); */

    const jsonString = JSON.stringify({
      dataPoints: this.dataPoints,
      summoners: this.summoners
    });

    fs.writeFileSync(recordingsPath + '/' + this.name + '.json', jsonString);
    log.debug(`Recording ${this.name} saved!`);
  }
}

import logger from './logging/logger';
import Timeout = NodeJS.Timeout;
import Controller from './state/Controller';

const log = logger('tick');

class TickManager {
  controller: Controller;
  timeout?: Timeout;
  tickRate = 1;

  constructor(kwargs: { controller: Controller }) {
    this.controller = kwargs.controller;
  }

  startLoop(): void {
    log.info(`Starting main loop with ${1 / this.tickRate} ticks/s!`);
    this.timeout = setInterval(() => this.runLoop(), 1000 / this.tickRate);
  }

  async runLoop(): Promise<void> {
    const newState = await this.controller.dataProvider.getCurrentData();

    if (newState !== null) {
      this.controller.applyNewState(newState);
    }
  }
}

export default TickManager;

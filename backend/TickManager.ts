import DataProviderService from "./data/DataProviderService";
import logger from "./logging/logger";
import Timeout = NodeJS.Timeout;
import Controller from "./state/controller";

const log = logger('tick');

class TickManager {
  controller: Controller;
  timeout?: Timeout;
  tickRate: number = 1;

  constructor(kwargs: { controller: Controller }) {
    this.controller = kwargs.controller;
  }

  startLoop() {
    log.info(`Starting main loop with ${1/this.tickRate} ticks/s!`);
    this.timeout = setInterval(() => this.runLoop(), 1000/this.tickRate);
  }

  async runLoop() {
    const newState = await this.controller.dataProvider.getCurrentData();

    this.controller.applyNewState(newState);
  }
}

export default TickManager;

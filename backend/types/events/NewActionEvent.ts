import PBEvent from "./PBEvent";

export default class NewActionEvent implements PBEvent {
  constructor(action: any) {
    this.action = action;
  }

  eventType = "newAction";
  action: any;
}

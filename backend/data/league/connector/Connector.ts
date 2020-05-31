import { EventEmitter } from 'events';

export class ConnectionInfo {
  port!: number;
  username!: string;
  password!: string;
}

export class ConnectorOptions {
  leaguePath?: string;
}

declare interface Connector extends EventEmitter {
  options: ConnectorOptions;

  start(): void;

  on(event: 'disconnect', listener: () => void): this;
  on(event: 'connect', listener: (info: ConnectionInfo) => void): this;
}
export default Connector;

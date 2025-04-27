import { Server as WebServer } from "ws";
import { existsSync, readFileSync } from "fs";
import { Server as HttpServer, IncomingMessage } from "http";

import logger from "../logging";
import { StateData } from "../types/dto";
import State from "../state";
import PBEvent from "../types/events/PBEvent";
import NewStateEvent from "../types/events/NewStateEvent";
import HeartbeatEvent from "../types/events/HeartbeatEvent";
import ChampSelectStartedEvent from "../types/events/ChampSelectStartedEvent";
import ChampSelectEndedEvent from "../types/events/ChampSelectEndedEvent";
import NewActionEvent from "../types/events/NewActionEvent";

const log = logger("websocket");

class WebSocketServer {
  server: WebServer;
  state: State;
  clients: Array<WebSocket> = [];
  exampleClients: Array<WebSocket> = [];
  heartbeatInterval?: NodeJS.Timeout;
  config: any;

  constructor(server: HttpServer, state: State) {
    this.server = new WebServer({ server });
    this.state = state;

    this.sendHeartbeat = this.sendHeartbeat.bind(this);

    // Event listeners
    this.server.on("connection", (socket: WebSocket, request) =>
      this.handleConnection(socket, request)
    );

    state.on("stateUpdate", (newState: StateData) => {
      newState.config = this.config;
      this.sendEvent(new NewStateEvent(newState));
    });
    state.on("champSelectStarted", () =>
      this.sendEvent(new ChampSelectStartedEvent())
    );
    state.on("champSelectEnded", () =>
      this.sendEvent(new ChampSelectEndedEvent())
    );
    state.on("newAction", (action) => {
      this.sendEvent(new NewActionEvent(action));
    });
  }

  startHeartbeat(): void {
    this.heartbeatInterval = setInterval(this.sendHeartbeat, 1000);
  }

  handleConnection(socket: WebSocket, request: IncomingMessage): void {
    this.clients.push(socket);
    socket.send(JSON.stringify(new NewStateEvent(this.state.data)));
  }

  sendEvent(event: PBEvent): void {
    const serializedEvent = JSON.stringify(event);
    log.debug(`New Event: ${serializedEvent}`);

    this.clients.forEach((client: WebSocket) => {
      client.send(serializedEvent);
    });
  }

  sendHeartbeat(): void {
    if (existsSync("./config.override.json")) {
      this.config = JSON.parse(readFileSync("./config.override.json", "utf8"));
    } else {
      this.config = JSON.parse(readFileSync("./config.json", "utf8"));
    }
    const heartbeatEvent = new HeartbeatEvent(this.config);
    const heartbeatSerialized = JSON.stringify(heartbeatEvent);

    this.clients.forEach((client: WebSocket) => {
      client.send(heartbeatSerialized);
    });
  }
}

export default WebSocketServer;

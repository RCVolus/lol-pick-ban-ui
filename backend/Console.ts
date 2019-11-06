import readline from 'readline';
import logger from './logging';
const log = logger('Console');

readline.emitKeypressEvents(process.stdin);

declare class KeyEvent {
  sequence: String;
  name: String;
  ctrl: Boolean;
  meta: Boolean;
  shift: Boolean;
}

const handlers: Array<(event: KeyEvent) => void> = [];

if (process.stdin.setRawMode) {
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (str, key: KeyEvent) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    } else {
      handlers.forEach(handler => {
        handler(key);
      });
    }
  });
} else {
  log.info('Cannot listen for console events: no stdin found.');
}

export const registerHandler = (handler: (event: KeyEvent) => void) => {
  handlers.push(handler);
};

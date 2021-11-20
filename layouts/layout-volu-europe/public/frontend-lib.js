/* eslint-disable */
/* Event Emitter */
const eventify = (self) => {
    self.events = {};

    self.on = function (event, listener) {
        if (typeof self.events[event] !== 'object') {
            self.events[event] = []
        }

        self.events[event].push(listener)
    };

    self.removeListener = function (event, listener) {
        let idx;

        if (typeof self.events[event] === 'object') {
            idx = self.events[event].indexOf(listener);

            if (idx > -1) {
                self.events[event].splice(idx, 1)
            }
        }
    };

    self.emit = function (event) {
        let i, listeners, length, args = [].slice.call(arguments, 1);

        if (typeof self.events[event] === 'object') {
            listeners = self.events[event].slice();
            length = listeners.length;

            for (i = 0; i < length; i++) {
                listeners[i].apply(self, args)
            }
        }
    };

    self.once = function (event, listener) {
        self.on(event, function g () {
            self.removeListener(event, g);
            listener.apply(self, arguments)
        })
    };
};

const getQueryVariable = variable => {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
};

const PB = {};
eventify(PB);

PB.getQueryVariable = getQueryVariable;


PB.toAbsoluteUrl = (convertUrl, baseUrl) => {
    baseUrl = baseUrl || getQueryVariable('backend');

    if (!convertUrl || !convertUrl.startsWith('/cache')) {
        return convertUrl;
    }

    const httpBackendUrl = baseUrl.replace('ws://', 'http://').replace('wss://', 'https://');
    const components = httpBackendUrl.split('/');

    return components[0] + '//' + components[2] + convertUrl;
};


PB.start = function(url) {
    this.backend = getQueryVariable('backend') || url;

    console.log('[PB] Connecting to ws backend on ' + this.backend);

    const connect = () => {
        this.socket = new WebSocket(this.backend);
        this.emit('statusChange', 'CONNECTING');

        this.socket.onopen = () => {
            this.emit('statusChange', 'CONNECTED');
            console.log('[PB] Connection established!')
        };
        this.socket.onclose = () => {
            this.emit('statusChange', 'CLOSED');
            setTimeout(connect, 500);
            console.log('[PB] Attempt reconnect in 500ms');
        };
        this.socket.onerror = () => {
            this.emit('statusChange', 'ERROR');
        };
        this.socket.onmessage = msg => {
            const data = JSON.parse(msg.data);
            // Maybe check if heartbeat arrives regularly to assure that connection is alive?

            if (data.eventType) {
                this.emit(data.eventType, data);
            } else {
                console.log('[PB] Unexpected packet format: ' + JSON.stringify(data));
            }
        };
    };

    connect();
};

Window.PB = PB;

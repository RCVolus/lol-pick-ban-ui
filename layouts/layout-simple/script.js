function addEventLog(name) {
    const eventsNode = document.getElementById('events');
    eventsNode.innerHTML = eventsNode.innerHTML + '<tr><td>' + new Date().toLocaleString() + '</td><td>' + name + '</td></tr>';
}

PB.on('statusChange', newStatus => {
    document.getElementById('status').innerText = newStatus;
    // addEventLog('statusChange');
});

PB.on('newState', newState => {
    console.log(newState);
    addEventLog('newState');
});

PB.on('heartbeat', newHb => {
    Window.CONFIG = newHb.config;
});

PB.on('champSelectStarted', () => {
    addEventLog('champSelectStarted');
});
PB.on('champSelectEnded', () => {
    addEventLog('champSelectEnded');
});

PB.start();

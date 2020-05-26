# Custom Pick&Ban design
This documentation guides you trough the creation of your very own and fully customized pick&ban UI.

## Prerequisites
- Knowledge of web technologies (HTML, CSS and a bit JS)
- A development environment / IDE (e.g. Atom, WebStorm, Visual Studio Code, Sublime)
- NodeJS. Refer to the [README](README.md) on how to install that.
- Local setup of the backend (refer to [README](README.md) on how to install that). The frontend is not needed, since you'll create your own.
- Serve. Install it globally using ```npm install -g serve```.

## Getting started
In order to start the project, create the following files in an empty repository:

index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>P&B UI by RCV - Test</title>
</head>
<body>
<div>
    Status: <span id="status">LOADED</span>
</div>
<table>
    <thead>
    <tr>
        <th>Time</th>
        <th>Event</th>
    </tr>
    </thead>
    <tbody id="events">
    </tbody>
</table>
<div id="state">
</div>

<script src="frontend-lib.js"></script>
<script>
    function addEventLog(name) {
        const eventsNode = document.getElementById('events');
        eventsNode.innerHTML = eventsNode.innerHTML + '<tr><td>' + new Date().toLocaleString() + '</td><td>' + name + '</td></tr>';
    }

    PB.on('statusChange', newStatus => {
        document.getElementById("status").innerText = newStatus;
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
</script>
</body>
</html>
```
This is a really basic example that connects to the backend using the frontend library that logs all incoming events.

Now you also need to copy the frontend part. Just paste that file into your project directory: [frontend-lib.js](frontend/frontend-lib.js).
Make sure the name matches exactly!

## Making it look more like a pick&ban UI

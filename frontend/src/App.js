import React, { useEffect, useState } from 'react';

function App() {
  const [globalState, setGlobalState] = useState({});
  useEffect(() => {
    const socketUrl = process.env.REACT_APP_LCSU_BACKEND || `ws://${window.location.host}/ws`
    let socket;

    const onopen = (() => {
      console.log('Connected to WS backend!');
    });

    const onmessage = msg => {
      const data = JSON.parse(msg.data);
      if (data.heartbeat === true) {
        return;
      }
      setGlobalState(data);
    };

    const observeConnection = () => {
      if (!socket || socket.readyState === WebSocket.CLOSED) {
        // Reset state
        setGlobalState({});
        console.log('Websocket is closed, try to reconnect!');
        socket = new WebSocket(socketUrl);
        socket.onopen = onopen;
        socket.onmessage = onmessage;
      }
    };

    observeConnection();
    setTimeout(() => setInterval(observeConnection, 500), 2000);
  }, []);

  return (
    <div className="App">
      {Object.keys(globalState).length === 0 && <div className={"infoBox"}>Not connected to backend service!</div> }
      {Object.keys(globalState).length !== 0 &&
      <div className="ChampSelect">
        {!globalState.leagueConnected && <div className={"infoBox"}>Not connected to client!</div> }
        {JSON.stringify(globalState)}
      </div>}
    </div>
  );
}

export default App;

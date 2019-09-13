import React, { useEffect, useState } from 'react';

function App() {
  const [globalState, setGlobalState] = useState({});
  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_LCSU_BACKEND || `ws://${window.location.host}/ws`);

    socket.onopen = (() => {
      console.log('Connected to WS backend!');
    });

    socket.onmessage = msg => {
      setGlobalState(JSON.parse(msg.data));
    };
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

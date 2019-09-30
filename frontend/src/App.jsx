import React, { useEffect, useState } from 'react';
import Overlay from "./europe/Overlay";

function App() {
  const [globalState, setGlobalState] = useState({});
  useEffect(() => {
    const socketUrl = window.location.pathname === '/example' ? `ws://localhost:8999/example` : process.env.REACT_APP_LCSU_BACKEND || `ws://${window.location.host}/ws`;
    console.log(`WebSocket service: ${socketUrl}`);
    console.log(process.env);
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
      <Overlay state={globalState} />
    </div>
  );
}

export default App;

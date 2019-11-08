import React, {useEffect, useState} from 'react';
import Overlay from "./europe/Overlay";
import convertState from './convertState';

function App() {
    const [globalState, setGlobalState] = useState({});
    const [config, setConfig] = useState({
        frontend: {
            scoreEnabled: false,
            spellsEnabled: true,
            coachesEnabled: false,
            blueTeam: {
                name: "Team Blue",
                score: 0,
                coach: "",
                color: "rgb(0,151,196)"
            },
            redTeam: {
                name: "Team Red",
                score: 0,
                coach: "",
                color: "rgb(222,40,70)"
            },
            patch: ""
        }
    });
    useEffect(() => {
        Window.PB.on('newState', state => {
            setGlobalState(state.state);
            setConfig(state.state.config);
        });

        Window.PB.on('heartbeat', hb => {
            setConfig(hb.config);
        });

        Window.PB.start();
    }, []);

    console.log(globalState);

    return (
        <div className="App">
            <Overlay state={convertState(globalState, Window.PB.backend)} config={config}/>
        </div>
    );
}

export default App;

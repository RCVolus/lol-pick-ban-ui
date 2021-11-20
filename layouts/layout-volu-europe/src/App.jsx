import React, {useEffect, useState} from 'react';
import Overlay from "./europe/Overlay";
import convertState from './convertState';
import Error from './Error';

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
    const [error, setError] = useState('');
    useEffect(() => {
        Window.PB.on('newState', state => {
            setGlobalState(state.state);
            setConfig(state.state.config);
        });

        Window.PB.on('heartbeat', hb => {
            console.info(`Got new config: ${JSON.stringify(hb.config)}`);
            setConfig(hb.config);
        });

        try {
            Window.PB.start();
        } catch {
            setError('error: failed to read backend url query param. make sure you set ?backend=ws://[ip]:[port] as query parameter.')
        }
    }, []);

    if (Window.PB.getQueryVariable('status') === '1') {
        const status = {
            backend: Window.PB.getQueryVariable('backend'),
            error: error,
            config: config,
            state: { ...globalState, config: undefined, blueTeam: JSON.stringify(globalState.blueTeam), redTeam: JSON.stringify(globalState.redTeam) }
        }
        return <Error message={`status: ${JSON.stringify(status, undefined, 4)}`} isStatus />
    }

    if (error) {
        return <Error message={error} />
    }

    if (config) {
        return (
            <div className="App">
                <Overlay state={convertState(globalState, Window.PB.backend)} config={config}/>
            </div>
        );
    } else {
        return (
            <Error message='Unable to load configuration' />
        )
    }
}

export default App;

import React from 'react';
import Pick from "./Pick";

import './europe.css';
import Ban from "./Ban";

export default class Overlay extends React.Component {
    render() {
        const { state } = this.props;
        console.log(state);

        return (
            <div className={"Overlay Europe"}>
                {Object.keys(state).length === 0 && <div className={"infoBox"}>Not connected to backend service!</div>}
                {Object.keys(state).length !== 0 &&
                <div className="ChampSelect">
                    {!state.leagueConnected && <div className={"infoBox"}>Not connected to client!</div> }
                    <div className="MiddleBox">
                        <div className="Logo">
                            [LOGO]
                        </div>
                        <div className="Timer Red">
                            17
                        </div>
                    </div>
                    <div className="Team TeamBlue">
                        <div className="Picks">
                            {state.blueTeam.picks.map(pick => <Pick {...pick} />)}
                        </div>
                        <div className="Bans">
                            <div className="TeamName">
                                SCYREX
                            </div>
                            {state.blueTeam.bans.map(ban => <Ban {...ban} />)}
                        </div>
                    </div>
                    <div className="Team TeamRed">
                        <div className="Picks">
                            {state.redTeam.picks.map(pick => <Pick {...pick} />)}
                        </div>
                        <div className="Bans">
                            {state.redTeam.bans.map(ban => <Ban {...ban} />)}
                            <div className="TeamName">
                                SCYREX
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        )
    }
}

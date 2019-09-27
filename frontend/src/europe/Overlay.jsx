import React from 'react';
import cx from 'classnames';
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
                            <img src="https://eu.lolesports.com/darkroom/original/b496f5eaa42b6152b579a5c3e6edf5a3:b9ea0fa9ce55cde10d1eef7564ba4c3a/de-logo.png" alt="" />
                        </div>
                        <div className="Patch">
                            Patch: {Window.lolcfg.patch}
                        </div>
                        <div className="Timer Both">
                            17
                        </div>
                    </div>
                    <div className="Team TeamBlue">
                        <div className="Picks">
                            {state.blueTeam.picks.map(pick => <Pick {...pick} />)}
                        </div>
                        <div className={cx("Bans", {"WithScore": Window.lolcfg.scoreEnabled})}>
                            <div className="TeamName">
                                SCHALKE 04
                            </div>
                            {state.blueTeam.bans.map(ban => <Ban {...ban} />)}
                        </div>
                        {Window.lolcfg.scoreEnabled && <div className="TeamScore">
                            <div>{Window.lolcfg.blueTeam.score}</div>
                        </div>}
                    </div>
                    <div className="Team TeamRed">
                        <div className="Picks">
                            {state.redTeam.picks.map(pick => <Pick {...pick} />)}
                        </div>
                        <div className={cx("Bans", {"WithScore": Window.lolcfg.scoreEnabled})}>
                            {state.redTeam.bans.map(ban => <Ban {...ban} />)}
                            <div className="TeamName">
                                SCYREX
                            </div>
                        </div>
                        {Window.lolcfg.scoreEnabled && <div className="TeamScore">
                            <div>{Window.lolcfg.redTeam.score}</div>
                        </div>}
                    </div>
                </div>}
            </div>
        )
    }
}

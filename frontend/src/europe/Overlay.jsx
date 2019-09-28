import React from 'react';
import cx from 'classnames';
import Pick from "./Pick";

import './europe.css';
import Ban from "./Ban";

import botSplash from '../assets/bot_splash_placeholder.svg';
import jungSplash from '../assets/jung_splash_placeholder.svg';
import midSplash from '../assets/mid_splash_placeholder.svg';
import supSplash from '../assets/sup_splash_placeholder.svg';
import topSplash from '../assets/top_splash_placeholder.svg';
import banImg from '../assets/ban_placeholder.svg';

export default class Overlay extends React.Component {
    render() {
        const { state } = this.props;
        const pickSplashes = [topSplash, jungSplash, midSplash, botSplash, supSplash];

        const putPlaceholders = team => {
            for (let i = 0; i < 5; i++) {
                // Picks
                // Check if exists
                if (i >= team.picks.length) {
                    // Does not exists, push
                    team.picks.push({
                        champion: {
                            loadingImg: pickSplashes[i]
                        }
                    });
                } else {
                    // Exists, check!
                    const pick = team.picks[i];
                    if (!pick.champion || !pick.champion.loadingImg) {
                        pick.champion = {
                            loadingImg: pickSplashes[i]
                        };
                        pick.spell1 = null;
                        pick.spell2 = null;
                    }
                }

                // Bans
                if (i >= team.bans.length) {
                    // Does not exist
                    team.bans.push({
                        champion: {
                            squareImg: banImg
                        }
                    });
                } else {
                    const ban = team.bans[i];
                    if (!ban.champion || !ban.champion.squareImg) {
                        ban.champion = {
                            squareImg: banImg
                        }
                    }
                }
            }
        };

        if (Object.keys(state).length !== 0) {
            putPlaceholders(state.blueTeam);
            putPlaceholders(state.redTeam);
        }

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
                        <div className={cx("Timer", {
                            'Red': state.redTeam.isActive,
                            'Blue': state.blueTeam.isActive,
                            'Both': !state.blueTeam.isActive && !state.redTeam.isActive
                        })}>
                            {state.timer}
                        </div>
                    </div>
                    <div className="Team TeamBlue">
                        <div className="Picks">
                            {state.blueTeam.picks.map(pick => <Pick {...pick} />)}
                        </div>
                        <div className={cx("Bans", {"WithScore": Window.lolcfg.scoreEnabled})}>
                            <div className="TeamName">
                                {Window.lolcfg.blueTeam.name}
                                <div className="CoachName">
                                    Coach: {Window.lolcfg.blueTeam.coach}
                                </div>
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
                                {Window.lolcfg.redTeam.name}
                                <div className="CoachName">
                                    Coach: {Window.lolcfg.redTeam.coach}
                                </div>
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

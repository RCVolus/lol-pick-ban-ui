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
import logo from '../assets/example_logo.png';

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

        const renderTeam = (teamName, teamConfig, teamState) => (
            <div className={cx('Team', teamName)}>
                <div className="Picks">
                    {teamState.picks.map(pick => <Pick {...pick} />)}
                </div>
                <div className={cx("Bans", {"WithScore": Window.lolcfg.scoreEnabled})}>
                    {teamName === 'TeamRed' && teamState.bans.map(ban => <Ban {...ban} />)}
                    <div className={cx('TeamName', {'WithoutCoaches': !Window.lolcfg.coachesEnabled})}>
                        {teamConfig.name}
                        {Window.lolcfg.coachesEnabled && <div className="CoachName">
                            Coach: {teamConfig.coach}
                        </div>}
                    </div>
                    {teamName === 'TeamBlue' && teamState.bans.map(ban => <Ban {...ban} />)}
                </div>
                {Window.lolcfg.scoreEnabled && <div className="TeamScore">
                    <div>{teamConfig.score}</div>
                </div>}
            </div>
        );

        return (
            <div className={"Overlay Europe"} style={{"--color-red": Window.lolcfg.redTeam.color, "--color-blue": Window.lolcfg.blueTeam.color}}>
                {Object.keys(state).length === 0 && <div className={"infoBox"}>Not connected to backend service!</div>}
                {Object.keys(state).length !== 0 &&
                <div className="ChampSelect">
                    {!state.leagueConnected && <div className={"infoBox"}>Not connected to client!</div> }
                    <div className="MiddleBox">
                        <div className="Logo">
                            <img src={logo} alt="" />
                        </div>
                        <div className="Patch">
                            Patch: {Window.lolcfg.patch}
                        </div>
                        <div className={cx("Timer", {
                            'Red Blue': !state.blueTeam.isActive && !state.redTeam.isActive,
                            'Blue': state.blueTeam.isActive,
                            'Red': state.redTeam.isActive
                        })}>
                            <div className={cx('Background', 'Blue')} />
                            <div className={cx('Background', 'Red')} />
                            <div className="TimerChars">
                                {state.timer.toString().split('').map(char => <div className={"TimerChar"}>{char}</div>)}
                            </div>
                        </div>
                    </div>
                    {renderTeam('TeamBlue', Window.lolcfg.blueTeam, state.blueTeam)}
                    {renderTeam('TeamRed', Window.lolcfg.redTeam, state.redTeam)}
                </div>}
            </div>
        )
    }
}

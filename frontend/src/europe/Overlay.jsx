import React from 'react';
import cx from 'classnames';
import Pick from "./Pick";

import css from './style/index.less';
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
            <div className={cx(css.Team, teamName)}>
                <div className={cx(css.Picks)}>
                    {teamState.picks.map(pick => <Pick {...pick} />)}
                </div>
                <div className={cx(css.Bans, {[css.WithScore]: Window.lolcfg.scoreEnabled})}>
                    {teamName === css.TeamRed && teamState.bans.map(ban => <Ban {...ban} />)}
                    <div className={cx(css.TeamName, {[css.WithoutCoaches]: !Window.lolcfg.coachesEnabled})}>
                        {teamConfig.name}
                        {Window.lolcfg.coachesEnabled && <div className={css.CoachName}>
                            Coach: {teamConfig.coach}
                        </div>}
                    </div>
                    {teamName === css.TeamBlue && teamState.bans.map(ban => <Ban {...ban} />)}
                </div>
                {Window.lolcfg.scoreEnabled && <div className={css.TeamScore}>
                    <div>{teamConfig.score}</div>
                </div>}
            </div>
        );

        return (
            <div className={cx(css.Overlay, css.Europe)} style={{"--color-red": Window.lolcfg.redTeam.color, "--color-blue": Window.lolcfg.blueTeam.color}}>
                {Object.keys(state).length === 0 && <div className={cx(css.infoBox)}>Not connected to backend service!</div>}
                {Object.keys(state).length !== 0 &&
                <div className={cx(css.ChampSelect)}>
                    {!state.leagueConnected && <div className={cx(css.infoBox)}>Not connected to client!</div> }
                    <div className={cx(css.MiddleBox)}>
                        <div className={cx(css.Logo)}>
                            <img src={logo} alt="" />
                        </div>
                        <div className={cx(css.Patch)}>
                            Patch: {Window.lolcfg.patch}
                        </div>
                        <div className={cx(css.Timer, {
                            [`${css.Red} ${css.Blue}`]: !state.blueTeam.isActive && !state.redTeam.isActive,
                            [css.Blue]: state.blueTeam.isActive,
                            [css.Red]: state.redTeam.isActive
                        })}>
                            <div className={cx(css.Background, css.Blue)} />
                            <div className={cx(css.Background, css.Red)} />
                            <div className={cx(css.TimerChars)}>
                                {state.timer.toString().split('').map(char => <div className={cx(css.TimerChar)}>{char}</div>)}
                            </div>
                        </div>
                    </div>
                    {renderTeam(css.TeamBlue, Window.lolcfg.blueTeam, state.blueTeam)}
                    {renderTeam(css.TeamRed, Window.lolcfg.redTeam, state.redTeam)}
                </div>}
            </div>
        )
    }
}

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
    state = {
        currentAnimationState: css.AnimationHidden
    };

    playAnimationOpening() {
        setTimeout(() => {
            this.setState({currentAnimationState: css.AnimationHidden});

            setTimeout(() => {
                this.setState({currentAnimationState: css.AnimationTimer});

                /* setTimeout(() => {
                    this.setState({currentAnimationState: css.AnimationBans});
                }, 2000); */
            }, 1200);
        }, 500);
    }

    componentDidMount() {
        this.playAnimationOpening();
    }

    render() {
        const { state, config } = this.props;
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
                    {teamState.picks.map(pick => <Pick config={this.props.config} {...pick} />)}
                </div>
                <div className={css.BansWrapper}>
                    <div className={cx(css.Bans, {[css.WithScore]: config.frontend.scoreEnabled})}>
                        {teamName === css.TeamBlue && config.frontend.scoreEnabled && <div className={css.TeamScore}>
                            {teamConfig.score}
                        </div>}
                        {teamName === css.TeamRed && teamState.bans.map(ban => <Ban {...ban} />)}
                        <div className={cx(css.TeamName, {[css.WithoutCoaches]: !config.frontend.coachesEnabled})}>
                            {teamConfig.name}
                            {config.frontend.coachesEnabled && <div className={css.CoachName}>
                                Coach: {teamConfig.coach}
                            </div>}
                        </div>
                        {teamName === css.TeamBlue && teamState.bans.map(ban => <Ban {...ban} />)}
                        {teamName === css.TeamRed && config.frontend.scoreEnabled && <div className={css.TeamScore}>
                            {teamConfig.score}
                        </div>}
                    </div>
                </div>
            </div>
        );

        console.log(this.state.currentAnimationState);

        return (
            <div className={cx(css.Overlay, css.Europe, this.state.currentAnimationState)} style={{"--color-red": config.frontend.redTeam.color, "--color-blue": config.frontend.blueTeam.color}}>
                {Object.keys(state).length === 0 && <div className={cx(css.infoBox)}>Not connected to backend service!</div>}
                {Object.keys(state).length !== 0 &&
                <div className={cx(css.ChampSelect)}>
                    {!state.leagueConnected && <div className={cx(css.infoBox)}>Not connected to client!</div> }
                    <div className={cx(css.MiddleBox)}>
                        <div className={cx(css.Logo)}>
                            <img src={logo} alt="" />
                        </div>
                        <div className={cx(css.Patch)}>
                            Patch: {config.frontend.patch}
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
                    {renderTeam(css.TeamBlue, config.frontend.blueTeam, state.blueTeam)}
                    {renderTeam(css.TeamRed, config.frontend.redTeam, state.redTeam)}
                </div>}
            </div>
        )
    }
}

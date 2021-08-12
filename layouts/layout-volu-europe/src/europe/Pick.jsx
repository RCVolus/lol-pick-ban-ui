import React from 'react';
import cx from 'classnames';

import css from './style/index.module.scss';

const Pick = props => (
    <div className={cx(css.Pick, { [css.Active]: props.isActive })}>
        {props.spell1 && props.spell2 && props.config.frontend.spellsEnabled && props.champion.name && !props.isActive && <div className={cx(css.SummonerSpells)}>
            <img src={props.spell1.icon} alt="" />
            <img src={props.spell2.icon} alt="" />
        </div>}
        <div className={cx(css.PickImage, {
            [css.Active]: props.isActive
        })}>
            <img src={props.champion.loadingImg} alt="" />
        </div>
        <div className={cx(css.PlayerName)}>
            <span>{props.displayName}</span>
        </div>
    </div>
);

export default Pick;

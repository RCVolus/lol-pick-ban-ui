import React from 'react';
import cx from 'classnames';

import css from './style/index.less';

export default props => (
    <div className={cx(css.Pick)}>
        {props.spell1 && props.spell2 && Window.lolcfg.spellsEnabled && <div className={cx(css.SummonerSpells)}>
            <img src={props.spell1.icon} alt="" />
            <img src={props.spell2.icon} alt="" />
        </div>}
        <div className={cx(css.PickImage, {
            [css.Active]: props.isActive
        })}>
            <img src={props.champion.loadingImg} alt="" />
        </div>
        <div className={cx(css.PlayerName)}>
            {props.displayName}
        </div>
    </div>
);

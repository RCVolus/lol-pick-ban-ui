import React from 'react';
import cx from 'classnames';

export default props => (
    <div className={cx('Pick')}>
        {props.spell1 && props.spell2 && Window.lolcfg.spellsEnabled && <div className="SummonerSpells">
            <img src={props.spell1.icon} alt="" />
            <img src={props.spell2.icon} alt="" />
        </div>}
        <div className={cx('PickImage', {
            'Active': props.isActive
        })}>
            <img src={props.champion.loadingImg} alt="" />
        </div>
        <div className="PlayerName">
            {props.displayName}
        </div>
    </div>
);

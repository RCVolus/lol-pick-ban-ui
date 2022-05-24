import React from 'react';
import cx from 'classnames';

import css from './style/index.module.scss';

const Bans = props => (
    <div className={cx(css.Ban)}>
        <div className={cx(css.BanImage, {
            [css.Active]: props.isActive,
            [css.Done]: props.champion.id !== 0 && !props.isActive
        })}>
            <img className={cx({ [css.Todo]: props.champion.id === 0 })} src={props.champion.squareImg} alt="" />
        </div>
    </div>
);

export default Bans;

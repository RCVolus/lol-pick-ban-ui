import React from 'react';
import cx from 'classnames';

import css from './style/index.less';

export default props => (
    <div className={cx(css.Ban)}>
        <div className={cx(css.BanImage, {
            [css.Active]: props.isActive
        })}>
            <img src={props.champion.squareImg} alt="" />
        </div>
    </div>
);

import React from 'react';
import cx from "classnames";

export default props => (
    <div className="Ban">
        <div className={cx('BanImage', {
            'Active': props.isActive
        })}>
            <img src={props.champion.squareImg} alt="" />
        </div>
    </div>
);

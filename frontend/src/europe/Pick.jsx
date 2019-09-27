import React from 'react';

export default props => (
    <div className="Pick">
        <div className="PickImage">
            <img src={props.champion.loadingImg} alt="" />
        </div>
        <div className="PlayerName">
            {props.displayName}
        </div>
    </div>
);

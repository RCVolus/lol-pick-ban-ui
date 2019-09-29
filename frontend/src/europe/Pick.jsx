import React from 'react';

export default props => (
    <div className="Pick">
        {props.spell1 && props.spell2 && Window.lolcfg.spellsEnabled && <div className="SummonerSpells">
            <img src={props.spell1.icon} alt="" />
            <img src={props.spell2.icon} alt="" />
        </div>}
        <div className="PickImage">
            <img src={props.champion.loadingImg} alt="" />
        </div>
        <div className="PlayerName">
            {props.displayName}
        </div>
    </div>
);

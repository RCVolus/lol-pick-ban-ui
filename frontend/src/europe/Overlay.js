import React from 'react';

import './europe.css';

export default class Overlay extends React.Component {
    render() {
        const { state } = this.props;
        console.log(state);

        return (
            <div className={"Overlay Europe"}>
                {Object.keys(state).length === 0 && <div className={"infoBox"}>Not connected to backend service!</div>}
                {Object.keys(state).length !== 0 &&
                <div className="ChampSelect">
                    {!state.leagueConnected && <div className={"infoBox"}>Not connected to client!</div> }
                    <div className="MiddleBox">
                        <div className="Logo">
                            [LOGO]
                        </div>
                        <div className="Timer">
                            30
                        </div>
                    </div>
                    <div className="Team TeamBlue">
                        <div className="Pick"></div>
                        <div className="Pick"></div>
                        <div className="Pick"></div>
                        <div className="Pick"></div>
                        <div className="Pick"></div>
                    </div>
                    <div className="Team TeamRed">

                    </div>
                </div>}
            </div>
        )
    }
}

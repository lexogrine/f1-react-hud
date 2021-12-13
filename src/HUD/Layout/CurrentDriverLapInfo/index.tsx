import React from 'react';
import "./index.scss";

const CurrentDriverLapInfo = ({ pos, max, current, best, sector}: { pos: number, max: number, current: number, best: number, sector: number }) => {

    return (
        <div className="current-driver-lap">
            <div className="driver-lap-pos">
                <div className="lap-text">POS</div>
                <div className="lap-separator"></div>
                <div className="lap-text">{pos}/{max}</div>
            </div>
            <div className="driver-lap-stats">
                <div className="driver-stat-container">
                    <div className="label">Current</div>
                    <div className="value">{current}</div>
                </div>
                <div className="driver-stat-container">
                    <div className="label">Best</div>
                    <div className="value">{best}</div>
                </div>
            </div>
            <div className="sectors">
                <div className={`sector ${sector === 1 ?'active':''}`}>S1</div>
                <div className={`sector ${sector === 2 ?'active':''}`}>S2</div>
                <div className={`sector ${sector === 3 ?'active':''}`}>S3</div>
            </div>
        </div>
    )
}

export default CurrentDriverLapInfo;
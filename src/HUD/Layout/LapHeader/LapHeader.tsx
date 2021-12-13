import React from 'react';
import "./index.scss";

const LapHeader = ({ lap, maxLaps }: { lap: number, maxLaps: number }) => (
    <div className="lap-header">
        <div className="lap-text">LAP</div>
        <div className="lap-separator"></div>
        <div className="lap-text">{lap}/{maxLaps}</div>
    </div>
)
export default LapHeader;
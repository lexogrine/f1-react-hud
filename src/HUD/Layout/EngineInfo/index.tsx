import React from 'react';
import './index.scss';

const EngineInfo = ({ fuelMix, frontBrakeBias, differential, ersDeploy }: { fuelMix: number, frontBrakeBias: number, differential: number, ersDeploy: number }) => {
    const fuelMixLables = ['Lean', 'Standard', 'Rich', 'Max'];
    const ersDeployLabel = ['None', 'Medium', 'Hotlap', 'Overtake'];

    return (
        <div className="engine-info">
            <div className="entry">
                <div className="label">Fuel Mix</div>
                <div className="value">[{fuelMix}] {fuelMixLables[fuelMix]}</div>
            </div>
            <div className="entry">
                <div className="label">Front Brake Bias</div>
                <div className="value">{frontBrakeBias}%</div>
            </div>
            <div className="entry">
                <div className="label">Differential</div>
                <div className="value">{differential}%</div>
            </div>
            <div className="entry">
                <div className="label">ERS Deploy</div>
                <div className="value">[{ersDeploy}] {ersDeployLabel[ersDeploy]}</div>
            </div>
        </div>
    )
}

export default EngineInfo;
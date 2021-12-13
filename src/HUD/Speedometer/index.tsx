import React from 'react';
import { ReactComponent as SpeedometerImage } from './Speedometer.svg'
import './index.scss';
const Speedometer = ({ value, label , id}: { value: string | number, label: string | number, id?: string }) => {

    return (
        <div id={id} className="speedometer-container">
            <div className='value'>
                {value}
            </div>
            <div className="label">
                {label}
            </div>
            <SpeedometerImage style={{zIndex: 0}}/>
        </div>
    )
}

export default Speedometer;
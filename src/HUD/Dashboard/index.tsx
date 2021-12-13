import React from 'react';
import { ReactComponent as DashboardBg} from './bg.svg';

const Dashboard = ({ gear }: { gear: number }) => {
    
    return (
        <div style={{width: 454, height: 160, position:'fixed', bottom: 0, display: 'flex', justifyContent:'center', right:'243px'}}>
            <div style={{zIndex:999, color:'white', textShadow: '0 0 7px white', fontSize:'45px', fontWeight:'bold', textAlign:'center', position:'relative',top:'13px'}}>{gear}</div>
            <DashboardBg style={{position:'absolute', bottom: 0}} />
        </div>
    )
}

export default Dashboard
import React from "react";
import TeamBox from "./../Players/TeamBox";
import Observed from "./../Players/Observed";
import { actions, Player } from "./../../App";
import PlayerCamera from "../Camera/Camera";
import { Pause } from "../../assets/Icons";
import LapHeader from "./LapHeader/LapHeader";
import CurrentDriverLapInfo from "./CurrentDriverLapInfo";
import EngineInfo from "./EngineInfo";
import Speedometer from "../Speedometer";
import { LapData } from "f1-2021-udp/build/src/parsers/2_LapData/types";
import { PacketSessionData } from "f1-2021-udp";
import { ParticipantData } from "f1-2021-udp/build/src/parsers/4_Participants/types";
import { LapHistoryData } from "f1-2021-udp/build/src/parsers/11_SessionHistory/types";
import Dashboard from "../Dashboard";

interface Props {
  players: Player[],
  session: PacketSessionData | null;
  match: any | null,
  amountOfParticipants: number;
}


export default class Layout extends React.Component<Props> {

  render() {
    const { players, session,amountOfParticipants } = this.props;

    const currentlyObserved = session && session.m_isSpectating ? players[session.m_spectatorCarIndex] : null;
    // Max laps in session packet
    let bestTime = 0;

    if(currentlyObserved && currentlyObserved.playerSessionHistory){
      let fastestLap: LapHistoryData | null = null;
      for(const lapHistoryData of currentlyObserved.playerSessionHistory.m_lapHistoryData){
        if(bestTime === 0 || (lapHistoryData.m_lapTimeInMS < bestTime && lapHistoryData.m_lapTimeInMS !== 0)){
          bestTime = lapHistoryData.m_lapTimeInMS;
        }
      }
    }
    return (
      <div className="layout">
        { currentlyObserved && currentlyObserved.playerCarTelemetry ? <Dashboard gear={currentlyObserved.playerCarTelemetry.m_gear} /> : null }
        { currentlyObserved && currentlyObserved.playerCarTelemetry ? <Speedometer value={currentlyObserved.playerCarTelemetry.m_engineRPM} label={'RPM'} id="rpm-meter" /> : null}
        { currentlyObserved && currentlyObserved.playerCarTelemetry ? <Speedometer value={currentlyObserved.playerCarTelemetry.m_speed} label={'KPH'} id="kph-meter" /> : null }
        { currentlyObserved && currentlyObserved.playerLap ? <LapHeader lap={currentlyObserved.playerLap.m_currentLapNum} maxLaps={session && session.m_totalLaps || 5} /> : null }
        { currentlyObserved && currentlyObserved.playerLap ? <CurrentDriverLapInfo pos={currentlyObserved.playerLap.m_carPosition} max={amountOfParticipants} current={currentlyObserved.playerLap.m_currentLapTimeInMS} best={bestTime} sector={currentlyObserved.playerLap.m_sector+1} /> : null }
        { currentlyObserved && currentlyObserved.playerCarStatus ? <EngineInfo fuelMix={currentlyObserved.playerCarStatus.m_fuelMix} frontBrakeBias={currentlyObserved.playerCarStatus.m_frontBrakeBias} differential={85} ersDeploy={currentlyObserved.playerCarStatus.m_ersDeployMode} /> : null }
      </div>
    );
  }
}

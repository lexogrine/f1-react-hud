import React from "react";
import TeamBox from "./../Players/TeamBox";
import Observed from "./../Players/Observed";
import { actions } from "./../../App";
import PlayerCamera from "../Camera/Camera";
import { PacketLapData, PacketSessionData, PacketParticipantsData, ParticipantData, LapData } from "../../api/interfaces";
import { Pause } from "../../assets/Icons";

interface Props {
  lap: LapData[] ,
  session: PacketSessionData | null,
  participants: ParticipantData[],
  match: any | null
}


export default class Layout extends React.Component<Props> {

  render() {
    const { lap, session, participants } = this.props;

    return (
      <div className="layout">
      </div>
    );
  }
}

import React from 'react';
import Layout from './HUD/Layout/Layout';
import api, { port, isDev } from './api/api';
import { loadAvatarURL } from './api/avatars';
import ActionManager, { ConfigManager } from './api/actionManager';
import Socket from 'socket.io-client';
import { Match } from './api/interfaces';
import { initiateConnection } from './HUD/Camera/mediaStream';
import { lap, participants } from './mockData';
import { PacketCarStatusData, PacketCarTelemetryData, PacketLapData, PacketParticipantsData, PacketSessionData, PacketSessionHistoryData } from 'f1-2021-udp/build/src/parsers/types';
import { LapData } from 'f1-2021-udp/build/src/parsers/2_LapData/types';
import { CarStatusData } from 'f1-2021-udp/build/src/parsers/7_CarStatus/types';
import { CarTelemetryData } from 'f1-2021-udp/build/src/parsers/6_CarTelemetry/types';
export const actions = new ActionManager();
export const configs = new ConfigManager();

//export const { GSI, socket } = GSISocket(isDev ? `localhost:${port}` : '/', "update");
export const socket = Socket(`localhost:${port}`);

export const hudIdentity = {
	name: '',
	isDev: false
};

export interface Player {
    m_aiControlled: number;
    m_driverId: number;
    m_networkId: number;
    m_teamId: number;
    m_myTeam: number;
    m_raceNumber: number;
    m_nationality: number;
    m_name: string;
    m_yourTelemetry: number;

	
	playerLap: LapData | null,
	playerCarStatus: CarStatusData | null,
	playerCarTelemetry: CarTelemetryData | null,
	playerSessionHistory: PacketSessionHistoryData | null,
}

interface IState {
	match: Match | null,
	lap: PacketLapData | null,
	session: PacketSessionData | null,
	carStatus: PacketCarStatusData | null,
	carTelemetry: PacketCarTelemetryData | null,
	participants: PacketParticipantsData | null,
	sessionHistory: PacketSessionHistoryData[],
	steamids: string[],
	checked: boolean
}

class App extends React.Component<any, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			lap: null,
			session: null,
			carStatus: null,
			carTelemetry: null,
			sessionHistory: [],
			participants: null,
			steamids: [],
			match: null,
			checked: false
		}
	}

	/*verifyPlayers = async (game: CSGO) => {
		const steamids = game.players.map(player => player.steamid);
		steamids.forEach(steamid => {
			loadAvatarURL(steamid);
		})

		if (steamids.every(steamid => this.state.steamids.includes(steamid))) {
			return;
		}

		const loaded = GSI.players.map(player => player.steamid);

		const notCheckedPlayers = steamids.filter(steamid => !loaded.includes(steamid));

		const extensioned = await api.players.get(notCheckedPlayers);

		const lacking = notCheckedPlayers.filter(steamid => extensioned.map(player => player.steamid).includes(steamid));

		const players: PlayerExtension[] = extensioned
			.filter(player => lacking.includes(player.steamid))
			.map(player => (
				{
					id: player._id,
					name: player.username,
					realName: `${player.firstName} ${player.lastName}`,
					steamid: player.steamid,
					country: player.country,
					avatar: player.avatar,
					extra: player.extra,
				})
			);

		const gsiLoaded = GSI.players;

		gsiLoaded.push(...players);
		
		GSI.players = gsiLoaded;
		this.setState({ steamids });
	}*/


	componentDidMount() {
		//this.loadMatch();
		const href = window.location.href;
		socket.emit("started");
		let isDev = false;
		let name = '';
		if (href.indexOf('/huds/') === -1) {
			isDev = true;
			name = (Math.random() * 1000 + 1).toString(36).replace(/[^a-z]+/g, '').substr(0, 15);
			hudIdentity.isDev = true;
		} else {
			const segment = href.substr(href.indexOf('/huds/') + 6);
			name = segment.substr(0, segment.lastIndexOf('/'));
			hudIdentity.name = name;
		}

		socket.on("readyToRegister", () => {
			socket.emit("register", name, isDev, 'f1');
			initiateConnection();
		});
		socket.on(`hud_config`, (data: any) => {
			configs.save(data);
		});
		socket.on(`hud_action`, (data: any) => {
			actions.execute(data.action, data.data);
		});
		socket.on('keybindAction', (action: string) => {
			actions.execute(action);
		});

		socket.on("refreshHUD", () => {
			window.top.location.reload();
		});

		const verifyMatch = () => {
			//if (!this.state.checked) this.loadMatch();
		}
		socket.on("update", ({ type, data }: { type: 'participants'| 'session' | 'lapData' | 'carStatus' | 'carTelemetry' | 'sessionHistory', data: any }) => {
			if (type === "lapData") this.setState({ lap: data }, verifyMatch);
			else if (type === "session") this.setState({ session: data }, verifyMatch);
			else if (type === "carStatus") this.setState({ carStatus: data }, verifyMatch);
			else if (type === "carTelemetry") this.setState({ carTelemetry: data }, verifyMatch);
			else if (type === "sessionHistory") {
				const sessionHistoryIndex = this.state.sessionHistory.findIndex(sessionHistory => sessionHistory.m_carIdx === (data as PacketSessionHistoryData).m_carIdx);
				if(sessionHistoryIndex === -1){
					this.setState({ sessionHistory: [...this.state.sessionHistory, data] });
					return;
				}
				const newSessionHistory = [...this.state.sessionHistory];
				newSessionHistory[sessionHistoryIndex] = data;
				this.setState({ sessionHistory: newSessionHistory }, verifyMatch);
			}
			else if (type === "participants") this.setState({ participants: data }, verifyMatch);
		});
		/*socket.on('match', () => {

			this.loadMatch(true);
		});*/

	}

	/*loadMatch = async (force = false) => {
		if (!dataLoader.match || force) {
			dataLoader.match = new Promise((resolve) => {
				api.match.getCurrent().then(match => {
					if (!match) {
						//dataLoader.match = null;
						return;
					}
					this.setState({ match });

					let isReversed = false;
					if (GSI.last) {
						const mapName = GSI.last.map.name.substring(GSI.last.map.name.lastIndexOf('/') + 1);
						const current = match.vetos.filter(veto => veto.mapName === mapName)[0];
						if (current && current.reverseSide) {
							isReversed = true;
						}
						this.setState({ checked: true });
					}
					if (match.left.id) {
						api.teams.getOne(match.left.id).then(left => {
							const gsiTeamData = { id: left._id, name: left.name, country: left.country, logo: left.logo, map_score: match.left.wins, extra: left.extra };

							if (!isReversed) {
								GSI.teams.left = gsiTeamData;
							}
							else GSI.teams.right = gsiTeamData;
						});
					}
					if (match.right.id) {
						api.teams.getOne(match.right.id).then(right => {
							const gsiTeamData = { id: right._id, name: right.name, country: right.country, logo: right.logo, map_score: match.right.wins, extra: right.extra };

							if (!isReversed) GSI.teams.right = gsiTeamData;
							else GSI.teams.left = gsiTeamData;
						});
					}



				}).catch(() => {
					//dataLoader.match = null;
				});
			});
		}
	}*/
	render() {
		//if (!this.state.session) return null;
		const { lap, session, carStatus, carTelemetry, participants, sessionHistory} = this.state;

		if(!participants || !participants.m_participants) return null;

		const players: Player[] = participants.m_participants.map((participant, index) => {
			const playerLap = (lap && lap.m_lapData[index]) || null;
			const playerCarStatus = (carStatus && carStatus.m_carStatusData[index]) || null;
			const playerCarTelemetry = (carTelemetry && carTelemetry.m_carTelemetryData[index]) || null;
			const playerSessionHistory = sessionHistory[index] || null;

			return ({
				...participant,
				playerLap,
				playerCarStatus,
				playerCarTelemetry,
				playerSessionHistory
			})
		})

		return (
			<Layout
				match={null}
				players={players}
				session={session}
				amountOfParticipants={participants.m_numActiveCars}
			/>
		);
	}

}
export default App;

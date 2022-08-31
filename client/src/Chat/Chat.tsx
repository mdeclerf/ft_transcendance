import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { VerticalTabs } from '../Components/VerticalTabs';
import { getIsBlocked } from '../utils/api';
import { socket } from '../socket';
import { useFetchCurrentUser } from '../utils/hooks/useFetchCurrentUser';
import { fetchRoomMessages, fetchRooms, leaveChat, sendMessage, subscribeToDeleteRoom, subscribeToMessages, subscribeToNewRoom, subscribeToRoomUserJoin, subscribeToRoomUserLeave, subscribeToRoomUserList, subscribeToUpdateRoom, switchRoom } from '../utils/socket_helpers';
import { CenteredDiv } from '../utils/styles';
import { Message, Room, User } from '../utils/types';

export interface IChatProps {
	socketLoading: boolean;
}

export function Chat (props: IChatProps) {

	const { socketLoading } = props;
	const { user } = useFetchCurrentUser();
	const [message, setMessage] = useState("");
	const [room, setRoom] = useState<Room>({ name: "general", type: 'public' });
	const [rooms, setRooms] = useState<Room[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [messagesLoading, setMessagesLoading] = useState(true);
	const [roomsLoading, setRoomsLoading] = useState(true);
	const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
	const [ owner, setOwner ] = useState<boolean>(false);
	const [ admin, setAdmin ] = useState<boolean>(false);
	const [ mute, setMute ] = useState<boolean>(false);
	const [ banned, setBanned ] = useState(false);

	const prevRoomRef = useRef<Room>();
	useEffect(() => {
		prevRoomRef.current = room;
	}, [room, prevRoomRef]);
	const prevRoom = prevRoomRef.current;

	useEffect(() => {
		return (() => {
			leaveChat(room.name);
		})
	}, [room.name]);

	useEffect(() => {
		getChatUserStatus().then((res) => {
			const currentTime = new Date();
			if (res) {
				setBanned(false);
				setAdmin(false);
				setOwner(false);
				setMute(false);
				if (res.status === 'owner') {
					setOwner(true);
					setAdmin(true);
				}
				if (res.status === 'admin')
					setAdmin(true);
				if (res.status === 'muted') {
					if (res.time) {
						setTimeout(() => {
							setMute(false);
							console.log('UNMUTED');
						}, (res.time.getTime() - currentTime.getTime()));
					}
					setMute(true);
				}
				if (res.status === 'banned') {
					if (res.time) {
						setTimeout(() => {
							setBanned(false);
						}, (res.time.getTime() - currentTime.getTime()));
					}
					setBanned(true);
				}
			}
		});

		if (!socketLoading) {
			if (prevRoom && room) {
				switchRoom(prevRoom.name, room.name);
				setRoom(room);
			}
		}
	// eslint-disable-next-line
	}, [room, socketLoading, owner, prevRoom]);

	// get available rooms
	useEffect(() => {
		fetchRooms().then((res: Room[]) => {
			setRooms(res);
			setRoomsLoading(false);
		});

		subscribeToMessages((data) => {
			getIsBlocked(data.user.id)
			.then((res) => {
				if (!res.data) {
					setMessages((messages) => [...messages, data]);
				}
			});
		});

		subscribeToRoomUserList((data) => {
			setConnectedUsers([]);
			setConnectedUsers(data);
		});
		
		subscribeToRoomUserJoin((data) => {
			setConnectedUsers((users) => [...users, data]);
		});
		
		subscribeToRoomUserLeave((data) => {
			setConnectedUsers((users) => users.filter(user => user && data && user.id !== data.id));
		});

		subscribeToNewRoom((data) => {
			setRooms((oldRooms) => [...oldRooms, data]);
		});

		subscribeToUpdateRoom((data) => {
			setRooms((currRooms) => {
				const nextRooms = [...currRooms];
				for (const room of nextRooms) {
					if (room.name === data.name) {
						room.name = data.name;
						room.type = data.type;
						room.DM_user = data.DM_user;
					}
				}
				return nextRooms;
			})
		});

		subscribeToDeleteRoom((data) => {
			setRooms((currRooms) => {
				const nextRooms = [...currRooms];
				const idx = nextRooms.findIndex(room => room.name === data.name);
				if (idx > -1) nextRooms.splice(idx, 1);
				return nextRooms;
			})
			handleSwitchRoom({ name: 'general', type: 'public'});
		})
	// eslint-disable-next-line
	}, []);

	// get messages for currently set room
	useEffect(() => {
		setMessages([]);
		setMessagesLoading(true);

		fetchRoomMessages('general').then((res: Message[]) => {
			setMessages(res);
			setMessagesLoading(false);
		});
	}, []);

	useEffect(() => {
		handleAdmin(room.name);
		handleMuted(room.name);
		handleUser(room.name);
	// eslint-disable-next-line
	}, [admin]);
	
	const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(event.target.value);
	}

	const handleMuted = (name: string) => {
		socket.on('muted_added', (data: { name: string, time: string}) => {
			console.log(`name: ${name} | data.name: ${data.name} | data.time: ${data.time}`);
			if (name === data.name) {
				setMute(true);
				setTimeout(() => {
					setMute(false);
					console.log('UNMUTED');
				}, parseInt(data.time));
			}
		})
	}

	const handleBanned = (name: string) => {
		socket.on('banned_added', data => {
			if (name === data) {
				setBanned(true);
			}
		})
	}

	const handleUser = (name: string) => {
		socket.on('user_added', data => {
			if (name === data) {
				setMute(false);
				setAdmin(false);
			}
		})
	}

	const handleAdmin = (name: string) => {
		socket.on('admin_added', data => {
			if (name === data) {
				setAdmin(true);
			}
		})
	}

	const handleMessageSend = () => {
		if (!message || !user) return;

		const data: Message = { room: room, body: message, user };
		setMessages((messages) => [...messages, data]);
		sendMessage(data);
		setMessage("");
	}

	const handleSwitchRoom = (targetRoom: Room) => {	
		setOwner(false);
		setMessages([]);
		setMessagesLoading(true);

		fetchRoomMessages(targetRoom.name).then((res: Message[]) => {
			setMessages(res);
			setMessagesLoading(false);
		});
		setRoom(targetRoom);
	}

	async function getChatUserStatus() {
		if (user && room)
		{
			const response = await axios.get<{ status: string, time: Date}>(`http://localhost:3001/api/chat/rooms/${room.name}/${user.username}/get_chat_user_status`, { withCredentials: true });
			if (response)
				return response.data;
		}
		else
			return ;
	}

	if (roomsLoading) return <CenteredDiv><CircularProgress /></CenteredDiv>

	return (
		<VerticalTabs
			mute={mute}
			room={room}
			admin={admin}
			owner={owner}
			rooms={rooms}
			message={message}
			messages={messages}
			currentUser={user}
			switchRooms={handleSwitchRoom}
			messagesLoading={messagesLoading}
			messageChange={handleMessageChange}
			messageSend={handleMessageSend}
			roomUsers={connectedUsers}
		/>
	);
}

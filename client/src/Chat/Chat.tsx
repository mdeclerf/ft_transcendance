import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { VerticalTabs } from '../Components/VerticalTabs';
import { socket } from '../socket';
import { useFetchCurrentUser } from '../utils/hooks/useFetchCurrentUser';
import { fetchRoomMessages, fetchRooms, joinChat, leaveChat, sendMessage, subscribeToMessages, subscribeToNewRoom, subscribeToRoomUserJoin, subscribeToRoomUserLeave, subscribeToRoomUserList, switchRoom } from '../utils/socket_helpers';
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
	const [ owner, setOwner ] = React.useState<boolean>(false);
	const [ admin, setAdmin ] = React.useState<boolean>(false);

	const prevRoomRef = useRef<Room>();
	useEffect(() => {
		prevRoomRef.current = room;
	});
	const prevRoom = prevRoomRef.current;

	useEffect(() => {
		return (() => {
			leaveChat(room.name);
		})
	// eslint-disable-next-line
	}, [])

	// switch switch room in the backend when it changes in the frontend
	useEffect(() => {
		amIOwner().then((res: boolean) => {
			setOwner(res);
		});
		if (!socketLoading) {
			if (prevRoom && room) {
				switchRoom(prevRoom.name, room.name);
				setRoom(room);
			} else if (room) {
				joinChat(room.name);
				// amIOwner();
			}
		}
	// eslint-disable-next-line
	}, [room, socketLoading, owner]);

	// get available rooms
	useEffect(() => {
		fetchRooms().then((res: Room[]) => {
			setRooms(res);
			setRoomsLoading(false);
		});

		subscribeToMessages((data) => {
			setMessages((messages) => [...messages, data]);
		});

		subscribeToRoomUserList((data) => {
			setConnectedUsers([]);
			setConnectedUsers(data);
		});
		
		subscribeToRoomUserJoin((data) => {
			setConnectedUsers((users) => [...users, data]);
		});
		
		subscribeToRoomUserLeave((data) => {
			setConnectedUsers((users) => users.filter(user => user && user.id !== data.id));
		});

		subscribeToNewRoom((data) => {
			setRooms((oldRooms) => [...oldRooms, data]);
		});
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
		socket.on('admin_added', data => {
			setAdmin(true);
		})
	}, [admin]);

	const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(event.target.value);
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

	async function amIOwner(): Promise<boolean> {
		if (user && room)
		{
			const response = await axios.get<string>(`http://localhost:3001/api/chat/rooms/${room.name}/${user.username}/get_chat_user_status`, { withCredentials: true });
			if (response && response.data === 'owner')
				return (true);
			else
				return (false);
		}
		else
			return (false);
	}

	if (roomsLoading) return <CenteredDiv><CircularProgress /></CenteredDiv>

	return (
		<VerticalTabs
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

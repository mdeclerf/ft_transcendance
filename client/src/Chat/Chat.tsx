import { CircularProgress } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { VerticalTabs } from '../Components/VerticalTabs';
import { useFetchCurrentUser } from '../utils/hooks/useFetchCurrentUser';
import { fetchRoomMessages, fetchRooms, initiateSocket, sendMessage, subscribeToMessages, subscribeToRoomUserJoin, subscribeToRoomUserLeave, subscribeToRoomUserList, switchRoom } from '../utils/socket_helpers';
import { CenteredDiv } from '../utils/styles';
import { Message, Room, User } from '../utils/types';

export interface IChatProps {
}

export function Chat (props: IChatProps) {
	const { user } = useFetchCurrentUser();
	const [message, setMessage] = useState("");
	const [room, setRoom] = useState<Room>({ name: "General" });
	const [rooms, setRooms] = useState<Room[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [messagesLoading, setMessagesLoading] = useState(true);
	const [roomsLoading, setRoomsLoading] = useState(true);
	const [connectedUsers, setConnectedUsers] = useState<User[]>([]);

	const prevRoomRef = useRef<Room>();
	useEffect(() => {
		prevRoomRef.current = room;
	});
	const prevRoom = prevRoomRef.current;

	// switch switch room in the backend when it changes in the frontend
	useEffect(() => {
		if (prevRoom && room) {
			switchRoom(prevRoom.name, room.name);
			setRoom(room);
		} else if (room) {
			initiateSocket(room.name);
		}
	// eslint-disable-next-line
	}, [room]);

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
			setConnectedUsers((users) => users.filter(user => user.id !== data.id));
		});
	}, []);

	// get messages for currently set room
	useEffect(() => {
		setMessages([]);
		setMessagesLoading(true);

		fetchRoomMessages(room.name).then((res: Message[]) => {
			setMessages(res);
			setMessagesLoading(false);
		});
	// eslint-disable-next-line
	}, []);

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
		setMessages([]);
		setMessagesLoading(true);

		fetchRoomMessages(targetRoom.name).then((res: Message[]) => {
			setMessages(res);
			setMessagesLoading(false);
		});
		setRoom(targetRoom);
	}

	if (roomsLoading) return <CenteredDiv><CircularProgress /></CenteredDiv>

	return (
		<VerticalTabs
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

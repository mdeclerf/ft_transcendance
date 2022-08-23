import axios from "axios";
import { socket } from "../socket";
import { Message, Room } from "./types";

export const initiateSocket = (room: string) => {
	if (socket && room) {
		socket.emit('room_join', room);
	}
};

export const switchRoom = (prevRoom: string, room: string) => {
	if (socket) {
		socket.emit("room_switch", { prevRoom, room });
	}
};

export const subscribeToMessages = (callback: (data: Message) => void) => {
	if (!socket) return;

	socket.on('new_message', (data) => {
		callback(data);
		console.log(data);
	});
};

export const sendMessage = (data: Message) => {
	if (!socket) return;

	socket.emit('message_send', data);
};

export const fetchRooms = async () => {
	const response = await axios.get<Room[]>('http://localhost:3001/api/chat/get_rooms', { withCredentials: true });

	return response.data;
};

export const fetchRoomMessages = async (room: string) => {
	const response = await axios.get<Message[]>(`http://localhost:3001/api/chat/rooms/${room}/messages`, { withCredentials: true });

	return response.data;
}
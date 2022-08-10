import './Chat.css';
import { useEffect, useRef, useState } from "react";
import { Box, Paper } from '@mui/material';
import { TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { useFetchCurrentUser } from "../utils/hooks/useFetchCurrentUser";
import { ChatResponse, ChatRoom, Message, MessageGroup } from '../utils/types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ChatMsg } from '../Components/ChatMsg';
import { socket } from '../socket';

// BULLES DE MESSAGES
// const customBubble = (props: any) => (
// 	<div className="imessage">
// 	<p className={`${props.message.id ? "from-them" : "from-me"}`}>{props.message.message}</p>
// 	</div>
// );

function Chat(props: any) {
	const { user } = useFetchCurrentUser();
	const [room, setRoom] = useState<string>("General");
	const [message, setMessage] = useState<string>("");
	const [allMessages, setAllMessages] = useState<Message[]>([]);
	const [rooms, setRooms] = useState<string[]>([]);

	const chatBoxRef = useRef<HTMLInputElement>(null);

	// INITIALISATION DES CHANNELS ET REJOINDRE LE CHANNEL 0
	// if (rooms.length === 0)
	// {
	// 	socket.emit("handle_connect_test");
	// 	socket.emit("chat_get_room");
	// 	socket.emit("chat_join_room", "General");
	// }

	// SEND MESSAGE
	const sendMessage = () => {
		console.log(room);
		socket.emit('chat_send_message', { message, room, user });
		socket.emit("chat_get_room");
	};

	// JOIN A ROOM
	const joinRoom = () => {
		setOpenDialog(false);
		if (room !== "") {
			socket.emit("chat_join_room", room);
		}
	};

	// JOIN A CHANNEL VIA LE BOUTON
	const joinChannel = (room_name: string) => {
		if (room === room_name)
			return;
		setRoom(room_name);
		socket.emit("chat_join_room", room_name);
	};
	
	// SEND THE MESSAGE AND RESET (due to the onClick accepting only one function)
	// function send_and_reset()
	// {
	// 	if (message !== "")
	// 		sendMessage();
	// 	reset();
	// }

	useEffect(() => {
		console.log('Chat page loaded');
		socket.emit('chat_connect')

		return () => {
			console.log('Chat page unloaded');
		}
	}, [])

	// DEAL WITH EVENTS
	useEffect(() => {

		// function handleReceived(data:any) {
		// 	setAllMessages([...allMessages,
		// 		new Message({
		// 			id: 1,
		// 			message: data.body,
		// 			senderName: data.user.username //todo
		// 		}),
		// 	])
		// 	socket.emit("chat_get_room");
		// }

		// function handleJoined(data: ChatResponse[]) {
		// 	if (room === "")
		// 		setRoom("General");
		// 	allMessages.splice(0, allMessages.length);
		// 	setAllMessages([]);
		// 	for (const chatEntry of data) {
		// 		if (chatEntry.user.id === user?.id) {
		// 			allMessages.push(new Message ({
		// 				id: 0,
		// 				message: chatEntry.body,
		// 				senderName: chatEntry.user.username
		// 			}));
		// 			setAllMessages([...allMessages]);
		// 		}
		// 		else {
		// 			allMessages.push(new Message ({
		// 				id: 1,
		// 				message: chatEntry.body,
		// 				senderName: chatEntry.user.username
		// 			}));
		// 			setAllMessages([...allMessages]);
		// 		}
		// 	}
		// }

		function handleReceived(data: ChatResponse) {
			if (user) {
				const side = (data.user.id === user.id) ? 'right' : 'left';
				const tmp: Message = {side, message: data.body, sender: data.user};
				setAllMessages(oldMessages => [...oldMessages, tmp]);
			}
			socket.emit("chat_get_room");
		}

		function handleJoined(data: ChatResponse[]) {
			for (const chatEntry of data) {
				if (user) {
					const side = (chatEntry.user.id === user.id) ? 'right' : 'left';
					const tmp: Message = { side, message: chatEntry.body, sender: chatEntry.user};
					setAllMessages(oldMessages => [...oldMessages, tmp]);
				}
			}
		}

		function handleConnected(data: ChatRoom[]) {
			// socket.emit("chat_join_room", "General")
			setRooms(data.map((room) => { return (room.name) }));
		}

		function handleSetRoom(data: ChatRoom[]) {
			setRooms(data.map((room) => { return (room.name) }));
		}

		// RECEPTION DE MESSAGES
		socket.on("chat_receive_message", (data:any) => {
			handleReceived(data);
		});

		// JOIN ROOM
		socket.on("chat_joined_room", (data: ChatResponse[]) => {
			handleJoined(data);
		});

		//CONNECTION DU CLIENT
		socket.on("chat_connected", (data: ChatRoom[]) => {
			console.log("test");
			console.log('data from back: ', data);
			handleConnected(data);
		});

		socket.on("chat_set_rooms", (data: ChatRoom[]) => {
			handleSetRoom(data);
		})

		return () => {
			socket.off();
		}
	})

	// RESET THE FORM
	// function reset() {
	// 	(document.getElementById("textareaInput") as HTMLFormElement).reset();
	// 	setMessage('');
	// }

	const loadChannels = rooms.map((room_name: string, i: number) => {
		// console.log(`[${i}]: '${room_name}'`);
		// console.log(i);

		return (
			<Button  sx={{mt:0.5}} variant="contained" size="large" fullWidth={true} key={i} onClick={() => joinChannel(room_name)}>
				{room_name}
			</Button>
		)
	})

	const [openDialog, setOpenDialog] = useState(false);

	const handleClickOpen = () => {
		setOpenDialog(true);
	};

	const handleClose = () => {
		setOpenDialog(false);
	};

	const mapChatBubbles = () => {
		const msgGrp: MessageGroup[] = [];
		console.log(`allmessages: `, allMessages);
		for (let i = 0; i < allMessages.length; i++) {
			if (i !== 0) console.log(`${allMessages[i].sender.username} - ${allMessages[i - 1].sender.id !== allMessages[i].sender.id}`);
			if (i === 0 || allMessages[i - 1].sender.id !== allMessages[i].sender.id) {
				msgGrp.push({ side: allMessages[i].side, messages: [allMessages[i].message], sender: allMessages[i].sender});
			} else {
				msgGrp[msgGrp.length - 1].messages.push(allMessages[i].message);
			}
		}

		console.log('msgGrp: ', msgGrp);

		return msgGrp.map((msg) => {
			return (
				<ChatMsg
					avatar={msg.side === 'left' ? msg.sender.photoURL : ''}
					messages={msg.messages}
					side={msg.side}
				/>
			)
		})
	}

	// RETURN TO RENDER
	return (
	<>
		{/* colonnes */}
		<div className="columns">
			{/* colonne de gauche */}
			<div className="col1">
				<Paper sx={{
					width: "100%",
					height: "calc(100vh - 64px)",
					position: "relative",
					backgroundColor: "rgba(0, 0, 0, 0)",
					overflowY: "scroll",
					padding: "0"
				}}>
					{/* bouton pour ouvrir dialogue (fenetre pour entre room name) public */}
					<Button fullWidth={true} variant="contained" size="large" onClick={handleClickOpen}>Create Public Room</Button>
					<Dialog open={openDialog} onClose={handleClose}>
						<DialogTitle>Create a public room</DialogTitle>
						<DialogContent>
							<DialogContentText>Please enter a room name : </DialogContentText>
							<TextField
								autoFocus
								margin="dense"
								type="text"
								fullWidth
								variant="standard"
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setRoom(event.target.value);
								}}
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose}>Cancel</Button>
							<Button onClick={joinRoom}>Create Room</Button>
						</DialogActions>
					</Dialog>
					{/* bouton pour ouvrir dialogue (fenetre pour entre room name et password) private */}
					{/*<Button onClick={joinRoom} fullWidth={true} variant="contained" size="large"> Create Private Room</Button>*/}
					{/* affichage des channels dispo et creation d un bouton / room */}
					<>
						{ loadChannels }
					</>
				</Paper>
			</div>
			{/* colonne de droite */}
			<div className="col2">
				<Paper sx={{
					width: "100%",
					height: "calc(100vh - 64px)",
					position: "relative",
					backgroundColor: "rgba(0, 0, 0, 0)",
					padding: "0"
				}}>
					{/* papier pour l historique des messages */}
					<Paper id="style-1" sx={{
						width: "100%",
						margin: 0,
						height: "calc( 100% - 80px )",
						backgroundColor: "rgba(0, 0, 0, 0)",
						display: "flex",
						flexDirection: "column"
					}}>
						{/* gestion de l'historique des messages */}
						{mapChatBubbles()}
					</Paper>
					<>
						{/* formulaire pour envoyer un message */}
						<Box sx={{
							display: "flex",
							minWidth: "0",
							justifyContent: "center",
							width: "100%",
							paddingTop: "1vh",
							margin: `0`,
						}}>
							<TextField
								ref={chatBoxRef}
								placeholder='Type your message'
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setMessage(event.target.value);
								}}
								// si on presse enter, le message s'envoie et le formulaire se vide
								onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
									if (event.key === 'Enter')
									{
										if (message !== "")
											sendMessage();
										event.target.value = '';
										setMessage('');
									}
								}}
							/>
							{/* bouton d'envoi de messages */}
							<Button
								onClick={() => {
									if (message !== '') sendMessage();
									if (chatBoxRef.current !== null) chatBoxRef.current.value = '';
									setMessage('');
								}}>
								<SendIcon />
							</Button>
						</Box>
					</>
				</Paper>
			</div>  
		</div>
	</>
	);
}

export default Chat;
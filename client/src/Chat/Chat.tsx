import './Chat.css';
import { useEffect, useState } from "react";
import { ChatFeed, Message } from "react-chat-ui";
import { Paper } from '@mui/material';
import { TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { Socket } from 'socket.io-client';
import { useFetchCurrentUser } from "../utils/hooks/useFetchCurrentUser";
import { ChatResponse, ChatRooms } from '../utils/types';
import { useStyles } from './styles'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// BULLES DE MESSAGES
const customBubble = (props: any) => (
	<div className="imessage">
	<p className={`${props.message.id ? "from-them" : "from-me"}`}>{props.message.message}</p>
	</div>
);

function Chat(props: any) {
	const socket: Socket = props.socket;
	const classes = useStyles();
	const { user } = useFetchCurrentUser();
	const [room, setRoom] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [allMessages, setAllMessages] = useState<Array<Message>>([]);
	const [rooms, setRooms] = useState<Array<string>>([]);

	// INITIALISATION DES CHANNELS ET REJOINDRE LE CHANNEL 0
	if (rooms.length === 0)
	{
		socket.emit("handle_connect_test");
		socket.emit("chat_get_room");
		socket.emit("chat_join_room", "General");
	}

	// SEND MESSAGE
	const sendMessage = () => {
		socket.emit('chat_send_message', { message, room, user });
			setAllMessages([...allMessages,
				new Message({
					id: 0,
					message: message,
					senderName: user?.username
				}),
		])
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
		setRoom(room_name);
		socket.emit("chat_join_room", room_name);
	};
	
	// SEND THE MESSAGE AND RESET (due to the onClick accepting only one function)
	function send_and_reset()
	{
		if (message !== "")
			sendMessage();
		reset();
	}

	// DEAL WITH EVENTS
	useEffect(() => {

		function handleReceived(data:any) {
			setAllMessages([...allMessages,
				new Message({
					id: 1,
					message: data.body,
					senderName: data.user.username //todo
				}),
			])
			socket.emit("chat_get_room");
		}

		function handleJoined(data: ChatResponse[]) {
			if (room === "")
				setRoom("General");
			allMessages.splice(0, allMessages.length);
			setAllMessages([]);
			for (const chatEntry of data) {
				if (chatEntry.user.id === user?.id) {
					allMessages.push(new Message ({
						id: 0,
						message: chatEntry.body,
						senderName: chatEntry.user.username
					}));
					setAllMessages([...allMessages]);
				}
				else {
					allMessages.push(new Message ({
						id: 1,
						message: chatEntry.body,
						senderName: chatEntry.user.username
					}));
					setAllMessages([...allMessages]);
				}
			}
		}

		function handleConnected(data: ChatRooms[]) {
			if (room === "")
				socket.emit("chat_join_room", "General");
			for (const tmp of data) {
				setRooms(oldRooms => [...oldRooms, tmp.name]);
			}
			console.log(rooms);
		}

		function handleSetRoom(data:ChatRooms[]) {
			rooms.splice(0, rooms.length);
			setRooms([]);
			for (const tmp of data) {
				setRooms(oldRooms => [...oldRooms, tmp.name]);
			}
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
		socket.on("chat_connected", (data: ChatRooms[]) => {
			console.log(data);
			handleConnected(data);
		});

		socket.on("chat_set_rooms", (data: ChatRooms[]) => {
			handleSetRoom(data);
		})

		return () => {
			socket.off();
		}
	// eslint-disable-next-line
	}, [message, allMessages, room, rooms])
	
	// RESET THE FORM
	function reset() {
		(document.getElementById("textareaInput") as HTMLFormElement).reset();
		setMessage('');
	}

	const loadChannels = rooms.map((room_name: string) => {
		return (
			<Button  sx={{mt:0.5}} variant="contained" size="large" fullWidth={true} key={room_name} onClick={() =>joinChannel(room_name)}>
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

	// RETURN TO RENDER
	return (
	<>
		{/* colonnes */}
		<div className="columns">
			{/* colonne de gauche */}
			<div className="col1">
				<Paper className={classes.paper}>
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
								onChange={(event: any) => {
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
				<Paper className={classes.paper2}>
					{/* papier pour l historique des messages */}
					<Paper id="style-1" className={classes.messagesBody}>
						{/* gestion de l'historique des messages */}
						<ChatFeed
							messages={allMessages} // Boolean: list of message objects
							isTyping={false} // Boolean: is the recipient typing
							hasInputField={false} // Boolean: use our input, or use your own
							showSenderName={true} // show the name of the user who sent the message
							bubblesCentered={true} //Boolean should the bubbles be centered in the feed?
							chatBubble={true && customBubble} // JSON: Custom bubble styles
						/>
					</Paper>
					<>
						{/* formulaire pour envoyer un message */}
						<form className={classes.wrapForm}  noValidate autoComplete="off" id="textareaInput">
							<TextField
								placeholder='Type your message'
								onChange={(event: any) => {
									setMessage(event.target.value);
								}}
								// si on presse enter, le message s'envoie et le formulaire se vide
								onKeyDown={(event: any) => {
									if (event.key === 'Enter')
									{
										if (message !== "")
										sendMessage();
										event.preventDefault();//avoid refreshing at each enter
										reset();//clear the form
										setMessage('');
									}
								}}
							/>
							{/* bouton d'envoi de messages */}
							<Button
								onClick={send_and_reset}>
								<SendIcon />
							</Button>
						</form>
					</>
				</Paper>
			</div>  
		</div>
	</>
	);
}

export default Chat;
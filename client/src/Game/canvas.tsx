import React, { useEffect, useRef, useState} from 'react';
import { socket } from "../socket";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useLocation } from 'react-router-dom';
import { Alert } from '@mui/material';
import { TextField } from '@mui/material';
import { Table } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useFetchCurrentUser } from "../utils/hooks/useFetchCurrentUser";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Dialog } from '@mui/material';
import { DialogContentText } from '@mui/material';
import './canvas.css';
import { Help } from './help';

const up_key: string = "w";
const down_key: string = "s";
let last_send: string = "s";
let player_status: string = "";
let winning_score: string;
let room_number: string = "";

const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 700;
const PADDLE_HEIGHT = 60;
const PADDLE_MARGIN = 10;
const PADDLE_WIDTH = 10;
const BALL_SIDE = 10;

function Canvas() {

	const { user } = useFetchCurrentUser();
	const location = useLocation();
	const canvasRef = useRef(null);
	const [room, setRoom] = useState<string>("");
	const [disconnection, setDisconnection] = useState<boolean>(false);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [replay, setReplay] = useState<boolean>(false);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [firstPScore, setFirstPScore] = useState<string>("0");
	const [opponent, setOpponent] = useState<string>("");
	const [secondPScore, setSecondPScore] = useState<string>("0");
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	// const [back, setBack] = useState<string>("../Images/paper.webp");
	const [back, setBack] = useState<string>("https://img.freepik.com/free-photo/white-paper-texture_1194-5998.jpg?w=1380&t=st=1659519955~exp=1659520555~hmac=a499219d876edb294bdebf8e768cddf59069e34d1c6f9ae680be92b4f17d7e92");

	//////////////
	const handleMatchmakingClick = () => {
		socket.emit('add_to_queue', user);
		setDisabled(true);
	};

	const handlePlayClick = () => {
		socket.emit('play_again', room_number, {player_status});
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};
	///////////////

	const joinRoom = () => {
		if (room !== "") {
			socket.emit("join_room", room, user?.username);
			room_number = room;
		}
	};

	socket.on("running", (message:string) => {
		if (message === 'true'){
			setIsRunning(true);
		}

		if (message === 'false')
		{
			setIsRunning(false);
			setDialogOpen(true);
			socket.emit("kill_game", room_number);
		}
	});

	socket.on('assigned_room', (message:string) => {
		room_number = message;
	});

	socket.on('winning_score', (message:string) => {
		winning_score = message;
	});

	socket.on('players', (message:string) => {
		player_status = message;
	});

	socket.on('opponent_login', (message:string) => {
		setOpponent(message);
	});

	socket.on('disconnection', (message:string) => {
		setDisconnection(true);
		setIsRunning(false);
		socket.emit("kill_game", room_number);
	});

	socket.on('replay', (message:string) => {
		setReplay(true);
	});

	const draw_players = (context:any, player1_y: number, player2_y: number, ball_x: number, ball_y: number) => {
		context.clearRect(-100, -100, context.canvas.width + 100, context.canvas.height + 100);
		context.fillStyle = '#000';
		context.fillRect(ball_x - (BALL_SIDE / 2), ball_y - (BALL_SIDE / 2), BALL_SIDE, BALL_SIDE);
		context.fillStyle = '#000';
		context.fillRect(PADDLE_MARGIN, player1_y, PADDLE_WIDTH, PADDLE_HEIGHT);
		context.fillRect(context.canvas.width - (PADDLE_MARGIN + PADDLE_WIDTH), player2_y, PADDLE_WIDTH, PADDLE_HEIGHT);
		let net = 8;
		for (let i = net; i < CANVAS_HEIGHT; i += net * 2) {
			context.fillStyle = '#000';
			context.fillRect(CANVAS_WIDTH / 2 - (net / 2), i, net, net);
		};
	}

	useEffect(() => {
		const canvas : any= canvasRef.current;
		canvas.style.backgroundColor = '#ffffff00';
		canvas.style.borderRadius = '10px';
		canvas.width = CANVAS_WIDTH;
		canvas.height = CANVAS_HEIGHT;
		const context = canvas.getContext('2d');
		draw_players(context, PADDLE_MARGIN, PADDLE_MARGIN, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

		window.addEventListener('keydown', (e) => {

			if (e.key === up_key && last_send !== 'u') {
				socket.emit('setPosition', room_number, 'u');
				last_send = 'u';
			}
			if (e.key === down_key && last_send !== 'd') {
				socket.emit('setPosition', room_number, 'd');
				last_send = 'd';
			}
		});

		window.addEventListener('keyup', (e) => {
			if (last_send !== 'o' && room_number !== "") {
				socket.emit('setPosition', room_number, 'o');
				last_send = 'o';
			}
		});

		socket.on('getPosition', (message: string) => {
			setDisabled(false);
			setDisconnection(false);
			setReplay(false);
			let data = message.split(" ");
			draw_players(context, parseInt(data[0]), parseInt(data[1]), parseInt(data[2]), parseInt(data[3]));
			setFirstPScore(data[4]);
			setSecondPScore(data[5]);
		});

	// eslint-disable-next-line
	}, []);

	return (
		<Stack spacing={2}>
		<br></br>

		{(location.pathname === "/chatmode") &&
			<div>
				<TextField variant="standard" placeholder="Room Number..."
				onChange={(event: any) => {
					setRoom(event.target.value);
				}}
				/>
				<Button variant="contained" sx={{fontFamily: 'Work Sans, sans-serif'}} onClick={joinRoom}> Create Room</Button>
			</div>
		}

		{/* **************************** Dialog box who has won *****************************/}
		{ (!isRunning && firstPScore === winning_score && player_status === 'First player') && 
		<Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md">
			<DialogContentText sx={{ fontFamily: 'Work Sans, sans-serif', fontSize: 60, m:2}}>{user?.username} wins !</DialogContentText>
		</Dialog>}

		{ (!isRunning && secondPScore === winning_score && player_status === 'First player') && 
		<Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md">
			<DialogContentText sx={{ fontFamily: 'Work Sans, sans-serif', fontSize: 60, m:2}}>{opponent} wins !</DialogContentText>
		</Dialog>}

		{ (!isRunning && firstPScore === winning_score && player_status === 'Second player') && 
		<Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md">
			<DialogContentText sx={{ fontFamily: 'Work Sans, sans-serif', fontSize: 60, m:2}}>{opponent} wins !</DialogContentText>
		</Dialog>}

		{ (!isRunning && secondPScore === winning_score && player_status === 'Second player') && 
		<Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md">
			<DialogContentText sx={{ fontFamily: 'Work Sans, sans-serif', fontSize: 60, m:2}}>{user?.username} wins !</DialogContentText>
		</Dialog>}

		{/* **************************** Matchmaking button *****************************/}
		{( location.pathname === "/play" && !isRunning && !disabled) && 
			<Button variant="contained" sx={{fontFamily: 'Work Sans, sans-serif'}} onClick={handleMatchmakingClick}>I want to play, add me to queue !</Button> 
		}

		{( location.pathname === "/play" && !isRunning && disabled) && 
			<Button variant="contained" sx={{fontFamily: 'Work Sans, sans-serif' }} disabled>I want to play, add me to queue !</Button>
		}

		{((location.pathname === "/chatmode" && replay && player_status !== "Watching"))&&
			<Button variant="contained" sx={{fontFamily: 'Work Sans, sans-serif'}} onClick={handlePlayClick}>Play again !</Button>
		}

		{/* **************************** Scores *****************************/}
		<Table>
			<tbody>
			<TableRow>
				<TableCell sx={{ fontFamily: 'Work Sans, sans-serif' }}>Opponent</TableCell>
				<TableCell sx={{ fontFamily: 'Work Sans, sans-serif' }} colSpan={2}>{opponent}</TableCell>
			</TableRow>

			<TableRow>
				<TableCell sx={{ fontFamily: 'Work Sans, sans-serif' }}>Winning score</TableCell>
				<TableCell sx={{ fontFamily: 'Work Sans, sans-serif' }} colSpan={2}>{winning_score}</TableCell>
			</TableRow>

			{(player_status === "") && <TableRow>
				<TableCell sx={{ fontFamily: 'Work Sans, sans-serif' }}>Scores</TableCell>
			</TableRow> }

			{(player_status === "First player") && <TableRow>
				<TableCell sx={{ fontFamily: 'Work Sans, sans-serif' }}>Scores</TableCell>
				<TableCell sx={{ fontFamily: 'Work Sans, sans-serif' }}>{user?.username} {firstPScore}</TableCell>
				<TableCell sx={{ fontFamily: 'Work Sans, sans-serif' }}>{opponent} {secondPScore}</TableCell>
			</TableRow> }

			{(player_status === "Second player") && <TableRow>
				<TableCell sx={{ fontFamily: 'Work Sans, sans-serif' }}>Scores</TableCell>
				<TableCell sx={{ fontFamily: 'Work Sans, sans-serif' }}>{user?.username} {secondPScore}</TableCell>
				<TableCell sx={{ fontFamily: 'Work Sans, sans-serif' }}>{opponent} {firstPScore}</TableCell>
			</TableRow> }
			</tbody>
		</Table>

		{/* **************************** Alert disconnection *****************************/}
		{((location.pathname === "/play" || location.pathname === "/chatmode" ) && disconnection === true) &&
			<div>
			<Alert severity="info">Your opponent left the game...</Alert>
			</div>
		}

		{/* **************************** Canvas and background image *****************************/}
		<div className="outsideWrapper">
			<div className="insideWrapper">
				<img alt="" src={back} className="coveredImage"></img>
				<canvas ref={canvasRef}></canvas>
			</div>
		</div>

		{/* src={require({back})} Would have loved to do something like this but it's not working error : Argument of type '{ back: string; }' is not assignable to parameter of type 'string'. */}
		{/* <FormControl>
			<FormLabel>Map background</FormLabel>
			<RadioGroup row value={back} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBack(e.target.value)}>
				<FormControlLabel value="../Images/paper.webp" 
				control={<Radio />} label="Plain" />
				<FormControlLabel 
				value="../Images/glitter.webp" 
				control={<Radio />} label="Glitter" />
				<FormControlLabel value="../Images/sand.jpeg"
				control={<Radio />} label="Sand" />
		
				<FormControlLabel value="../Images/metal.webp"
				control={<Radio />} label="Metal" />
		
				<FormControlLabel value="../Images/plastic.webp"
				control={<Radio />} label="Plastic" />
			</RadioGroup>
		</FormControl> */}

		<FormControl>
				<FormLabel>Map background</FormLabel>
				<RadioGroup row value={back} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBack(e.target.value)}>
					<FormControlLabel value="https://img.freepik.com/free-photo/white-paper-texture_1194-5998.jpg?w=1380&t=st=1659519955~exp=1659520555~hmac=a499219d876edb294bdebf8e768cddf59069e34d1c6f9ae680be92b4f17d7e92" 
					control={<Radio />} label="Plain" />
			
					<FormControlLabel 
					value="https://img.freepik.com/free-photo/silver-glitter-background_53876-71378.jpg?w=1480&t=st=1660048648~exp=1660049248~hmac=e8bb3207be8336b9f40204f5850df6d2d537913603a12865e498312e7673c202" 
					control={<Radio />} label="Glitter" />
			
					<FormControlLabel value="https://img.freepik.com/free-photo/natural-sand-beach-background_53876-139816.jpg?w=1380&t=st=1659519778~exp=1659520378~hmac=33b874ee18163ebf580426cc1d7527b5fca6668a6644d851abe061f2c999f396" 
					control={<Radio />} label="Sand" />
			
					<FormControlLabel value="https://img.freepik.com/free-vector/metallic-textured-background_53876-89255.jpg?w=1480&t=st=1659599134~exp=1659599734~hmac=ebfa25883041c466026d4e4059703f035bd26e03ae3a3754d4fbefea357e1791" 
					control={<Radio />} label="Metal" />
			
					<FormControlLabel value="https://img.freepik.com/free-photo/plastic-texture-holographic-effect_53876-94659.jpg?w=1380&t=st=1659519889~exp=1659520489~hmac=28f106c7f3a587ea6318d552a001f6128ec5f795709f9a38c60dc4b6650bdaad" 
					control={<Radio />} label="Plastic" />
			
				</RadioGroup>
			</FormControl>

		<Help/>
		</Stack>
	);
}

export default Canvas;

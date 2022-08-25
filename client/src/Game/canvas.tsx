import { Alert, Box, Table } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { socket } from "../socket";
import { CircularProgress, Dialog, DialogContentText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { User } from '../utils/types';
import './canvas.css';
import { Help } from './Help';
import { Link } from 'react-router-dom';

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

export interface ICanvasProps {
	user: User | undefined;
}

function Canvas(props: ICanvasProps) {

	const { user } = props;
	const location = useLocation();
	const canvasRef = useRef(null);
	const canvas : any= canvasRef.current;

	const [disconnection, setDisconnection] = useState<boolean>(false);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [firstPScore, setFirstPScore] = useState<string>("0");
	const [opponent, setOpponent] = useState<string>("");
	const [secondPScore, setSecondPScore] = useState<string>("0");
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [ratio, setRatio] = useState<number>(1);
	const [back, setBack] = useState<string>("https://img.freepik.com/free-photo/white-paper-texture_1194-5998.jpg?w=1380&t=st=1659519955~exp=1659520555~hmac=a499219d876edb294bdebf8e768cddf59069e34d1c6f9ae680be92b4f17d7e92");

	//////////////
	const handleMatchmakingClick = () => {
		socket.emit('add_to_queue', user);
		setDisabled(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};
	///////////////

	useEffect(() => {
		const handleResize = (): void => {
			setRatio(window.innerWidth / CANVAS_WIDTH);
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, [ratio])

	useEffect(() => {
		socket.on('make_game_room', ( room: string ) => {
			room_number = room;
			if (user) {
				socket.emit("join_room", { room: room, user: user });
			}
		});

		socket.on("running", (message:string) => {
			if (message === 'true'){
				setIsRunning(true);
			}

			if (message === 'false') {
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

	}, [user]);

	const draw_players = (context:any, player1_y: number, player2_y: number, ball_x: number, ball_y: number) => {

		if (ratio >= 1)
		{
			context.clearRect(-100, -100, context.canvas.width + 100, context.canvas.height + 100);
			context.fillStyle = '#000';
			context.fillRect(ball_x - (BALL_SIDE / 2), ball_y - (BALL_SIDE / 2), BALL_SIDE, BALL_SIDE);
			context.fillStyle = '#000';
			context.fillRect(PADDLE_MARGIN, player1_y, PADDLE_WIDTH, PADDLE_HEIGHT);
			context.fillRect(context.canvas.width - (PADDLE_MARGIN + PADDLE_WIDTH), player2_y, PADDLE_WIDTH, PADDLE_HEIGHT);
			let net = 8;
			for (let i = net; i < context.canvas.height; i += net * 2) {
				context.fillStyle = '#000';
				context.fillRect(context.canvas.width / 2 - (net / 2), i, net, net);
			};
		}
		else
		{
			context.clearRect(-100, -100, context.canvas.width + 100, context.canvas.height + 100);
			context.fillStyle = '#000';
			context.fillRect((ball_x - (BALL_SIDE / 2)) * ratio, (ball_y - (BALL_SIDE / 2)) * ratio, BALL_SIDE * ratio, BALL_SIDE * ratio);
			context.fillStyle = '#000';
			context.fillRect(PADDLE_MARGIN  , player1_y * ratio, PADDLE_WIDTH * ratio , PADDLE_HEIGHT * ratio);
			context.fillRect(context.canvas.width - (PADDLE_MARGIN * ratio + PADDLE_WIDTH * ratio), player2_y * ratio, PADDLE_WIDTH * ratio, PADDLE_HEIGHT * ratio);
			let net = 8;
			for (let i = net ; i < context.canvas.height; i += net * 2) {
				context.fillStyle = '#000';
				context.fillRect(context.canvas.width / 2 - (net / 2), i , net , net );
			};
		}
	}

	useEffect(() => {
		if(canvas)
		{
			canvas.style.backgroundColor = '#ffffff00';

			ratio >= 1 ? canvas.width = CANVAS_WIDTH : canvas.width = CANVAS_WIDTH * ratio;
			ratio >= 1 ? canvas.height = CANVAS_HEIGHT : canvas.height = CANVAS_HEIGHT * ratio;

			const context = canvas.getContext('2d');

			ratio >= 1 ? draw_players(context, PADDLE_MARGIN, PADDLE_MARGIN, canvas.width / 2, canvas.height / 2) 
			: draw_players(context, PADDLE_MARGIN, PADDLE_MARGIN, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

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
				let data = message.split(" ");
				draw_players(context, parseInt(data[0]), parseInt(data[1]), parseInt(data[2]), parseInt(data[3]));
				setFirstPScore(data[4]);
				setSecondPScore(data[5]);
			});
		}

	// eslint-disable-next-line
	}, [canvas, ratio]);

	return (
		<Stack spacing={2}>
		<br></br>

		{(location.pathname === "/chatmode" && !isRunning && firstPScore === "0" && secondPScore === "0") &&
			<Box justifyContent='center' sx={{ display: 'flex', }}>
				<CircularProgress />
			</Box>
		}

		{(location.pathname === "/chatmode" && !isRunning && (firstPScore === winning_score || secondPScore === winning_score || disconnection)) &&
			<Button component={Link} to="/" variant="contained" >
			Come back to the home page
			</Button>
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

		<FormControl>
				<FormLabel>Map background</FormLabel>
				<RadioGroup row value={back} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBack(e.target.value)}>
					<FormControlLabel value="https://img.freepik.com/free-photo/white-paper-texture_1194-5998.jpg?w=1380&t=st=1659519955~exp=1659520555~hmac=a499219d876edb294bdebf8e768cddf59069e34d1c6f9ae680be92b4f17d7e92" 
					control={<Radio />} label="Plain" />
			
					<FormControlLabel 
					value="https://img.freepik.com/free-photo/gold-sand-glitter-texture-background-high-resolution-design_53876-139892.jpg?w=1800&t=st=1661352791~exp=1661353391~hmac=4fb4762c0acdbb1e1e3ccaaf49eade062d3703d8ea39bca2c76accd667bf6de6" 
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
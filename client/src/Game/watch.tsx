import React, { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { Table } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Alert } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import './canvas.css';
import { useFetchCurrentUser } from "../utils/hooks/useFetchCurrentUser";
import { CurrentMatch } from '../utils/types';
import { Dialog } from '@mui/material';
import { DialogContentText } from '@mui/material';
import { socket } from '../socket';

const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 700;
const PADDLE_HEIGHT = 60;
const PADDLE_MARGIN = 10;
const PADDLE_WIDTH = 10;
const BALL_SIDE = 10;

let winning_score: string;

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

function Watch() {
	const { user } = useFetchCurrentUser();
	const [array, setArray] = useState<CurrentMatch[]>([]);
	const [toAdd, setToAdd] = useState<CurrentMatch>({key:"", player_1:"", player_2:""})
	const [currentlyWatched, setCurrentlyWatched] = useState<CurrentMatch>({key:"", player_1:"", player_2:""});
	const [disconnection, setDisconnection] = useState<boolean>(false);
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [back, setBack] = useState<string>("https://img.freepik.com/free-photo/white-paper-texture_1194-5998.jpg?w=1380&t=st=1659519955~exp=1659520555~hmac=a499219d876edb294bdebf8e768cddf59069e34d1c6f9ae680be92b4f17d7e92");

	const handleClick = (e : any, match: CurrentMatch) => {
		setDisconnection(false);
		if(currentlyWatched.key !== "")
			socket.emit("remove_spectator", currentlyWatched.key);
		socket.emit("add_spectator", match.key, user?.username);
		setCurrentlyWatched(match);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	useEffect(() => {
		socket.emit("get_current_games");
	}, [])

	useEffect(() => {
		socket.on("add_ongoing_game", (message:string[]) => {
			setToAdd({key:message[0], player_1:message[1], player_2:message[2]});
		});

		if (array.some(e => e.key === toAdd.key) === false && toAdd.key !== "")
		{
			setArray(oldArray => [...oldArray, toAdd]);
			setToAdd({key:"", player_1:"", player_2:""});
		}

		socket.on("current_games_list", (message:string[]) => {
			setArray(oldArray => [...oldArray, {key:message[0], player_1:message[1], player_2:message[2]}]);
		});

		socket.on("remove_ongoing_game", (message:string) => {
			setDialogOpen(true);
			setArray((prev: CurrentMatch[]) => prev.filter(item => item.key !== message));
		});

		socket.on("disconnection_of_player", (message:string) => {
			if (message === currentlyWatched.key)
			{
				setDisconnection(true);
				setCurrentlyWatched({key:"", player_1:"", player_2:""});
			}
		});
	}, [array, toAdd, currentlyWatched]);

	const canvasRef = useRef(null);
	const [firstPScore, setFirstPScore] = useState<string>("0");
	const [secondPScore, setSecondPScore] = useState<string>("0");

	socket.on('winning_score', (message:string) => {
		winning_score = message;
	});

	useEffect(() => {
		const canvas : any= canvasRef.current;
		canvas.style.borderRadius = '10px';
		canvas.width = CANVAS_WIDTH;
		canvas.height = CANVAS_HEIGHT;
		const context = canvas.getContext('2d');
		draw_players(context, PADDLE_MARGIN, PADDLE_MARGIN, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

		socket.on('getPosition', (message: string) => {
			let data = message.split(" ");
			draw_players(context, parseInt(data[0]), parseInt(data[1]), parseInt(data[2]), parseInt(data[3]));
			setFirstPScore(data[4]);
			setSecondPScore(data[5]);
		});
		return (() => {
			socket.off('getPosition');
		})
	// eslint-disable-next-line
	}, []);

	return (
	<>
		<Stack spacing={2}>
			{/* **************************** Scores *****************************/}
			<br></br>
			<Table>
			<tbody>
				<TableRow>
					<TableCell sx={{ fontFamily: 'Work Sans, sans-serif' }}>Winning score</TableCell>
					<TableCell sx={{ fontFamily: 'Work Sans, sans-serif' }} colSpan={2}>{winning_score}</TableCell>
				</TableRow>

				<TableRow>
					<TableCell sx={{fontFamily: 'Work Sans, sans-serif'}}>Scores</TableCell>
					<TableCell sx={{fontFamily: 'Work Sans, sans-serif'}}>{firstPScore}</TableCell>
					<TableCell sx={{fontFamily: 'Work Sans, sans-serif'}}>{secondPScore}</TableCell>
				</TableRow>
			</tbody>
		</Table>

		{/* **************************** Alert disconnection *****************************/}
		{(disconnection === true) &&
			<div>
			<Alert severity="info">One of the players left the game you were watching...</Alert>
			</div>
		}

		{/* **************************** Dialog box who has won *****************************/}
		{(firstPScore === winning_score) && 
			<Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md">
				<DialogContentText sx={{ fontFamily: 'Work Sans, sans-serif', fontSize: 60, m:2}}>{currentlyWatched.player_1} wins !</DialogContentText>
			</Dialog>}

			{(secondPScore === winning_score) && 
			<Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md">
				<DialogContentText sx={{ fontFamily: 'Work Sans, sans-serif', fontSize: 60, m:2}}>{currentlyWatched.player_2} wins !</DialogContentText>
			</Dialog>}

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

			{/* **************************** List matches *****************************/}
			<Typography variant="h6" color="#000000" align="center" sx={{fontFamily: 'Work Sans, sans-serif'}}>List of available games to watch</Typography>

			{array.map((element: CurrentMatch,index: any) => {
			return (
				<Button variant="contained" sx={{m: 1, fontFamily: 'Work Sans, sans-serif'}} endIcon={<VisibilityIcon />} key={index} onClick={(event: any) => handleClick(event, element)}>
				{element.player_1} VS {element.player_2}
			</Button>)
			})}


		</Stack>
	</>
	);
}

export default Watch;

import React, { useEffect, useState, useRef } from 'react';
import { Socket } from "socket.io-client";
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

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 500;
let winning_score: number;

const draw_players = (context:any, ball_color: string, paddle_color: string, player1_y: number, player2_y: number, ball_x: number, ball_y: number) => {
	context.clearRect(-100, -100, context.canvas.width + 100, context.canvas.height + 100);
	context.fillStyle = ball_color;
	context.fillRect(ball_x -5, ball_y - 5, 10, 10);
	context.fill();
	context.fillStyle = paddle_color;
	context.fillRect(10, player1_y, 10, 60);
	context.fillRect(context.canvas.width - 20, player2_y, 10, 60);
	let net = 8;
	for (let i = net; i < CANVAS_HEIGHT; i += net * 2) {
		context.fillStyle = ball_color;
		context.fillRect(CANVAS_WIDTH / 2 - (net / 2), i, net, net);
	};
}

function Watch(props: any) {
	const ws: Socket = props.socket;;
	const [array, setArray] = useState<string[]>([]);
	const [idAdd, setIdAdd] = useState<string>("");
	const [lastRemoved, setLastRemoved] = useState<string>("");
	const [currentlyWatched, setCurrentlyWatched] = useState<string>("");
	const [disconnection, setDisconnection] = useState<boolean>(false);
	const [back, setBack] = useState<string>("https://img.freepik.com/free-photo/white-paper-texture_1194-5998.jpg?w=1380&t=st=1659519955~exp=1659520555~hmac=a499219d876edb294bdebf8e768cddf59069e34d1c6f9ae680be92b4f17d7e92");

	const handleClick = (e : any, key: string) => {
		setDisconnection(false);
		if(currentlyWatched !== "")
			ws.emit("remove_spectator", currentlyWatched);
		ws.emit("add_spectator", key);
		setCurrentlyWatched(key);
		console.log(`CURRENT MATCH ${key}`);
	};

	useEffect(() => {
		ws.on("add_ongoing_game", (message:string) => {
			setIdAdd(message);
		});

		if (!array.includes(idAdd) && idAdd !== "" && idAdd !== lastRemoved)
		{
			setArray((oldArray: any) => [...oldArray, idAdd]);
			setIdAdd("")
			console.log(`Added ${idAdd}`);
		}

		ws.on("remove_ongoing_game", (message:string) => {
			setLastRemoved(message);
			setArray((prev: any[]) => prev.filter(item => item !== message));
		});

		ws.on("disconnection_of_player", (message:string) => {
			if (message === currentlyWatched)
			{
				console.log(`message ${message} // currently watched ${currentlyWatched}`)
				setDisconnection(true);
				setCurrentlyWatched("");
			}
		});

		setInterval(() => {
			ws.emit("monitor");
		}, 500);

	}, [array, idAdd, lastRemoved, currentlyWatched, ws]);

	/////////

	let ball_color: string = '#000';
	let paddle_color: string = '#000';
	const canvasRef = useRef(null);
	const [firstPScore, setFirstPScore] = useState<string>("0");
	const [secondPScore, setSecondPScore] = useState<string>("0");

	ws.on('winning_score', (message:string) => {
		winning_score = parseInt(message);
	});

	useEffect(() => {
		const canvas : any= canvasRef.current;
		canvas.style.borderRadius = '10px';
		canvas.width = CANVAS_WIDTH;
		canvas.height = CANVAS_HEIGHT;
		const context = canvas.getContext('2d');
		draw_players(context, ball_color, paddle_color, 10, 10, 350, 250);

		ws.on('getPosition', (message: string) => {
			let data = message.split(" ");
			draw_players(context, ball_color, paddle_color, parseInt(data[0]), parseInt(data[1]), parseInt(data[2]), parseInt(data[3]));
			setFirstPScore(data[4]);
			setSecondPScore(data[5]);
		});

		return () => {
			ws.close();
		}
	// eslint-disable-next-line
	}, []);

	///////////////////////////////////

	return (
	<>
		<Stack spacing={2}>
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

		{(disconnection === true) &&
			<div>
			<Alert severity="info">The match is over or an one of the players left the game...</Alert>
			</div>
		}

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
				value="https://previews.123rf.com/images/stephaniezieber/stephaniezieber1510/stephaniezieber151000010/47595727-white-silver-glitter-sparkle-texture.jpg" 
				control={<Radio />} label="Glitter" />
		
				<FormControlLabel value="https://img.freepik.com/free-photo/natural-sand-beach-background_53876-139816.jpg?w=1380&t=st=1659519778~exp=1659520378~hmac=33b874ee18163ebf580426cc1d7527b5fca6668a6644d851abe061f2c999f396" 
				control={<Radio />} label="Sand" />
		
				<FormControlLabel value="https://img.freepik.com/free-photo/metallic-textured-background_53876-89540.jpg?w=1380&t=st=1659519816~exp=1659520416~hmac=5b8b4a3f2ca08ba48217bb53a6dac5b6010ba3b701d72dc08f0f3fd113e9c268" 
				control={<Radio />} label="Metal" />
		
				<FormControlLabel value="https://img.freepik.com/free-photo/plastic-texture-holographic-effect_53876-94659.jpg?w=1380&t=st=1659519889~exp=1659520489~hmac=28f106c7f3a587ea6318d552a001f6128ec5f795709f9a38c60dc4b6650bdaad" 
				control={<Radio />} label="Plastic" />
		
			</RadioGroup>
		</FormControl>
			<Typography variant="h6" color="#000000" align="center" sx={{fontFamily: 'Work Sans, sans-serif'}}>List of available games to watch</Typography>

			{array.map((element: string,index: any) => {
			return (
				<Button variant="contained" sx={{m: 1, fontFamily: 'Work Sans, sans-serif'}} endIcon={<VisibilityIcon />} key={index} onClick={(event: any) => handleClick(event, element)}>
				{element}
			</Button>)
			})}

		</Stack>
	</>
	);
}

export default Watch;


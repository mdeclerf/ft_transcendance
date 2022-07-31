import React, { useEffect, useState, useRef } from 'react';
import { Socket } from "socket.io-client";
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { Table, Box } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
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
	const theme = useTheme();
	const [array, setArray] = useState<string[]>([]);
	const [idAdd, setIdAdd] = useState<string>("");
	const [lastRemoved, setLastRemoved] = useState<string>("");

	const handleClick = (e : any, key: string) => {
		ws.emit("add_spectator", key);
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

		setInterval(() => {
			ws.emit("monitor");
		}, 500);

	}, [array, idAdd, lastRemoved, ws]);

	/////////

	let ball_color: string = '#000';
	let paddle_color: string = '#000';
	const canvasRef = useRef(null);
	const [firstPScore, setFirstPScore] = useState<string>("0");
	const [secondPScore, setSecondPScore] = useState<string>("0");

	ws.on('winning_score', (message:string) => {
		console.log(`winning score ${message}`);
		winning_score = parseInt(message);
	});

	useEffect(() => {
		const canvas : any= canvasRef.current;
		canvas.style.backgroundColor = 'white';
		canvas.style.borderRadius = '10px';
		canvas.width = CANVAS_WIDTH;
		canvas.height = CANVAS_HEIGHT;
		const context = canvas.getContext('2d');
		draw_players(context, ball_color, paddle_color, 10, 10, 350, 250);

		ws.on('getPosition', (message: string) => {
			console.log(`received ${message}`)
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
			<canvas ref={canvasRef}></canvas>
			<Typography variant="h6" color="#000000" align="center" sx={{fontFamily: 'Work Sans, sans-serif'}}>List of available games to watch</Typography>

			{array.map((element: string,index: any) => {
			return (
				<Button variant="contained" sx={{m: 1, fontFamily: 'Work Sans, sans-serif', backgroundColor: 'background.default'}} endIcon={<VisibilityIcon />} key={index} onClick={(event: any) => handleClick(event, element)}>
				{element}
			</Button>)
			})}

		</Stack>
	</>
	);
}

export default Watch;


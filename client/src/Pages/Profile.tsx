import { Avatar, Box, Grid, List, ListItem, ListItemText, Typography } from "@mui/material/";
import React from "react";
import { ProfileDiv, StyledBadge } from "../utils/styles";
import { Game, User, Result } from "../utils/types";
import { VictoryPie } from "victory-pie";

export interface IProfileProps {
	user: User | undefined;
	games?: Game[];
}

export const Profile = (props: IProfileProps) => {
	const { user, games } = props;

	let backHeight: number;
	if (games)
		backHeight = games.length * 80;
	else
		backHeight = 80;

	const create_game_pie = () => {
		const data: Result[] = [];
		let w: Result = { x: "Wins", y:0 };
		let l: Result = { x: "Losses", y:0 };
		if (games)
		{
			for(let i = 0; i < games?.length; i++)
			{
				if ((games[i].player_2_score > games[i].player_1_score && games[i].player_2.username === user?.username) || (games[i].player_1_score > games[i].player_2_score && games[i].player_1.username === user?.username))
					w.y++;
				else
					l.y++;
			}
			data.push(w);
			data.push(l);
		}
		return data;
	}

	const getMatchHistory = (p1_score: number, p2_score: number, p1_name: string, p2_name: string, mode: string, i: number) => {
		return (
			<ListItem
			key={i}
			sx={{
				alignItems: 'center',
				borderRadius: '10px',
				backgroundColor: (p1_score < p2_score) ? '#c84949' : '#49c860',
				marginTop: '2px',
			}}
			>
				<ListItemText
					sx={{ fontFamily: 'Work Sans, sans-serif', fontSize: 70, color: 'white'}}
					primary={`Opponent: ${p2_name} | Scores: ${p1_score} - ${p2_score} | Mode: ${mode}`}
				/>
			</ListItem>
		)
	}

	const generate = () => {
		return games?.map((game, i) => {
			if (game.player_1.username === user?.username)
				return getMatchHistory(game.player_1_score, game.player_2_score, game.player_1.username, game.player_2.username, game.mode, i);
			else
				return getMatchHistory(game.player_2_score, game.player_1_score, game.player_2.username, game.player_1.username, game.mode, i);
		})
	}

	const getTypography = (content: string | undefined) => {
		return (
			<Typography 
				variant="h4" 
				component="h1"
				sx={{
					mr: 2,
					mt: 2,
					display: { xs: 'none', md: 'flex' },
					fontFamily: 'Work Sans, sans-serif',
					fontWeight: 700,
					color: 'inherit',
					textDecoration: 'none',
				}}
			>
				{content}
			</Typography>
		)
	}

	return (
		<ProfileDiv>
			<div>
				<div>
					<StyledBadge
						overlap="circular"
						anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						variant="dot"
					>
						<Avatar
							alt={user?.username}
							src={user?.photoURL}
							sx={{
								minWidth: { xs: 255 },
								minHeight: { xs: 255 }
							}}
						/>
					</StyledBadge>
				</div>
				{getTypography(user?.username)}
			</div>
			<div>
				{getTypography('Match History')}
				<Box
					sx={{
						width: 600,
						height: {backHeight},
						padding: '3%',
						backgroundColor: 'primary.main',
						borderRadius: '20px',
					}}
				>
					<Grid item xs='auto'>
						<List>
							{generate()}
						</List>
					</Grid>
				</Box>

				{getTypography('Wins and losses')}
				<Box sx={{
						width: 600,
						height: 300,
						backgroundColor: 'primary.main',
						borderRadius: '20px',
					}}>
					<VictoryPie
					style={{ labels: { fill: "white", fontSize: 20} }}
					colorScale={['#49c860', '#c84949' ]} // #49c860
					innerRadius={50}
					data={create_game_pie()}
					/>
				</Box> 
			</div>
		</ProfileDiv>
	)
}

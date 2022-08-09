import { Avatar, Box, Grid, List, ListItem, ListItemText, Typography } from "@mui/material/";
import React from "react";
import { ProfileDiv, StyledBadge } from "../utils/styles"
import { Game, User } from "../utils/types"

export interface IProfileProps {
	user: User | undefined;
	games?: Game[];
}

export const Profile = (props: IProfileProps) => {
	const { user, games } = props;

	console.log(games);

	const generate = () => {
		return games?.map((game, i) => {
			return (
				<ListItem
					key={i}
					sx={{
						borderRadius: '10px',
						backgroundColor: (game.player_1_score < game.player_2_score) ? '#c84949' : '#49c860',
						marginTop: '2px',
					}}
				>
					<ListItemText
						primary={`${game.player_2.username} | ${game.player_1_score} - ${game.player_2_score} | ${game.mode}`}
					/>
				</ListItem>
			)
		})
	}

	const getTypography = (content: string | undefined) => {
		return (
			<Typography 
				variant="h4" 
				component="h1"
				sx={{
					mr: 2,
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
						width: 800,
						height: 1000,
						padding: '5%',
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
			</div>
		</ProfileDiv>
	)
}
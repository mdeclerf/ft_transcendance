import { Box, Button, Grid, List, ListItem, ListItemText, Tooltip, Typography } from "@mui/material/";
import React from "react";
import { ProfileDiv } from "../utils/styles";
import { Game, User, Result, Room } from "../utils/types";
import { VictoryPie } from "victory-pie";
import { CustomAvatar } from "../Components/CustomAvatar";
import { useFetchCurrentUser } from "../utils/hooks/useFetchCurrentUser";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BlockIcon from '@mui/icons-material/Block';
import { useFetchIsFriend } from "../utils/hooks/useFetchIsFriend";
import axios from "axios";
import { useFetchIsBlocked } from "../utils/hooks/useFetchIsBlocked";
import MessageIcon from '@mui/icons-material/Message';

export interface IProfileProps {
	user: User | undefined;
	games?: Game[];
}

export const Profile = (props: IProfileProps) => {
	const { user, games } = props;
	const { user: currentUser } = useFetchCurrentUser();
	const isFriend = useFetchIsFriend(user?.id);
	const isBlocked = useFetchIsBlocked(user?.id);

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

	const handleAddFriend = (event: React.MouseEvent<HTMLButtonElement>) => {
		axios.get(`http://${process.env.REACT_APP_IP}:3001/api/user/add_friend?id=${user?.id}`, { withCredentials: true })
			.then(() => {
				window.location.reload();
			})
			.catch(err => {
				if (err) throw err;
			});
	}

	const handleRemoveFriend = (event: React.MouseEvent<HTMLButtonElement>) => {
		axios.get(`http://${process.env.REACT_APP_IP}:3001/api/user/remove_friend?id=${user?.id}`, { withCredentials: true })
			.then(() => {
				window.location.reload();
			})
			.catch(err => {
				if (err) throw err;
			});
	}

	const handleBlock = (event: React.MouseEvent<HTMLButtonElement>) => {
		axios.get(`http://${process.env.REACT_APP_IP}:3001/api/user/block_user?id=${user?.id}`, { withCredentials: true })
			.then(() => {
				window.location.reload();
			})
			.catch(err => {
				if (err) throw err;
			});
	}

	const handleDM = async () => {
		axios.get<Room>(`http://${process.env.REACT_APP_IP}:3001/api/chat/rooms/check_dm?user=${user?.id}`, { withCredentials: true})
			.then(res => {
				window.location.href = `http://${process.env.REACT_APP_IP}:3000/chat#${res.data.name}`;
			});
	}

	const handleUnblock = (event: React.MouseEvent<HTMLButtonElement>) => {
		axios.get(`http://${process.env.REACT_APP_IP}:3001/api/user/unblock_user?id=${user?.id}`, { withCredentials: true })
			.then(() => {
				window.location.reload();
			})
			.catch(err => {
				if (err) throw err;
			});
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
				component="span"
				sx={{
					mr: 0,
					fontFamily: 'Work Sans, sans-serif',
					fontWeight: 700,
					color: 'inherit',
				}}
			>
				{content}
			</Typography>
		)
	}

	return (
		<ProfileDiv>
			<div>
				<CustomAvatar user={user} minSize={255} />
				<Tooltip title={user?.displayName ? user.displayName : ""} placement="right">
					{getTypography(user?.username)}
				</Tooltip>
				<br/>
				{((user?.id !== currentUser?.id) && !isFriend) &&
					<Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleAddFriend} sx={{m:1}}>
						Add Friend
					</Button>
				}
				{((user?.id !== currentUser?.id) && isFriend) &&
					<Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleRemoveFriend} sx={{m:1}}>
						Remove Friend
					</Button>
				}
				{((user?.id !== currentUser?.id) && !isBlocked) &&
					<Button variant="contained" startIcon={<BlockIcon />} onClick={handleBlock} sx={{m:1}}>
						Block User
					</Button>
				}
				{((user?.id !== currentUser?.id) && isBlocked) &&
					<Button variant="contained" startIcon={<BlockIcon />} onClick={handleUnblock} sx={{m:1}}>
						Unblock User
					</Button>
				}
				{((user?.id !== currentUser?.id)) &&
					<Button variant="contained" startIcon={<MessageIcon />} onClick={handleDM} sx={{m:1}}>
						Send private message
					</Button>
				}

			</div>
			<div>
				{getTypography('Match History')}
				<Box
					sx={{
						width: 600,
						maxHeight: 600,
						overflow: 'auto',
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

				<br></br>

				{getTypography('Wins and losses')}
				{ (games?.length !== 0) && <Box sx={{
						width: 600,
						height: 300,
						backgroundColor: 'primary.main',
						borderRadius: '20px',
					}}>
					<VictoryPie
					style={{ labels: { fill: "white", fontSize: 20} }}
					colorScale={['#49c860', '#c84949' ]}
					innerRadius={50}
					data={create_game_pie()}
					/>
				</Box> }
				{ (games?.length === 0) && <Box sx={{
						width: 600,
						height: 50,
						backgroundColor: 'primary.main',
						borderRadius: '20px',
					}}>
				</Box> }
			</div>
		</ProfileDiv>
	)
}

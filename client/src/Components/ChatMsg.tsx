import React, { useState } from 'react';
import { Grid, Typography, AvatarTypeMap, Box, Avatar, IconButton, MenuItem, Menu } from "@mui/material";
import { Link } from 'react-router-dom';
import { User } from '../utils/types';
import { socket } from "../socket";
import { useFetchCurrentUser } from '../utils/hooks/useFetchCurrentUser';
import axios from 'axios';
import { Room } from '../utils/types';
// import axios from 'axios';

export interface IChatMsgProps {
	room?: Room;
	admin: boolean;
	owner: boolean;
	user?: User;
	messages: string[];
	side?: 'left' | 'right';
	AvatarProps?: AvatarTypeMap;
}

export function ChatMsg (props: IChatMsgProps) {
	const {
		room,
		admin,
		owner,
		user,
		messages,
		side,
		AvatarProps
	} = props;

	const { user: currentUser } = useFetchCurrentUser();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [isHeAdmin, setIsHeAdmin] = useState<boolean>(false);
	const [isHeMute, setIsHeMute] = useState<boolean>(false);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
		fetchChatUserStatus().then((res: string | undefined) => {
			if (res) {
				if (res === 'admin') {
					setIsHeAdmin(true);
					setIsHeMute(false);
				}
				if (res === 'muted') {
					setIsHeAdmin(false);
					setIsHeMute(true);
				}
				if (res === 'user') {
					setIsHeAdmin(false);
					setIsHeMute(false);
				}
			}
		});
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleBlock = () => {
		axios.get(`http://localhost:3001/api/user/block_user?id=${user?.id}`, { withCredentials: true })
			.then(() => {
				setAnchorEl(null);
				window.location.reload();
			})
			.catch(err => {
				if (err) throw err;
			});
	}

	async function fetchChatUserStatus(): Promise<string | undefined> {
		if (user && room)
		{
			const response = await axios.get<string>(`http://localhost:3001/api/chat/rooms/${room.name}/${user.username}/get_chat_user_status`, { withCredentials: true });
			if (response)
				return (response.data)
		}
		else
			return ;
	}

	return (
		<Grid
			container
			spacing={2}
			justifyContent={side === 'right' ? 'flex-end' : 'flex-start'}
		>
			{side === 'left' && (
				<Grid item>
					<IconButton
						aria-controls={open ? 'basic-menu' : undefined}
						aria-haspopup="true"
						aria-expanded={open ? 'true' : undefined}
						onClick={handleClick}
						color="inherit"
					>
						<Avatar
							src={user?.photoURL || ''}
							{...AvatarProps}
							sx={{
								width: '32px',
								height: '32px'
							}}
						/>
					</IconButton>
					<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
							'aria-labelledby': 'basic-button',
							}}
						>
						<MenuItem component={Link} to={`/user/${user?.username}`} onClick={handleClose}>Profile</MenuItem>
						<MenuItem component={Link} to="/chatmode" onClick={() => 
						{
							socket.emit("invited", [currentUser?.id, user?.id]);
							setAnchorEl(null);
						}}
						>Invite to game</MenuItem>
						{
							((user?.id !== currentUser?.id)) &&
							<MenuItem onClick={handleBlock}>Block</MenuItem>
						}
						{owner && !isHeAdmin && !isHeMute && <MenuItem onClick={() => 
						{
							if (user && room) {
								socket.emit("set_status", {user_id: user.id, room_name: room.name, status: 'admin'});
							}
							setAnchorEl(null);
						}} >Add admin</MenuItem>}
						{owner && isHeAdmin && <MenuItem onClick={() => 
						{
							if (user && room) {
								socket.emit("set_status", {user_id: user.id, room_name: room.name, status: 'user'});
							}
							setAnchorEl(null);
						}} >Remove admin</MenuItem>}
						{admin && !isHeMute && !isHeAdmin && <MenuItem onClick={() => 
						{
							if (user && room) {
								socket.emit("set_status", {user_id: user.id, room_name: room.name, status: 'muted'});
							}
							setAnchorEl(null);
						}} >Mute</MenuItem>}
					</Menu>
				</Grid>
			)}
			<Grid item xs={8}>
				{messages.map((msg, i) => {
					return (
						<Box key={i} sx={{
							textAlign: side,
							margin: '0px 5px',
						}}
						>
							<Typography
								align={'left'}
								sx={[
									{
										padding: '8px 16px',
										borderRadius: 2,
										marginBottom: 1,
										display: 'inline-block',
										wordBreak: 'break-word',
										fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
										fontSize: '14px',
									},
									side === 'left' && {
										borderTopRightRadius: '20px',
										borderBottomRightRadius: '20px',
										backgroundColor: "#f5f5f5",

									},
									side === 'right' && {
										borderTopLeftRadius: '20px',
										borderBottomLeftRadius: '20px',
										backgroundColor: 'primary.main',
										color: 'white',
									},
									(i === 0 && side === 'left') && {
										borderTopLeftRadius: '20px'
									},
									(i === 0 && side === 'right') && {
										borderTopRightRadius: '20px'
									},
									(i === messages.length - 1 && side === 'left') && {
										borderBottomLeftRadius: '20px'
									},
									(i === messages.length - 1 && side === 'right') && {
										borderBottomRightRadius: '20px'
									}
								]}
							>
								{msg}
							</Typography>
						</Box>
					)
				})}
			</Grid>
		</Grid>
	);
}
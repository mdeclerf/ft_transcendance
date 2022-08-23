import React, { useState } from 'react';
import { Grid, Typography, AvatarTypeMap, Box, Avatar, IconButton, MenuItem, Menu } from "@mui/material";
import { Link } from 'react-router-dom';
import { User } from '../utils/types';
import { socket } from "../socket";
import { useFetchCurrentUser } from '../utils/hooks/useFetchCurrentUser';


export interface IChatMsgProps {
	user?: User;
	messages: string[];
	side?: 'left' | 'right';
	AvatarProps?: AvatarTypeMap;
}

export function ChatMsg (props: IChatMsgProps) {
	const {
		user,
		messages,
		side,
		AvatarProps
	} = props;

	const { user: currentUser } = useFetchCurrentUser();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleBlock = () => {
		setAnchorEl(null);
	};

	return (
		<Grid
			container
			spacing={2}
			justifyContent={side === 'right' ? 'flex-end' : 'flex-start'}
		>
			{side === 'left' && (
				<Grid item>
				<IconButton
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
								socket.emit("invited", [currentUser?.id, user?.id])
								setAnchorEl(null);
							}}
								>Invite to game</MenuItem>
							<MenuItem onClick={handleBlock}>Block</MenuItem>
						</Menu>
					</IconButton>
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
										backgroundColor: 'primary',
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

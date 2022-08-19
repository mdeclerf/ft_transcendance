// import { AppBar, Button, Menu, MenuItem, Stack, SvgIcon, Toolbar, Typography } from '@mui/material';
import { AppBar, Button, Stack, SvgIcon, Toolbar, Typography } from '@mui/material';
import Svg42Logo from './Svg42Logo';
import { styled } from '@mui/material/styles';
import { Account } from './Account';
import { User } from '../utils/types';
import { Link } from 'react-router-dom';
// import React, { useState } from 'react';

const StyledToolbar = styled(Toolbar)`
	display: flex;
	justify-content: space-between;
`

export interface IHeaderProps {
	user: User | undefined;
	error: undefined;
}

export function Header (props: IHeaderProps) {
	const { user, error } = props;

	const redirect = () => {
		window.location.href = "http://localhost:3001/api/auth/login";
	}

	const loginButton = (user && !error) ? (
		<Account user={user} />
	) : (
		<Button
			variant="contained" 
			onClick={redirect} 
			startIcon={<SvgIcon><Svg42Logo/></SvgIcon>}
		>
			Login with 42Intra
		</Button>
	)
	
	const transcendenceLogo = (
		<Typography 
			variant="h6" 
			component={Link}
			to="/"
			sx={{
				mr: 2,
				display: { xs: 'none', md: 'flex' },
				fontFamily: 'Work Sans, sans-serif',
				fontWeight: 700,
				color: 'inherit',
				textDecoration: 'none',
			}}
		>
			Transcendence
		</Typography>
	)

	// const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	// const open = Boolean(anchorEl);

	// const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
	// 	setAnchorEl(event.currentTarget);
	// };

	// const handleClose = () => {
	// 	setAnchorEl(null);
	// };

	// const homeButton = (
	// 	<div>
	// 		<Button
	// 			id="basic-button"
	// 			variant="contained"
	// 			aria-controls={open ? 'basic-menu' : undefined}
	// 			aria-haspopup="true"
	// 			aria-expanded={open ? 'true' : undefined}
	// 			onClick={handleClick}
	// 		>
	// 			Transcendence
	// 		</Button>
	// 		<Typography
	// 			id="basic-button"
	// 			variant="h6"
	// 			aria-controls={open ? 'basic-menu' : undefined}
	// 			aria-haspopup="true"
	// 			aria-expanded={open ? 'true' : undefined}
	// 			onClick={handleClick}
	// 			sx={{
	// 				fontFamily: 'Work Sans, sans-serif',
	// 				fontWeight: 700,
	// 				color: 'inherit',
	// 				textDecoration: 'none',
	// 			}}
	// 		>
	// 			Transcendence
	// 		</Typography>
	// 		<Menu
	// 			id="basic-menu"
	// 			anchorEl={anchorEl}
	// 			open={open}
	// 			onClose={handleClose}
	// 			MenuListProps={{
	// 			'aria-labelledby': 'basic-button',
	// 			}}
	// 		>
	// 		<MenuItem component={Link} to="/" onClick={handleClose}>Homepage</MenuItem>
	// 		<MenuItem component={Link} to="/chat" onClick={handleClose}>Chat</MenuItem>
	// 		<MenuItem component={Link} to="/play" onClick={handleClose}>Play</MenuItem>
	// 		<MenuItem component={Link} to="/watch" onClick={handleClose}>Watch</MenuItem>
	// 		<MenuItem component={Link} to="/leaderboard" onClick={handleClose}>Board</MenuItem>
	// 	</Menu>
	// 	</div>
	// )

	const buttons = (
		<Stack spacing={2} direction="row">
			<Button
				variant="text"
				component={Link}
				to="/chat"
				sx={{
					fontFamily: 'Work Sans, sans-serif',
					fontWeight: 700,
					color: 'inherit',
					textDecoration: 'none',
				}}
			>
				Chat
			</Button>
			<Button
				variant="text"
				component={Link}
				to="/play"
				sx={{
					fontFamily: 'Work Sans, sans-serif',
					fontWeight: 700,
					color: 'inherit',
					textDecoration: 'none',
				}}
			>
				Play
			</Button>
			<Button
				variant="text"
				component={Link}
				to="/watch"
				sx={{
					fontFamily: 'Work Sans, sans-serif',
					fontWeight: 700,
					color: 'inherit',
					textDecoration: 'none',
				}}
			>
				Watch
			</Button>
			<Button
				variant="text"
				component={Link}
				to="/leaderboard"
				sx={{
					fontFamily: 'Work Sans, sans-serif',
					fontWeight: 700,
					color: 'inherit',
					textDecoration: 'none',
				}}
			>
				Board
			</Button>
		</Stack>
	)

	const displayDesktop = () => {
		return (
			<StyledToolbar>
				{transcendenceLogo}
				{/* {homeButton} */}
				<div>{buttons}</div>
				<div>{loginButton}</div>
			</StyledToolbar>
		)
	}

	return (
		<AppBar position="static">
			{displayDesktop()}
		</AppBar>
	);
}
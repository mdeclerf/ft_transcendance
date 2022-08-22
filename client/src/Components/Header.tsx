import { AppBar, Button, Menu, MenuItem, Stack, SvgIcon, Toolbar, Typography } from '@mui/material';
import Svg42Logo from './Svg42Logo';
import { styled } from '@mui/material/styles';
import { Account } from './Account';
import { User } from '../utils/types';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const homeButton = (
		<div>
			<Typography
				id="basic-button"
				variant="h6"
				onClick={handleClick}
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				sx={{ cursor: 'pointer' }}
			>
				Transcendence
			</Typography>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
				'aria-labelledby': 'basic-button',
				}}
			>
			<MenuItem component={Link} to="/" onClick={handleClose}>Homepage</MenuItem>
			<MenuItem component={Link} to="/chat" onClick={handleClose}>Chat</MenuItem>
			<MenuItem component={Link} to="/play" onClick={handleClose}>Play</MenuItem>
			<MenuItem component={Link} to="/watch" onClick={handleClose}>Watch</MenuItem>
		</Menu>
		</div>
	)

	//Nav buttons in header maybe to throw away
	//const buttons = (
	//	<Stack spacing={2} direction="row">
	//		<Button
	//			variant="text"
	//			component={Link}
	//			to="/chat"
	//			sx={{
	//				mr: 2,
	//				display: { xs: 'none', md: 'flex' },
	//				fontFamily: 'Work Sans, sans-serif',
	//				fontWeight: 700,
	//				color: 'inherit',
	//				textDecoration: 'none',
	//			}}
	//		>
	//			Chat
	//		</Button>
	//		<Button
	//			variant="text"
	//			component={Link}
	//			to="/play"
	//			sx={{
	//				mr: 2,
	//				display: { xs: 'none', md: 'flex' },
	//				fontFamily: 'Work Sans, sans-serif',
	//				fontWeight: 700,
	//				color: 'inherit',
	//				textDecoration: 'none',
	//			}}
	//		>
	//			Play
	//		</Button>
	//		<Button
	//			variant="text"
	//			component={Link}
	//			to="/watch"
	//			sx={{
	//				mr: 2,
	//				display: { xs: 'none', md: 'flex' },
	//				fontFamily: 'Work Sans, sans-serif',
	//				fontWeight: 700,
	//				color: 'inherit',
	//				textDecoration: 'none',
	//			}}
	//		>
	//			Watch
	//		</Button>
	//	</Stack>
	//)

	const displayDesktop = () => {
		return (
			<StyledToolbar>
				{homeButton}
				{/*<div>{buttons}</div>*/}
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

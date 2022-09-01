import { AppBar, Button, IconButton, Stack, SvgIcon, Toolbar, Typography } from '@mui/material';
import Svg42Logo from './Svg42Logo';
import { styled } from '@mui/material/styles';
import { Account } from './Account';
import { User } from '../utils/types';
import { Link } from 'react-router-dom';
import { SearchBar } from './Search';
import ColorLensIcon from '@mui/icons-material/ColorLens';

const StyledToolbar = styled(Toolbar)`
	display: flex;
	justify-content: space-between;
`

export interface IHeaderProps {
	user: User | undefined;
	setColors: (value: React.SetStateAction<boolean>) => void;
}

export function Header (props: IHeaderProps) {
	const { user, setColors } = props;

	const redirect = () => {
		window.location.href = `http://${process.env.REACT_APP_IP}:3001/api/auth/login`;
	}

	const loginButton = (user) ? (
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
			variant="h5" 
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

	const buttons = (
		<Stack spacing={0} direction="row">
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
				<div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}><SearchBar /></div>
				<IconButton onClick={() => setColors((prev: any) => !prev)} sx={{ backgroundColor: '#E6EEE8', '&:hover': { backgroundColor: '#e6eee8bc'}}}>
					<ColorLensIcon />
				</IconButton>
				<div>{loginButton}</div>
			</StyledToolbar>
		)
	}

	return (
		<AppBar position="static" sx={{ flexGrow: 0 }}>
			{displayDesktop()}
		</AppBar>
	);
}
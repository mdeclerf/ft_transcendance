import { AppBar, Button, SvgIcon, Toolbar, Typography } from '@mui/material';
import Svg42Logo from './Svg42Logo';
import { styled } from '@mui/material/styles';
import { Account } from './Account';
import { User } from '../utils/types';
import { Link } from 'react-router-dom';

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

	const displayDesktop = () => {
		return (
			<StyledToolbar>
				{transcendenceLogo}
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

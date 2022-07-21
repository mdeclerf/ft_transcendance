import { AppBar, Button, SvgIcon, Toolbar, Typography } from '@mui/material';
import * as React from 'react';
import Svg42Logo from './Svg42Logo';
import { styled, alpha } from '@mui/material/styles';
import { Account } from './Account';
import { User } from '../utils/types';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

//searchbar
const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
	backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
	marginLeft: theme.spacing(3),
	width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
		width: '20ch',
		},
	},
}));
//end searchbar

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

	const [search, setSearch] = React.useState<string>("");

	const searchBar = (
		<Search>
		<SearchIconWrapper>
		<SearchIcon />
		</SearchIconWrapper>
		<StyledInputBase
		placeholder="Search…"
		inputProps={{ 'aria-label': 'search' }}
		onChange={(event) => {
			setSearch(event.target.value);
		}}
		onKeyDown={(event) => {
			if (event.key === 'Enter')
			{
			  if (search !== "")
				
			  event.preventDefault();//avoid refreshing at each enter
			  setSearch('');
			}
		  }}
		/>
		</Search>
	)

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
			component="a"
			href="/"
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
				<div>{searchBar}</div>
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

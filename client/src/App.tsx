import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route} from 'react-router-dom/';
import { LoginPage } from './Pages/LoginPage';
import { useFetchCurrentUser } from './utils/hooks/useFetchCurrentUser';
//import Chat from "./Chat/Chat";
import { Logout } from './Pages/Logout';
import  Mode from './Game/Mode';
import  theme_2  from './themes/2';
import  theme_1  from './themes/1';
import Canvas from './Game/canvas';
import Watch from './Game/watch';
import { Grid } from '@mui/material';
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import { Header } from './Components/Header';
import { Fab } from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { Avatar, Button, CircularProgress } from '@mui/material/';
import { CenteredDiv } from './utils/styles';
import { Profile } from './Pages/Profile';
import { LeaderBoard } from './Pages/Leaderboard';
import { MyAccount } from './Pages/MyAccount';
import { WelcomePage } from './Pages/WelcomePage';
import { UserPage } from './Pages/UserPage';
import { TwoFactor } from './Pages/TwoFactor';
import AuthCode, { AuthCodeRef } from 'react-auth-code-input';
import axios from 'axios/';
import { PlayGame } from './Game/Leave';
import { useFetchUser } from './utils/hooks/useFetchUser';

const fabStyle = {
	position: 'absolute',
	bottom: 16,
	left: 16,
};

function App() {
	let { user, error, loading, setUser } = useFetchCurrentUser();
	let { games } = useFetchUser(user?.username);
	const [twoFactorCode, setTwoFactorCode] = useState('');
	const AuthInputRef = useRef<AuthCodeRef>(null);
	const AuthInputDivRef = useRef<HTMLDivElement>(null);
	const ButtonRef = useRef<HTMLButtonElement>(null);
	const [colors, setColors] = React.useState(true);

	useEffect(() => {
		const keyDownHandler = (event: KeyboardEvent) => {
			if (event.key === "Enter") {
				event.preventDefault();
				ButtonRef.current?.click();
			}
		};
		document.addEventListener("keydown", keyDownHandler);
		return () => {
			document.removeEventListener("keydown", keyDownHandler);
		};
	}, []);

	const handleChange = (res: string) => {
		setTwoFactorCode(res);
		AuthInputDivRef.current?.classList.remove('error');
	}

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		axios
			.post('http://localhost:3001/api/2fa/authenticate', { twoFactorAuthCode: twoFactorCode }, { withCredentials: true})
			.then(() => {
				window.location.reload();
			})
			.catch(err => {
				AuthInputRef.current?.clear();
				AuthInputDivRef.current?.classList.add('error');
			})
	}

	if (loading) return <CenteredDiv><CircularProgress /></CenteredDiv>

	return (
		<>
			<ThemeProvider theme={colors ? theme_1 : theme_2}>

			<Header user={user} error={error}/>

			<CssBaseline/>
			<Fab sx={fabStyle} color="primary" onClick={() => setColors((prev: any) => !prev)}>
				<ColorLensIcon />
			</Fab>

			{((user && !user.isTwoFactorAuthenticationEnabled) || (user && user.isTwoFactorAuthenticationEnabled && user.isSecondFactorAuthenticated)) && !error ?
				<Routes>
					<Route path="/" element={<WelcomePage/>} />
					{/*<Route path="/chat" element={<Chat/>}/>*/}
					<Route path="/game" element={<Mode/> }/>
					<Route path="/profile" element={<Profile user={user} games={games}/>} />
					<Route path="/user/:username" element={<UserPage/>}/>
					<Route path="/account" element={<MyAccount user={user} setUser={setUser}/>} />
					<Route path="/logout" element={<Logout/>}/>
					<Route path="/2fa" element={<TwoFactor user={user} />}/>


					<Route path="/leaderboard" element={
						<Grid container justifyContent='center' sx={{pt: 10}}>
							<LeaderBoard user={user} />
						</Grid>} />

					<Route path='/chatmode' element={
						<Grid container justifyContent='center'>
							<Canvas/>
						</Grid> }>
					</Route>

					<Route path='/play' element={
						<PlayGame user={user}/> }>
					</Route>

					<Route path='/watch' element={
						<Grid container justifyContent='center'>
							<Watch/>
						</Grid> }>
					</Route>

				</Routes>
				:
				<Routes>
					{ user?.isTwoFactorAuthenticationEnabled && 
						<Route 
							path="*" 
							element={
								<CenteredDiv>
									<h1>Welcome{user.username}</h1>
									<Avatar
										alt={user?.username}
										src={user?.photoURL}
										sx={{
											minWidth: { xs: 255 },
											minHeight: { xs: 255 }
										}}
									/>
									<br/><br/>
									<div ref={AuthInputDivRef}>
										<AuthCode 
											allowedCharacters='numeric'
											onChange={handleChange}
											inputClassName='authCodeInput'
											containerClassName='authCodeContainer'
											ref={AuthInputRef}
										/>
									</div>
									<Button ref={ButtonRef} onClick={handleClick} variant="contained">Login with 2FA</Button>
								</CenteredDiv>
							}
						/>
					}
					{ !user?.isTwoFactorAuthenticationEnabled && 
						<Route path="*" element={<LoginPage />}></Route>
					}
				</Routes>
			}
			</ThemeProvider>
		</>
	);
}

export default App;

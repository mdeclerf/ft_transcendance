import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route} from 'react-router-dom/';
import { LoginPage } from './Pages/LoginPage';
import { useFetchCurrentUser } from './utils/hooks/useFetchCurrentUser';
import { Logout } from './Pages/Logout';
import theme_2 from './themes/2';
import theme_1 from './themes/1';
import Canvas from './Game/canvas';
import Watch from './Game/watch';
import { Dialog, DialogActions, DialogContentText, DialogTitle, Grid} from '@mui/material';
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import { Header } from './Components/Header';
import { Avatar, Button } from '@mui/material/';
import { CenteredDiv } from './utils/styles';
import { LeaderBoard } from './Pages/Leaderboard';
import { MyAccount } from './Pages/MyAccount';
import { WelcomePage } from './Pages/WelcomePage';
import { UserPage } from './Pages/UserPage';
import { TwoFactor } from './Pages/TwoFactor';
import AuthCode, { AuthCodeRef } from 'react-auth-code-input';
import axios from 'axios/';
import { PlayGame } from './Game/Leave';
import { Chat } from './Chat/Chat';
import { Friends } from './Components/Friends';
import { socket } from './socket';
import { User } from './utils/types';
import { Link } from 'react-router-dom';

function App() {
	const { user, setUser } = useFetchCurrentUser();
	const [twoFactorCode, setTwoFactorCode] = useState('');
	const AuthInputRef = useRef<AuthCodeRef>(null);
	const AuthInputDivRef = useRef<HTMLDivElement>(null);
	const ButtonRef = useRef<HTMLButtonElement>(null);
	const [colors, setColors] = React.useState(true);
	const [invitation, setInvitation] = React.useState(false);
	const [invitingUser, setInvitingUser] = React.useState<User>();

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
			socket.close();
		};
	}, []);

	useEffect(() => {
		if (user) socket.emit('identity', user?.id);
	}, [user]);
	
	useEffect(() => {
		socket.on('invitation_alert', (message:User) => {
			setInvitation(true);
			setInvitingUser(message);
		});
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

	return (
		<div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
			<ThemeProvider theme={colors ? theme_1 : theme_2}>
				<Header user={user} setColors={setColors}/>
				<CssBaseline/>

				{((user && !user.isTwoFactorAuthenticationEnabled) || (user && user.isTwoFactorAuthenticationEnabled && user.isSecondFactorAuthenticated)) ?
					<Routes>
						<Route path="/" element={<WelcomePage/>} />
						<Route path="/chat" element={<Chat/>}/>
						<Route path="/profile" element={<UserPage userProps={user}/>} />
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
								<Canvas user={user}/>
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
										<h1>Welcome {user.username}</h1>
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

				<Friends user={user} />

				<Dialog open={invitation} maxWidth="md">
					<DialogTitle id="alert-dialog-title" sx={{mx:5, display: 'flex', justifyContent: 'center'}}>{`${invitingUser?.username} invited you to a game !`}</DialogTitle>
					<DialogContentText id="alert-dialog-description" sx={{mx:5, display: 'flex', justifyContent: 'center'}}>Accepting the invitation will redirect you to a private game page</DialogContentText>
					<DialogActions>
						<Button component={Link} to="/chatmode" onClick={() => { 
							setInvitation(false); 
							socket.emit('invitation_accepted', [invitingUser?.id, user?.id]) }}
						>Accept</Button>
						<Button onClick={() => { setInvitation(false)}} autoFocus>Decline</Button>
					</DialogActions>
				</Dialog>

			</ThemeProvider>
		</div>
	);
}

export default App;
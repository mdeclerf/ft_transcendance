import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route} from 'react-router-dom/';
import { LoginPage } from './Pages/LoginPage';
import { useFetchCurrentUser } from './utils/hooks/useFetchCurrentUser';
import { Game } from './Pages/Game';
import { Logout } from './Pages/Logout';
import { Header } from './Components/Header';
import { Avatar, Button, CircularProgress } from '@mui/material/';
import { CenteredDiv } from './utils/styles';
import { Profile } from './Pages/Profile';
import { MyAccount } from './Pages/MyAccount';
import { WelcomePage } from './Pages/WelcomePage';
import { UserPage } from './Pages/UserPage';
import { TwoFactor } from './Pages/TwoFactor';
import AuthCode, { AuthCodeRef } from 'react-auth-code-input';
import axios from 'axios/';

function App() {
	const { user, error, loading } = useFetchCurrentUser();
	const [twoFactorCode, setTwoFactorCode] = useState('');
	const AuthInputRef = useRef<AuthCodeRef>(null);
	const AuthInputDivRef = useRef<HTMLDivElement>(null);
	const ButtonRef = useRef<HTMLButtonElement>(null);

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
			<Header user={user} error={error}/>
			{((user && !user.isTwoFactorAuthenticationEnabled) || (user && user.isTwoFactorAuthenticationEnabled && user.isSecondFactorAuthenticated)) && !error ?
				<Routes>
					<Route path="/" element={<WelcomePage />} />
					<Route path="/game" element={<Game />}/>
					<Route path="/spectate" />
					<Route path="/chat" />
					<Route path="/profile" element={<Profile user={user}/>} />
					<Route path="/user/:username" element={<UserPage />}/>
					<Route path="/account" element={<MyAccount user={user} />} />
					<Route path="/logout" element={<Logout />}/>
					<Route path="/2fa" element={<TwoFactor user={user} />}/>
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
		</>
	);
}

export default App;

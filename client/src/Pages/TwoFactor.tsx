import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import AuthCode, { AuthCodeRef } from 'react-auth-code-input';
import { useFetchQRCode } from '../utils/hooks/useFetchQRCode';
import { CenteredDiv } from '../utils/styles';
import { User } from '../utils/types';

export interface ITwoFactorProps {
	user: User;
}

export function TwoFactor (props: ITwoFactorProps) {
	const { user } = props;
	const { QRCode } = useFetchQRCode();
	const AuthInputRef = useRef<AuthCodeRef>(null);
	const AuthInputDivRef = useRef<HTMLDivElement>(null);
	const ButtonRef = useRef<HTMLButtonElement>(null);

	const [message, setMessage] = React.useState('');

	const handleChange = (res: string) => {
		setMessage(res);
		AuthInputDivRef.current?.classList.remove('error');
	}

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const url: string = `http://localhost:3001/api/2fa/turn_${user.isTwoFactorAuthenticationEnabled ? 'off' : 'on' }`
		axios.post(url, { twoFactorAuthCode: message }, { withCredentials: true })
			.then(() => {
				window.location.reload();
			})
			.catch(err => {
				AuthInputRef.current?.clear();
				AuthInputDivRef.current?.classList.add('error');
			})
	}

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

	return (
		<CenteredDiv>
			{ !user.isTwoFactorAuthenticationEnabled &&
				<img src={QRCode} alt="qr code"/>
			}
			<div ref={AuthInputDivRef}>
				<AuthCode 
					allowedCharacters='numeric'
					onChange={handleChange}
					inputClassName='authCodeInput'
					containerClassName='authCodeContainer'
					ref={AuthInputRef}
				/>
			</div>
			<Button ref={ButtonRef} onClick={handleClick} variant="contained" size="large" color={user.isSecondFactorAuthenticated ? 'error' : 'success'}>Turn {user.isTwoFactorAuthenticationEnabled ? 'off' : 'on'} 2FA</Button>
		</CenteredDiv>
	);
}

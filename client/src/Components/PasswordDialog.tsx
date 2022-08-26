import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

export interface IPasswordDialogProps {
	title: string;
	setPassAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PasswordDialog (props: IPasswordDialogProps) {
	const { title, setPassAuthenticated } = props;
	const [open, setOpen] = useState(true);
	const [password, setPassword] = useState("");
	const [incorrect, setIncorrect] = useState(false);

	
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.currentTarget.value);
	}

	const handleCancel = () => {
		setOpen(false);
	}

	const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleClick();
		}
	}

	const handleClick = () => {
		axios.post('http://localhost:3001/api/chat/check_password', { name: title, password })
			.then(() => {
				setOpen(false);
				setPassAuthenticated(true);
			})
			.catch(err => {
				setIncorrect(true);
				setPassword("");
			})
	}

	return (
		<Dialog open={open}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<TextField
					value={password}
					type="password"
					onChange={handleChange}
					onKeyDown={handleEnter}
					error={incorrect}
					helperText={incorrect ? 'Incorrect password' : ''}
					label="Password..."
					autoFocus
					margin="normal"
					fullWidth
					sx={{ mb: 2 }}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel}>Cancel</Button>
				<Button onClick={handleClick}>Apply</Button>
			</DialogActions>
		</Dialog>
	);
}

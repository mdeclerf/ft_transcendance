import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton, Divider } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import * as React from 'react';
import axios from 'axios';

export interface SettingsDialogProps {
	open: boolean;
	setOpen: (value: boolean) => void;
	room: string | undefined;
}

function SettingsDialog(props: SettingsDialogProps) {
	const { setOpen, open, room } = props;

	const [password, setPassword] = React.useState<string>('');

	const handleChangePassword = (event: any) => {
		setPassword(event.target.value as string);
	};

	const handleClose = () => {
		setOpen(false);
		if (password !== '')
			axios.post("http://localhost:3001/api/chat/set_password", {password: password, name: room}, { withCredentials: true })
				.catch(err => {
					;
				})
		setPassword("");
	};

	const handleCancel = () => {
		setOpen(false);
		setPassword("");
	};

	const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleClose();
		}
	}

	return (
		<Dialog onClose={handleCancel} open={open}>
			<DialogTitle>Set up</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Set up your channel
				</DialogContentText>
				<TextField value={password} onChange={handleChangePassword} onKeyDown={handleEnter} type="password" label="Set password" autoFocus margin="normal" variant="standard" fullWidth sx={{mb:2}}/>
				<Divider />
				
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel}>Cancel</Button>
				<Button onClick={handleClose}>Apply</Button>
			</DialogActions>
		</Dialog>
	);
}

export interface IRoomSettingsProps {
	room: string | undefined;
};

export const RoomSettings = (props: IRoomSettingsProps) => {
	const { room } = props;
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	return (
		<div>
			<IconButton onClick={handleClickOpen}>
				<SettingsIcon />
			</IconButton>
			<SettingsDialog
				open={open}
				setOpen={setOpen}
				room={room}
			/>
		</div>
	)
}
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton, Divider } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import * as React from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

export interface SettingsDialogProps {
	isProtected: boolean;
	open: boolean;
	setOpen: (value: boolean) => void;
	room: string | undefined;
}

function SettingsDialog(props: SettingsDialogProps) {
	const { isProtected, setOpen, open, room } = props;

	const [password, setPassword] = React.useState<string>('');

	const handleChangePassword = (event: any) => {
		setPassword(event.target.value as string);
	};

	const handleClose = () => {
		setOpen(false);
		if (password !== '')
			axios.post(`http://${process.env.REACT_APP_IP}:3001/api/chat/set_password`, {password: password, name: room}, { withCredentials: true })
				.catch(err => {
					;
				})
		setPassword("");
	};

	const passwordDelete = async () => {
		setOpen(false);
			await axios.post(`http://${process.env.REACT_APP_IP}:3001/api/chat/delete_password`, {name: room}, { withCredentials: true })
				.catch(err => {
					;
				})
		setPassword("");
	}

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
				{isProtected && <Button variant="outlined" onClick={passwordDelete}>
							<DeleteIcon />
						</Button>}
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
	isProtected: boolean;
};

export const RoomSettings = (props: IRoomSettingsProps) => {
	const { room, isProtected } = props;
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
				isProtected={isProtected}
				open={open}
				setOpen={setOpen}
				room={room}
			/>
		</div>
	)
}
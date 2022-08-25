import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import * as React from 'react';
import axios from 'axios';
// import { Room } from '../utils/types';
// import bcrypt from 'bcrypt'

export interface SettingsDialogProps {
	open: boolean;
	setOpen: (value: boolean) => void;
	room: string;
}

function SettingsDialog(props: SettingsDialogProps) {
	const { setOpen, open, room } = props;

	const [password, setPassword] = React.useState<string>('');

	const handleChangePassword = (event: any) => {
		setPassword(event.target.value as string);
	};


	const handleClose = () => {
		setOpen(false);
		// const hashedPassword = bcrypt.hashSync(password, '$2a$10$CwTycUXWue0Thq9StjUM0u'); // faut pas faire ca, faut hash cote server !
		console.log(password);
		console.log(room);
		axios.post("http://localhost:3001/api/chat/send_password", {password: password, name: room})
			.then(() => {
				;
			})
			.catch(err => {
				;
			})
		setPassword("");
	};

	const handleCancel = () => {
		setOpen(false);
		setPassword("");
	};

	return (
		<Dialog onClose={handleCancel} open={open}>
			<DialogTitle>Set up</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Set up your channel
				</DialogContentText>
				<TextField value={password} onChange={handleChangePassword} label="Set password" autoFocus margin="normal" variant="standard" fullWidth sx={{mb:2}}/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel}>Cancel</Button>
				<Button onClick={handleClose}>Apply</Button>
			</DialogActions>
		</Dialog>
	);
}

export interface IRoomSettingsProps {
	room: string;
};

export const RoomSettings = (props: IRoomSettingsProps) => {
	const { room } = props;
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	return (
		<div>
			<Button sx={{marginTop:"2%"}}variant="outlined" startIcon={<SettingsIcon />} onClick={handleClickOpen} fullWidth>
				Settings
			</Button>
			<SettingsDialog
				open={open}
				setOpen={setOpen}
				room={room}
			/>
		</div>
	)
}
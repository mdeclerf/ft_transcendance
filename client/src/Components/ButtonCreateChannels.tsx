import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import * as React from 'react';
import axios from 'axios';
import { Room } from '../utils/types';
import { socket } from '../socket';
// import { switchRoom } from '../utils/socket_helpers';

export interface SimpleDialogProps {
		open: boolean;
		setOpen: (value: boolean) => void;
		switchRooms: (room: Room) => void;
	}
	
function SimpleDialog(props: SimpleDialogProps) {
	const { setOpen, open, switchRooms } = props;

	const [name, setName] = React.useState<string>('');

	const handleChangeName = (event: any) => {
		setName(event.target.value as string);
	};

	const handleClose = () => {
		setOpen(false);
		axios.post("http://localhost:3001/api/chat/create_channel", {name: name.toLowerCase(), type: 'public', hash: ""})
			.then(() => {
				socket.emit('room_created', name);
				switchRooms({ name });
			})
			.catch(err => {
				if (err) throw err;
			});
		setName("");
	};

	const handleCancel = () => {
		setOpen(false);
		setName("");
	};


	return (
		<Dialog onClose={handleCancel} open={open}>
			<DialogTitle>Create Channel</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Create a new channel
				</DialogContentText>
				<TextField value={name} onChange={handleChangeName} label="Channel name" autoFocus margin="normal" variant="standard" fullWidth sx={{mb:2}}/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel}>Cancel</Button>
				<Button onClick={handleClose}>Create</Button>
			</DialogActions>
		</Dialog>
	);
}

export interface IButtonCreateChannelsProps {
	switchRooms: (room: Room) => void;
};

export const ButtonCreateChannels = (props: IButtonCreateChannelsProps) => {
	const { switchRooms } = props;
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};
	
	return (
		<div>
			<Button sx={{marginTop:"2%"}} variant="outlined" startIcon={<AddIcon />} onClick={handleClickOpen} fullWidth>
				Create channel
			</Button>
			<SimpleDialog
				open={open}
				setOpen={setOpen}
				switchRooms={switchRooms}
			/>
		</div>
	)
}
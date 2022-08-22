import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, TextField } from '@mui/material';
import * as React from 'react';
import { useState, useEffect } from 'react';

export interface IChatProps {
}
function Chat (props: IChatProps) {

	const [currentRoom, setCurrentRoom] = useState<string>("General");

	//Dialog functions
	const [openDialog, setOpenDialog] = useState(false);

	const handleClickOpen = () => {
		setOpenDialog(true);
	};

	const handleClose = () => {
		setOpenDialog(false);
	};
	//End dialog functions

	return (
		<div className="columns">
			{/* colonne de gauche */}
			<div className="col1">
				<Paper sx={{
					width: "100%",
					height: "calc(100vh - 64px)",
					position: "relative",
					backgroundColor: "rgba(0, 0, 0, 0)",
					overflowY: "scroll",
					padding: "0"
				}}>
					{/* bouton pour ouvrir dialogue (fenetre pour entre room name) public */}
					<Button fullWidth={true} variant="contained" size="large" onClick={handleClickOpen}>Create Public Room</Button>
					<Dialog open={openDialog} onClose={handleClose}>
						<DialogTitle>Create a public room</DialogTitle>
						<DialogContent>
							<DialogContentText>Please enter a room name : </DialogContentText>
							<TextField
								autoFocus
								margin="dense"
								type="text"
								fullWidth
								variant="standard"
								onChange={(event: any) => {
									setCurrentRoom(event.target.value);
								}}
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose}>Cancel</Button>
							<Button onClick={handleClose}>Create Room</Button>
						</DialogActions>
					</Dialog>
					{/* bouton pour ouvrir dialogue (fenetre pour entre room name et password) private */}
					{/*<Button onClick={joinRoom} fullWidth={true} variant="contained" size="large"> Create Private Room</Button>*/}
					{/* affichage des channels dispo et creation d un bouton / room */}
					{/*<>
						{ loadChannels }
					</>*/}
					</Paper>
			</div>
		</div>
	);
}
export default Chat;
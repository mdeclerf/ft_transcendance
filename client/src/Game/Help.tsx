import HelpIcon from '@mui/icons-material/Help';
import { Dialog, Fab, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';

const fabStyle = {
	position: 'absolute',
	bottom: 16,
	right: 16,
};

export function WIcon() {
	return (
		<Paper sx={{ ml: 1.7, boxShadow: 'none' }}>
			<img
				alt=""
				src={require('../Images/keyboard_key_w.png')}
				width="50"
				height="50"
			></img>
		</Paper>
	);
}

export function SIcon() {
	return (
		<Paper sx={{ ml: 1.7, boxShadow: 'none' }}>
			<img
				alt=""
				src={require('../Images/keyboard_key_s.png')}
				width="50"
				height="50"
			></img>
		</Paper>
	);
}

export function Help() {
	const [HelpOpen, setHelpOpen] = useState<boolean>(false);
	return (
		<div>
			<Fab
				sx={fabStyle}
				color="primary"
				onClick={() => setHelpOpen(true)}
			>
				<HelpIcon />
			</Fab>
			{HelpOpen && (
				<Dialog
					open={HelpOpen}
					onClose={() => setHelpOpen(false)}
					maxWidth="md"
				>
					<DialogTitle>How to play ?</DialogTitle>
					<List>
						<ListItem disablePadding>
							<ListItemIcon color="secondary">
								<WIcon />
							</ListItemIcon>
							<ListItemText
								sx={{
									fontFamily: 'Work Sans, sans-serif',
									fontSize: 60,
									mr: 2,
									ml: 1,
								}}
								primary="For moving your paddle up"
							/>
						</ListItem>

						<ListItem disablePadding>
							<ListItemIcon>
								<SIcon />
							</ListItemIcon>
							<ListItemText
								sx={{
									fontFamily: 'Work Sans, sans-serif',
									fontSize: 60,
									mr: 2,
									ml: 1,
								}}
								primary="For moving your paddle down"
							/>
						</ListItem>
					</List>
					<Button
						variant="contained"
						sx={{
							fontFamily: 'Work Sans, sans-serif',
							mx: 2,
							mb: 2,
						}}
						onClick={() => setHelpOpen(false)}
					>
						Got it
					</Button>
				</Dialog>
			)}
		</div>
	);
}

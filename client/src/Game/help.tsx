import React, { useState} from 'react';
import Button from '@mui/material/Button';
import { Dialog } from '@mui/material';
import { Fab } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Paper } from '@mui/material';

const fabStyle = {
	position: 'absolute',
	bottom: 85,
	left: 16,
};

export function WIcon() {
    return (
        <Paper sx={{ml:1.5, boxShadow: "none"}}>
            <img alt="" src="https://img.icons8.com/ios-filled/344/w-key.png" width="50" height="50"></img>
        </Paper>
    );
}

export function SIcon() {
    return (
        <Paper sx={{ml:1.5, boxShadow: "none"}}>
            <img alt="" src="https://img.icons8.com/ios-filled/344/s-key.png" width="50" height="50"></img>
        </Paper>
    );
}

export function Help() {
    const [HelpOpen, setHelpOpen] = useState<boolean>(false);
	return (
        <div>
            <Fab sx={fabStyle} color="primary" onClick={() => setHelpOpen(true)}>
                <HelpIcon />
            </Fab>
            { HelpOpen && 
            <Dialog open={HelpOpen} onClose={() => setHelpOpen(false)} maxWidth="md">
                <DialogTitle>How to play ?</DialogTitle>
                <List>
                    <ListItem disablePadding>
                        <ListItemIcon color="secondary">
                            <WIcon/>
                        </ListItemIcon>
                        <ListItemText sx={{ fontFamily: 'Work Sans, sans-serif', fontSize: 60, mr:2, ml:1}} primary="For moving your paddle up" />
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemIcon>
                            <SIcon/>
                        </ListItemIcon>
                        <ListItemText sx={{ fontFamily: 'Work Sans, sans-serif', fontSize: 60, mr:2, ml:1}} primary="For moving your paddle down" />
                    </ListItem>
                </List>
                <Button variant="contained" sx={{fontFamily: 'Work Sans, sans-serif', mx:2, mb:2}} onClick={() => setHelpOpen(false)}>Got it</Button>
            </Dialog>}
        </div>
    );
}

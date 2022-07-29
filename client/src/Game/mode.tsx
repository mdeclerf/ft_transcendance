import React from 'react';
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function Mode() {
	const location = useLocation();
	return (
		<>
		{ ( location.pathname === "/game" ) &&
			<Box textAlign='center'>
			<ButtonGroup  disableElevation color="primary" variant="contained" size="large">
				<Button component={Link} to="/chatmode" size="large">
					Chat mode
				</Button>

				<Button component={Link} to="/normal" >
					Normal mode
				</Button>

				<Button component={Link} to="/watch" >
					Watch mode
				</Button>
			</ButtonGroup>
			</Box> }
		</>
	);
}

export default Mode;

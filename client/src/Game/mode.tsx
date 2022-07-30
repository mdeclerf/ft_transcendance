import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

function Mode() {

	return (
		<>
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
			</Box> 
		</>
	);
}

export default Mode;

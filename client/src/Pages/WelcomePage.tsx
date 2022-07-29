import { CenteredDiv } from "../utils/styles";
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export const WelcomePage = () => {
	return (
		<CenteredDiv>
			<Button component={Link} to="/chat" variant="contained" sx={{m: 1}} size="large">
				Chat
			</Button>

			<Button component={Link} to="/normal" variant="contained" sx={{m: 1}} size="large">
				Play
			</Button>

			<Button component={Link} to="/watch" variant="contained" sx={{m: 1}} size="large">
				Watch
			</Button>
		</CenteredDiv>
	)
}

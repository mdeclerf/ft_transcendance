import { CenteredDiv } from "../utils/styles";
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
// import { io } from "socket.io-client";

// const socket = io('http://localhost:3001', { transports : ['websocket'], secure: true });

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

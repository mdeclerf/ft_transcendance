import { CenteredDiv } from "../utils/styles";
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export interface IWelcomePageProps {
}

export const WelcomePage = (props: IWelcomePageProps) => {
	return (
		<CenteredDiv>
			<Button component={Link} to="/chat" variant="contained" sx={{m: 1, maxWidth: '200px', maxHeight: '100px', minWidth: '200px', minHeight: '100px', fontSize: '40px', fontFamily: 'Work Sans, sans-serif'}}>
				Chat
			</Button>

			<Button component={Link} to="/play" variant="contained" sx={{m: 1, maxWidth: '200px', maxHeight: '100px', minWidth: '200px', minHeight: '100px', fontSize: '40px', fontFamily: 'Work Sans, sans-serif'}}>
				Play
			</Button>

			<Button component={Link} to="/watch" variant="contained" sx={{m: 1, maxWidth: '200px', maxHeight: '100px', minWidth: '200px', minHeight: '100px', fontSize: '40px', fontFamily: 'Work Sans, sans-serif'}}>
				Watch
			</Button>
		</CenteredDiv>
	)
}

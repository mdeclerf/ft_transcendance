import axios from "axios/";

export const Logout = () => {
	axios.get(`http://${process.env.REACT_APP_IP}:3001/api/auth/logout`, { withCredentials: true});

	return (
		<div>
			<h1>Logged out</h1>
		</div>
	)
}
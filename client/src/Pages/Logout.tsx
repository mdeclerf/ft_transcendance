import axios from "axios/";

export const Logout = () => {
	axios.get('http://localhost:3001/api/auth/logout', { withCredentials: true});

	return (
		<div>
			<h1>Logged out</h1>
		</div>
	)
}
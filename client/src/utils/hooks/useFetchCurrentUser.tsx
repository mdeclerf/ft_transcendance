import { useEffect, useState } from "react";
import { getAuthStatus } from "../api";
import { User } from "../types";

export function useFetchCurrentUser() {
	const [ user, setUser ] = useState<User>();

	useEffect(() => {
		getAuthStatus()
			.then(({ data }) => {
				setUser(data);
			})
			.catch((err) => {
				if (err) throw err;
			});
	}, [])

	return { user, setUser };
}

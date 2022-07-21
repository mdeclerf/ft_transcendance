import { useEffect, useState } from "react";
import { getUser } from "../api";
import { User } from "../types";

export function useFetchUser(username: string | undefined) {
	const [ user, setUser ] = useState<User>();
	const [ error, setError ] = useState();
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
		setLoading(true);
		getUser(username)
			.then(({ data }) => {
				setLoading(false);
				setUser(data.user);
			})
			.catch((err) => {
				setLoading(false);
				setError(err);
			});
	}, [username])

	return { user, error, loading };
}

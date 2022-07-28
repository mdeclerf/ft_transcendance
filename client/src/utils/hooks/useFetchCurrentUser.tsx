import { useEffect, useState } from "react";
import { getAuthStatus } from "../api";
import { User } from "../types";

export function useFetchCurrentUser() {
	const [ user, setUser ] = useState<User>();
	const [ error, setError ] = useState();
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
		setLoading(true);
		getAuthStatus()
			.then(({ data }) => {
				console.log(data);
				setLoading(false);
				setUser(data);
			})
			.catch((err) => {
				setLoading(false);
				setError(err);
			})
			.finally(() => setTimeout(() => setLoading(false), 1000));
	}, [])

	return { user, error, loading };
}

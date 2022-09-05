import { useEffect, useState } from "react";
import { getUser } from "../api";
import { Game, User } from "../types";

export function useFetchUser(username: string | undefined) {
	const [ user, setUser ] = useState<User>();
	const [ games, setGames ] = useState<Game[]>();
	const [ error, setError ] = useState();
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
		setLoading(true);
		getUser(username)
			.then(({ data }) => {
				setLoading(false);
				setUser(data.user);
				setGames(data.games);
			})
			.catch((err) => {
				setLoading(false);
				setError(err);
			});
	}, [username])

	return { user, error, loading, games };
}

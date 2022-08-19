import { useEffect, useState } from "react";
import { getAuthStatus } from "../api";
import { User } from "../types";

export function useFetchCurrentUser() {
	const [ user, setUser ] = useState<User>({ id: '0', intraId: '0', photoURL: '', username: '', displayName: '', isSecondFactorAuthenticated: false, isTwoFactorAuthenticationEnabled: false });
	const [ error, setError ] = useState();
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
		setLoading(true);
		getAuthStatus()
			.then(({ data }) => {
				setLoading(false);
				setUser(data);
			})
			.catch((err) => {
				setLoading(false);
				setError(err);
			});
	}, [])

	return { user, error, loading };
}

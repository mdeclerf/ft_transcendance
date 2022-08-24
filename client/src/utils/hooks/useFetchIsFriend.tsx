import { useEffect, useState } from "react";
import { getIsFriend } from "../api";

export function useFetchIsFriend(friendId: string | undefined) {
	const [isFriend, setIsFriend] = useState(false);

	useEffect(() => {
		getIsFriend(friendId)
			.then(({ data: isFriend }) => {
				setIsFriend(isFriend);
			})
			.catch(err => {
				if (err) throw err;
			})
	}, [friendId]);

	return isFriend;
}
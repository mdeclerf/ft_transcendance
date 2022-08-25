import { useEffect, useState } from "react";
import { getIsBlocked } from "../api";

export function useFetchIsBlocked(blockeeId: string | undefined) {
	const [isBlocked, setIsBlocked] = useState(false);

	useEffect(() => {
		getIsBlocked(blockeeId)
			.then(({ data: isBlocked }) => {
				setIsBlocked(isBlocked);
			})
			.catch(err => {
				if (err) throw err;
			})
	}, [blockeeId]);

	return isBlocked;
}

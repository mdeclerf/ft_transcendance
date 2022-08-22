import { useEffect, useState } from "react";
import { getLeaderBoard } from "../api";
import { Ranking } from "../types";

export function useFetchLeader() {
	const [ Response, setResponse ] = useState<Ranking[]>();

	useEffect(() => {
		getLeaderBoard()
			.then(({ data }) => {
				setResponse(data);
			})
	}, [])

	return { Response};
}
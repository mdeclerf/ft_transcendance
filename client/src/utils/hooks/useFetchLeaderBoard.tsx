import { useEffect, useState } from "react";
import { getLeaderBoard } from "../api";

export function useFetchLeader() {

	useEffect(() => {
		getLeaderBoard()
			.then(({ data }) => {
				console.log("TEWDGSDGSGDFS")
				console.log(data);
				return (data);
			})
	}, [])
}

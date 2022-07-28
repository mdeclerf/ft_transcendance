import { useEffect, useState } from "react";
import { getQRCode } from "../api";

export function useFetchQRCode() {
	const [QRCode, setQRCode] = useState("");

	useEffect(() => {
		getQRCode()
			.then(({ data }) => {
				setQRCode(URL.createObjectURL(data));
			})
			.catch(err => {
				console.log(err);
			})
	}, [])

	return { QRCode }
}
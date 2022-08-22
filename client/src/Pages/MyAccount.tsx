import { Button, IconButton, TextField, Tooltip, Typography } from "@mui/material/"
import axios from "axios/";
import React, { ChangeEvent, useState } from 'react';
import { CustomAvatar } from "../Components/CustomAvatar";
import { CenteredDiv } from "../utils/styles"
import { NameChangeResponse, User } from "../utils/types"

export interface IMyAccountProps {
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User>>
}

export const MyAccount = (props: IMyAccountProps) => {
	const { user, setUser } = props;

	const [taken, setTaken] = useState(false);

	const handleNameChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			axios.get<NameChangeResponse>(`http://localhost:3001/api/user/name_change?username=${event.target.value}`, { withCredentials: true })
				.then(res => {
					setTaken(res.data.taken);
					setUser(res.data.user);
				})
		}
	}

	const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
		const fileList = event.target.files;

		if (!fileList) return;

		const fileSelected = fileList[0];
		if (fileSelected.size > 2097152)
		{
			window.alert("image too big (max: 4MB)");
			return;
		}

		const formData = new FormData();
		formData.append("file", fileSelected, fileSelected.name);

		axios.post('http://localhost:3001/api/user/upload', formData, {
			headers: {
				"Content-Type": "multipart-form/data",
			},
			withCredentials: true,
		}).then(res => {
			window.location.reload();
		}).catch(err => {
			console.log(err);
		});
	};

	return (
		<CenteredDiv>
			<div>
				<IconButton component="label">
					<CustomAvatar user={user} minSize={255} />
					<input 
						accept="image/*"
						hidden
						type="file"
						id="file-upload"
						name="file"
						onChange={handleImageChange}
					/>
				</IconButton>
			</div>
			<div>
				<Tooltip title={user?.displayName ? user.displayName : ""} placement="right">
					<Typography 
						variant="h4"
						component="div"
						sx={{
							fontFamily: 'Work Sans, sans-serif',
							fontWeight: 700,
							color: 'inherit',
							marginBottom: '20px',
						}}
					>
						{user?.username}
					</Typography>
				</Tooltip>
				<TextField
					label="Change username"
					variant="outlined"
					defaultValue={user?.username}
					onKeyDown={handleNameChange}
					error={taken}
					helperText={taken ? "Username already exists" : ""}
				/>
			</div>
			<br/>
			<Button href="/2fa" variant="contained">{`${user.isTwoFactorAuthenticationEnabled ? "Disable" : "Enable"} Two Factor Authentication`}</Button>
		</CenteredDiv>
	)
}
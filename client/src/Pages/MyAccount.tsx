import { Avatar, IconButton, TextField, Tooltip, Typography } from "@mui/material/"
import axios from "axios/";
import React, { ChangeEvent, useState } from 'react';
import { CenteredDiv, StyledBadge } from "../utils/styles"
import { NameChangeResponse, User } from "../utils/types"

export interface IMyAccountProps {
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

export const MyAccount = (props: IMyAccountProps) => {
	const {user, setUser} = props;

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
					<StyledBadge
						overlap="circular"
						anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						variant="dot"
					>
						<Avatar
							alt={user?.username}
							src={user?.photoURL}
							sx={{
								minWidth: { xs: 255 },
								minHeight: { xs: 255 }
							}}
						/>
					</StyledBadge>
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
						sx={{
							mr: 2,
							fontFamily: 'Work Sans, sans-serif',
							fontWeight: 700,
							color: 'inherit',
							textDecoration: 'none',
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
		</CenteredDiv>
	)
}
import { Avatar, Box, Grid, List, ListItem, ListItemText, Typography } from "@mui/material/";
import React from "react";
import { ProfileDiv, StyledBadge } from "../utils/styles"
import { User } from "../utils/types"

export interface IProfileProps {
	user: User | undefined;
}

export const Profile = (props: IProfileProps) => {
	const { user } = props;

	const generate = (element: React.ReactElement) => {
		return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value, i) =>
			React.cloneElement(element, {
				key: value,
				sx: {
					borderRadius: '10px',
					backgroundColor: (Math.round(Math.random())) ? '#c84949' : '#49c860',
					marginTop: '2px',
				}
			})
		);
	}

	const getTypography = (content: string | undefined) => {
		return (
			<Typography 
				variant="h4" 
				component="h1"
				sx={{
					mr: 2,
					display: { xs: 'none', md: 'flex' },
					fontFamily: 'Work Sans, sans-serif',
					fontWeight: 700,
					color: 'inherit',
					textDecoration: 'none',
				}}
			>
				{content}
			</Typography>
		)
	}

	return (
		<ProfileDiv>
			<div>
				<div>
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
				</div>
				{getTypography(user?.username)}
			</div>
			<div>
				{getTypography('Match History')}
				<Box
					sx={{
						width: 800,
						height: 1000,
						padding: '5%',
						backgroundColor: 'primary.main',
						borderRadius: '20px',
					}}
				>
					<Grid item xs='auto'>
						<List>
							{generate(
								<ListItem>
									<ListItemText
										primary="mdeclerf"
									/>
								</ListItem>,
							)}
						</List>
					</Grid>
				</Box>
			</div>
		</ProfileDiv>
	)
}
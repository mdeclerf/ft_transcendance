import { Avatar, Badge, badgeClasses, Tooltip } from '@mui/material';
import React, { useEffect } from 'react';
import { UpdateStatus, User } from '../utils/types';
import { socket } from "../socket";

export interface ICustomAvatarProps {
	user: User | undefined;
	minSize?: number | undefined;
	disableTooltip?: boolean;
}

const getStatusColor = ( user: User | undefined ) => {
	if (user) {
		switch (user.status) {
			case 'online': return '#44b700';
			case 'offline': return '#b71f00';
			case 'in_game': return '#a500b7';
		}
	} else {
		return '#b71f00';
	}
}

// const getText = ( color: string | undefined ) => {
// 	if (color) {
// 		switch (color) {
// 			case '#44b700': return 'online';
// 			case '#b71f00': return 'offline';
// 			case 'in_game': return '#a500b7';
// 		}
// 	} else {
// 		return '#b71f00';
// 	}
// }

export function CustomAvatar (props: ICustomAvatarProps) {
	const { user, minSize, disableTooltip } = props;
	const [statusColor, setStatusColor] = React.useState(getStatusColor( user));
	const [tooltipOpen, setTooltipOpen] = React.useState(false);
	// const [text, setText] = React.useState(getText(statusColor))

	const ColorRet = () => {
		return statusColor;
	}

	useEffect(() => {
		socket.on('color_change', (message:UpdateStatus) => {
			console.log(message.user.status)
			if (message.user.id === user?.id)
			{
				if (message.status === "online") setStatusColor('#44b700');
				if (message.status === "offline") setStatusColor('#b71f00');
				if (message.status === 'in_game') setStatusColor('#a500b7');
			}
		});
	}, [user]);

	const badge = (
		<Badge
			overlap="circular"
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			variant="dot"
			sx={{
				'& .MuiBadge-badge': {
					backgroundColor: ColorRet(),
					boxShadow: `0 0 0 ${(minSize === 255 ? '2px': '1px')} #121212`,
				},
				[`& .${badgeClasses.dot}`]: {
					width: '15%',
					height: '15%',
					borderRadius: "50%"
				}
			}}
			onMouseOver={(event: React.MouseEvent<HTMLSpanElement>) => { 
				if ((event.target as HTMLElement).classList.contains('MuiBadge-dot'))
					setTooltipOpen(true);
			}}
			onMouseOut={(event: React.MouseEvent<HTMLSpanElement>) => { 
				setTooltipOpen(false);
			}}
		>
			<Avatar
				alt={user?.username}
				src={user?.photoURL}
				sx={{
					minWidth: { xs: minSize },
					minHeight: { xs: minSize },
				}}
			/>
		</Badge>
	)

	if (!disableTooltip) {
		return (
			<div>
				<Tooltip
					title={user?.status || ''}
					open={tooltipOpen}
					placement="bottom-end"
					PopperProps={{
						modifiers: [
							{
								name: 'offset',
								options: {
									offset: [0, -20],
								},
							},
						],
					}}
				>
					{badge}
				</Tooltip>
			</div>
		)
	} else {
		return (
			<div>
				{badge}
			</div>
		)
	}
}
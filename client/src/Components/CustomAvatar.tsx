import { Avatar, Badge, badgeClasses, Tooltip } from '@mui/material';
import * as React from 'react';
import { User } from '../utils/types';

export interface ICustomAvatarProps {
	user: User | undefined;
	minSize?: number | undefined;
	disableTooltip?: boolean;
}

export function CustomAvatar (props: ICustomAvatarProps) {
	const { user, minSize, disableTooltip } = props;
	const [tooltipOpen, setTooltipOpen] = React.useState(false);

	const getStatusColor = () => {
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

	const badge = (
		<Badge
			overlap="circular"
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			variant="dot"
			sx={{
				'& .MuiBadge-badge': {
					backgroundColor: getStatusColor(),
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
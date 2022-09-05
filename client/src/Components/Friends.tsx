import GroupIcon from '@mui/icons-material/Group';
import { Link, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { StyledSpeedDial } from '../utils/styles';
import { User } from '../utils/types';
import { CustomAvatar } from './CustomAvatar';

export interface IFriendsProps {
	user: User | undefined;
}

export function Friends (props: IFriendsProps) {
	const { user: currentUser } = props;
	const [userList, setUserList] = React.useState<User[]>();

	const handleHover = () => {
		if (currentUser)
		{
			axios
				.get<User[]>(`http://${process.env.REACT_APP_IP}:3001/api/user/get_friends`, { withCredentials: true })
				.then(res => {
					setUserList(res.data);
				})
				.catch(err => {
					if (err) throw err;
				});
		}
	}

	return (
		<StyledSpeedDial color="primary" ariaLabel="friends" icon={<SpeedDialIcon icon={<GroupIcon />} />} onOpen={handleHover}>
			{
				userList?.map((user) => (
					<SpeedDialAction
						key={user.username}
						tooltipTitle={user.username}
						icon={<Link href={`/user/${user.username}`}><CustomAvatar user={user} disableTooltip/></Link>}
					/>
				))
			}
		</StyledSpeedDial>
	);
}
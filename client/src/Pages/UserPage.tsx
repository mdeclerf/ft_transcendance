import { CircularProgress } from '@mui/material';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchUser } from '../utils/hooks/useFetchUser';
import { CenteredDiv } from '../utils/styles';
import { User } from '../utils/types';
import { Profile } from './Profile';

export interface IUserPageProps {
	userProps?: User;
}

export const UserPage = (props: IUserPageProps) => {
	const { userProps } = props;
	const { username } = useParams();
	const { user, error, loading, games } = useFetchUser(username || userProps?.username);

	if (loading) return <CenteredDiv><CircularProgress /></CenteredDiv>

	return (
		<>
			{user && !error ?
				<Profile user={user} games={games} />
				:
				<CenteredDiv><h1>No user named <i>{username}</i> was found</h1></CenteredDiv>
			}
		</>
	);
}

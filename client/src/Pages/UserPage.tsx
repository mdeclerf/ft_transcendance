import { CircularProgress } from '@mui/material';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchUser } from '../utils/hooks/useFetchUser';
import { CenteredDiv } from '../utils/styles';
import { Profile } from './Profile';

export const UserPage = () => {
	const { username } = useParams();
	const { user, error, loading, games } = useFetchUser(username);

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

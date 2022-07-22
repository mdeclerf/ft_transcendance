import styled from "@emotion/styled/"
import { Badge, badgeClasses } from "@mui/material/";

export const CenteredDiv = styled.div`
	margin: 0;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	align-items: center;
	text-align: center;
	flex-direction: column;
`;

export const ProfileDiv = styled.div`
	margin: 40px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 40px;
`;

export const StyledBadge = styled(Badge)(() => ({
	'& .MuiBadge-badge': {
		backgroundColor: '#44b700',
		color: '#44b700',
		boxShadow: '0 0 0 2px #121212',
	},
	[`& .${badgeClasses.dot}`]: {
		width: 40,
		height: 40,
		borderRadius: "50%"
	}
}));
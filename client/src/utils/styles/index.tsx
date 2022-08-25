import styled from "@emotion/styled/"
import { SpeedDial } from "@mui/material";

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
	justify-content: space-evenly;
`;

export const StyledSpeedDial = styled(SpeedDial)`
	position: absolute;
	bottom: 16px;
	left: 16px;
`
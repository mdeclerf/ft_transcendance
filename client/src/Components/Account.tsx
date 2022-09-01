import { Logout } from "@mui/icons-material/";
import { Avatar, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material/";
import axios from "axios/";
import React from "react";
import { Link } from "react-router-dom";
import { User } from "../utils/types";

export interface IAccountProps {
	user: User | undefined;
}

export function Account(props: IAccountProps) {
	const { user } = props;
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const logout = () => {
		axios.get(`http://${process.env.REACT_APP_IP}:3001/api/auth/logout`, { withCredentials: true });
		window.location.reload();
	}

	return (
		<div>
			<IconButton
				aria-label="account of current user"
				aria-controls="menu-appbar"
				aria-haspopup="true"
				onClick={handleOpenUserMenu}
				color="inherit"
			>
				<Avatar alt="Remy Sharp" src={user?.photoURL} />
			</IconButton>
			<Menu
				sx={{ marginTop: '45px' }}
				id="menu-appbar"
				anchorEl={anchorElUser}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}
			>
				<MenuItem component={Link} to="./profile" onClick={handleCloseUserMenu}>Profile</MenuItem>
				<MenuItem component={Link} to="/account" onClick={handleCloseUserMenu}>My Account</MenuItem>
				<MenuItem onClick={logout}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</div>
	)
}
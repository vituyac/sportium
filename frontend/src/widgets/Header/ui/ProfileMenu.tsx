import React, { useState } from 'react';
import { Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import {useAppDispatch} from '@shared/lib/hooks';
import {logoutUser} from '@features/user/logoutUser.ts';

type ProfileMenuProps = {
	image: string;
};

const ProfileMenu: React.FC<ProfileMenuProps> = ({ image }) => {
	const dispatch = useAppDispatch();

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleProfile = () => {
		handleClose();
		console.log('Открыть профиль');
	};

	const handleLogout = () => {
		dispatch(logoutUser());
		handleClose();
		console.log('Выход');
	};

	return (
		<div>
			<IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
				<Avatar alt="Remy Sharp" src={image} />
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				disableScrollLock
				PaperProps={{
					elevation: 3,
					sx: (theme) => ({
						mt: 1.5,
						minWidth: 180,
						backgroundColor: theme.palette.background.default,
					}),
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem onClick={handleProfile}>Профиль</MenuItem>
				<MenuItem onClick={handleLogout}>Выйти</MenuItem>
			</Menu>
		</div>
	);
};

export default ProfileMenu;
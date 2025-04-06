import {useState} from 'react';
import {Box, Button, Drawer, IconButton, List, Stack, useMediaQuery, useTheme,} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {useTranslation} from 'react-i18next';
import LogoutIcon from '@mui/icons-material/Logout';
import {ProfileSidebarItem} from '@pages/ProfilePage/ui/ProfileSidebarItem';
import {LogoLink} from '@shared/ui/LogoLink/LogoLink';
import {logoutUser} from '@features/user/logout/model/logoutUser';
import {useAppDispatch} from '@shared/lib/hooks';
import {Link as RouterLink} from 'react-router';

import ButtonIco1 from '@shared/assets/icons/Button-1.svg?react';
import ButtonIco2 from '@shared/assets/icons/Button-2.svg?react';
import ButtonIco4 from '@shared/assets/icons/Button.svg?react';
import ButtonIco5 from '@shared/assets/icons/Button5.svg?react';

export const drawerWidth = 240;

export const ProfileSidebar = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const [mobileOpen, setMobileOpen] = useState(false);
	const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

	const navLinks = [
		{ label: t('Профиль'), href: '/profile', icon: ButtonIco5 },
		{ label: t('Личный план'), href: '/profile/personal-plan', icon: ButtonIco4 },
		{ label: t('Тренировки'), href: '/', icon: ButtonIco2 },
		{ label: t('Питание'), href: '/', icon: ButtonIco1 },
	];

	const currentPath = location.pathname;

	const drawerContent = (
		<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
			{/* Кнопка закрытия для мобилки */}
			{isMobile && (
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
					<IconButton onClick={handleDrawerToggle}>
						<CloseIcon />
					</IconButton>
				</Box>
			)}

			<List sx={{ p: 2}}>
				<LogoLink />
			</List>

			<List>
				{navLinks.map(({ label, href, icon }) => {
					const isActive = currentPath === href;
					return (
						<ProfileSidebarItem
							key={label}
							href={href}
							icon={icon}
							label={label}
							isActive={isActive}
						/>
					);
				})}
			</List>

			<Stack sx={{ mt: 'auto', p: 2, gap: 1 }}>
				<Button color="primary" variant="contained" component={RouterLink} to="/">
					На главную
				</Button>
				<Button
					variant="outlined"
					color="error"
					fullWidth
					onClick={() => dispatch(logoutUser())}
					endIcon={<LogoutIcon />}
				>
					Выход
				</Button>
			</Stack>
		</Box>
	);

	return (
		<>
			{/* Гамбургер для открытия меню на мобилке */}
			{isMobile && !mobileOpen && (
				<IconButton
					color="inherit"
					edge="start"
					onClick={handleDrawerToggle}
					sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1300 }}
				>
					<MenuIcon />
				</IconButton>
			)}

			{isMobile ? (
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
					sx={{
						'& .MuiDrawer-paper': {
							width: drawerWidth,
							boxSizing: 'border-box',
							backgroundColor: theme.palette.background.default,
						},
					}}
				>
					{drawerContent}
				</Drawer>
			) : (
				<Drawer
					variant="permanent"
					sx={{
						width: drawerWidth,
						flexShrink: 0,
						'& .MuiDrawer-paper': {
							width: drawerWidth,
							boxSizing: 'border-box',
							backgroundColor: theme.palette.background.default,
						},
					}}
				>
					{drawerContent}
				</Drawer>
			)}
		</>
	);
};

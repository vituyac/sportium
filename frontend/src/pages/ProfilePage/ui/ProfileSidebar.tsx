import {Drawer, List, Toolbar} from '@mui/material';
import {useTranslation} from 'react-i18next';
import ButtonIco1 from '@shared/assets/icons/Button-1.svg?react';
import ButtonIco2 from '@shared/assets/icons/Button-2.svg?react';
import ButtonIco3 from '@shared/assets/icons/Button-3.svg?react';
import ButtonIco4 from '@shared/assets/icons/Button.svg?react';
import ButtonIco5 from '@shared/assets/icons/Button5.svg?react';
import {ProfileSidebarItem} from '@pages/ProfilePage/ui/ProfileSidebarItem.tsx';
import {LogoLink} from '@shared/ui/LogoLink/LogoLink.tsx';

const drawerWidth = 240;

export const ProfileSidebar = () => {
	const { t } = useTranslation();

	const navLinks = [
		{ label: t('Профиль'), href: '/profile', icon: ButtonIco5 },
		{ label: t('Личный план'), href: '/', icon: ButtonIco4 },
		{ label: t('Тренировки'), href: '/', icon: ButtonIco2 },
		{ label: t('Питание'), href: '/', icon: ButtonIco1 },
		{ label: t('Прогресс'), href: '/', icon: ButtonIco3 },
	];
	const currentPath = location.pathname;

	return (
		<Drawer
			variant="permanent"
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: (theme) => ({
					width: drawerWidth,
					boxSizing: 'border-box',
					backgroundColor: theme.palette.background.default,
				}),
			}}
		>
			<List sx={{p: 2}}>
				<LogoLink/>
			</List>
			<List>
			{navLinks.map(({ label, href, icon }) => {
				const isActive = currentPath === href;
				console.log(currentPath, href)
				return (
					<ProfileSidebarItem key={href} href={href} icon={icon} label={label} isActive={isActive} />
				);
			})}
			</List>
		</Drawer>
	)
}
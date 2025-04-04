import {
	AppBar, Avatar,
	Box,
	Button,
	Container,
	Drawer,
	IconButton,
	Link,
	List,
	ListItemButton,
	ListItemText,
	Toolbar,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import {Link as RouterLink} from 'react-router';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {ThemeSwitcher} from '@features/toggle-theme/ui/ThemeSwitcher.tsx';
import {useThemeContext} from '@shared/lib/theme/useThemeContext.ts';
import {useEffect, useState} from 'react';
import {LangSwitcher} from '@widgets/LangSwitcher/LangSwitcher.tsx';
import {useTranslation} from 'react-i18next';
import {getUserAuthData} from '@entities/User/model/selectors.ts';
import {useSelector} from 'react-redux';
import ProfileMenu from '@widgets/Header/ui/ProfileMenu.tsx';
import {logoutUser} from '@features/user/logoutUser.ts';
import {useAppDispatch} from '@shared/lib/hooks';
import { useLocation } from 'react-router';

export const Header = () => {
	const authData = useSelector(getUserAuthData);

	const dispatch = useAppDispatch();
	const { mode } = useThemeContext();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const location = useLocation();
	const currentPath = location.pathname;
	const { t } = useTranslation();

	const navLinks = [
		{ label: t('Главная'), href: '/' },
		{ label: t('Тренировки'), href: '#' },
		{ label: t('Питание'), href: '#' },
		{ label: t('Контакты'), href: '#' },
	];

	const [scrolled, setScrolled] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 0);
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};

	return (
		<AppBar position="fixed" color="transparent" elevation={0} sx={{
			backdropFilter: scrolled ? 'blur(10px)' : 'none',
			backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
			transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
		}}>
			<Container>
				<Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Typography variant="h6" noWrap>
							MyLogo
						</Typography>

						{/* Desktop nav */}

						{!isMobile && (
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								{navLinks.map(({ label, href }) => {
									const isActive = currentPath === href;

									return (
										<Link
											key={label}
											underline="hover"
											component={RouterLink}
											to={href}
											sx={{
												textDecoration: isActive ? 'underline' : 'none',
											}}
										>
											{label}
										</Link>
									);
								})}
							</Box>
						)}
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<LangSwitcher />
						<ThemeSwitcher />
						{!isMobile && (
							<>
								{ authData ?
									<ProfileMenu image={authData.image}/>
								:
									<>
									<Button
										variant="outlined"
										color={mode === 'light' ? 'primary' : 'secondary'}
										component={RouterLink}
										to="/auth/register"
									>
										{t('Регистрация')}
									</Button>
									<Button
											variant="contained"
											color={mode === 'light' ? 'primary' : 'secondary'}
											component={RouterLink}
											to="/auth/login"
											>
										{t('Вход')}
									</Button>
									</>
								}

							</>
						)}
						{isMobile && (
							<IconButton onClick={toggleDrawer} color="inherit">
								<MenuIcon />
							</IconButton>
						)}
					</Box>
				</Toolbar>
			</Container>

			<Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
				<Box sx={{ width: 250, height: '100%', p: 2, backgroundColor: 'background.default' }} >
					<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
						<IconButton color={'primary'} onClick={toggleDrawer}>
							<CloseIcon />
						</IconButton>
					</Box>
					<List>
						{authData && (
							<>
								<ListItemButton sx={{gap: 2}} component={RouterLink} to="/auth/register" onClick={toggleDrawer}>
									<Avatar src={authData.image} />
									<ListItemText primary={authData.username} />
								</ListItemButton>
								<ListItemButton component={RouterLink} to="/profile" onClick={toggleDrawer}>
									<ListItemText primary="Профиль" />
								</ListItemButton>
							</>
						)}
						{navLinks.map(({ label, href }) => {
							const isActive = currentPath === href;

							console.log(currentPath);
							console.log(href);

							return (
								<ListItemButton
									key={label}
									component={RouterLink}
									to={href}
									onClick={toggleDrawer}
									selected={isActive}
								>
									<ListItemText primary={label} />
								</ListItemButton>
							);
						})}
						{ authData
							?
							<>
								<ListItemButton onClick={() => {
									dispatch(logoutUser());
									toggleDrawer();
								}}>
									<ListItemText primary="Выход" />
								</ListItemButton>
							</>
							:
							<>
								<ListItemButton component={RouterLink} to="/auth/register" onClick={toggleDrawer}>
									<ListItemText primary="Регистрация" />
								</ListItemButton>
								<ListItemButton component={RouterLink} to="/auth/login">
									<ListItemText primary="Вход" />
								</ListItemButton>
							</>
					}
					</List>
				</Box>
			</Drawer>

		</AppBar>
	);
};

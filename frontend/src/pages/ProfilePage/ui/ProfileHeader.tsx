import {AppBar, Box, Button, Dialog, DialogContent, DialogTitle, Stack, Toolbar} from '@mui/material';
import {ThemeSwitcher} from '@features/toggle-theme/ui/ThemeSwitcher.tsx';
import {useEffect, useState} from 'react';
import {LangSwitcher} from '@widgets/LangSwitcher/LangSwitcher.tsx';
import {getUserAuthData} from '@entities/User/model/selectors.ts';
import {useSelector} from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import {UpdateUserForm} from '@features/user/update-user/ui/UpdateUserForm.tsx';
import {VKLoginButton} from '@features/auth/ui/VKLoginButton.tsx';

export const ProfileHeader = () => {
	const authData = useSelector(getUserAuthData);
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [scrolled, setScrolled] = useState(false);

	const onLoginError = () => {
		console.log('onLoginError')
	}

  const onLoginSuccess = () => {
    console.log('onLoginSuccess')
  }

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 0);
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<AppBar position="sticky" color="transparent" elevation={0} sx={{
			backdropFilter: scrolled ? 'blur(10px)' : 'none',
			backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
			transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
			pr: 2
		}}>
			<Toolbar disableGutters sx={{ justifyContent: 'right' }}>
				<Stack direction="row" sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap' }}>
					<LangSwitcher />
					<ThemeSwitcher/>
					{
						authData?.vk_id
							? <Box sx={{ width: 24 }} /> // Заглушка, чтобы сохранить структуру
							: <VKLoginButton onLoginError={onLoginError} onLoginSuccess={onLoginSuccess} />
					}
					<Box sx={{ flexGrow: 1 }} /> {/* Пушит кнопку вправо */}
					<Button
						sx={{
							whiteSpace: 'nowrap',
							flexShrink: 0
						}}
						onClick={handleOpen}
						variant="outlined"
						color="primary"
						endIcon={<EditIcon />}
					>
						Редактировать профиль
					</Button>
					<Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
						<DialogTitle>Редактировать профиль</DialogTitle>
						<DialogContent dividers>
							<UpdateUserForm onSuccess={handleClose} />
						</DialogContent>
					</Dialog>
				</Stack>

			</Toolbar>
		</AppBar>
	);
};

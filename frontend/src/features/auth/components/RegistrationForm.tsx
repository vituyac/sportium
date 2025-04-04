import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, IconButton, InputAdornment, Stack, TextField, Typography} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import {useSelector} from 'react-redux';
import {RootState} from '@app/providers/StoreProvider/config/store.ts';
import {ConfirmRegisterForm} from '@features/auth/components/ConfirmRegisterForm.tsx';
import {confirmRegister} from '@features/auth/model/services/confirmRegister.ts';
import {useAppDispatch} from '@shared/lib/hooks';
import {register} from '@features/auth/model/services/register.ts';
import {VKLoginButton} from '@features/auth/ui/VKLoginButton.tsx';

interface RegistrationFormProps {
	onChangeMode: (mode: 'login' | 'register' | 'reset') => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onChangeMode }) => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [confirm, setConfirm] = useState('');
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { loading, error, user } = useSelector((state: RootState) => state.auth.register);
	const [isRegistered, setIsRegistered] = useState(false);

	const dispatch = useAppDispatch();

	const handleVKLoginSuccess = (data: any) => {
		console.log('VK авторизация успешна:', data);
	};

	const handleVKLoginError = (error: any) => {
		console.error('Ошибка VK авторизации:', error);
	};

	const handleRegister = (username: string, email: string, password: string, confirm: string) => {
		dispatch(register({username, email, password, confirm }));
	};

	useEffect(() => {
		if (user && !isRegistered) {
			setIsRegistered(true);
		}
	}, [user]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleRegister(username, email, password, confirm);
	};

	const handleConfirmRegister = (email: string, code: string) => {
		dispatch(confirmRegister({email, code}))
	}

	if (isRegistered) {
		return <ConfirmRegisterForm email={email} onSubmit={handleConfirmRegister} onChangeMode={onChangeMode} />;
	}

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				textAlign: 'center',
				width: '100%',
			}}
		>
			<Typography variant={'h4'} sx={{ fontWeight: 'bold' }}>
				Регистрация
			</Typography>

			{error?.detail && (
				<Alert severity="error">{error.detail}</Alert>
			)}

			<TextField
				label="Имя"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				fullWidth
				size="small"
				error={!!error?.username}
				helperText={error?.username}
			/>

			<TextField
				label="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				fullWidth
				size="small"
				error={!!error?.email}
				helperText={error?.email}
			/>

			<TextField
				label="Пароль"
				type={showPassword ? 'text' : 'password'}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				fullWidth
				size="small"
				error={!!error?.password}
				helperText={error?.password}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton color={'primary'} onClick={() => setShowPassword((prev) => !prev)} edge="end">
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
				}}
			/>

			<TextField
				label="Подтверждение пароля"
				type={showConfirmPassword ? 'text' : 'password'}
				value={confirm}
				onChange={(e) => setConfirm(e.target.value)}
				fullWidth
				size="small"
				error={!!error?.confirm}
				helperText={error?.confirm}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton color={'primary'} onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
								{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
				}}
			/>

			<Stack direction="row" spacing={2}>
				<VKLoginButton
					onLoginSuccess={handleVKLoginSuccess}
					onLoginError={handleVKLoginError}
				/>
				<Button type="submit" variant="contained" color="secondary" fullWidth disableElevation>
					{loading ? <CircularProgress size={24} /> : 'Регистрация'}
				</Button>
			</Stack>
		</Box>
	);
};

import React, {useState} from 'react';
import {
	Box,
	Button,
	CircularProgress,
	IconButton,
	InputAdornment,
	Link,
	Stack,
	TextField,
	Typography
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {useSelector} from 'react-redux';
import {RootState} from '@app/providers/StoreProvider/config/store.ts';
import Alert from '@mui/material/Alert';
import {useAppDispatch} from '@shared/lib/hooks';
import {login} from '@features/auth/model/services/login';
import {VKLoginButton} from '@features/auth/ui/VKLoginButton.tsx';
import {useNavigate} from 'react-router';

interface LoginFormProps {
	onChangeMode: (mode: 'login' | 'register' | 'reset') => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onChangeMode }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const { loading, error } = useSelector((state: RootState) => state.auth.login);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleLogin = async (email: string, password: string) => {
		const resultAction = await dispatch(login({ email, password }));
		if (login.fulfilled.match(resultAction)) {
			navigate('/'); // 👈 редирект на главную
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleLogin(email, password);
	};

	const handleVKLoginSuccess = (data: any) => {
		console.log('VK авторизация успешна:', data);
	};

	const handleVKLoginError = (error: any) => {
		console.error('Ошибка VK авторизации:', error);
	};

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

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
				Вход
			</Typography>

			{error?.detail && (
				<Alert severity="error">{error.detail}</Alert>
			)}

			<TextField
				label="Почта"
				size="small"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				fullWidth
				error={!!error?.email}
				helperText={error?.email}
			/>

			<TextField
				label="Пароль"
				type={showPassword ? 'text' : 'password'}
				size="small"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				fullWidth
				error={!!error?.password}
				helperText={error?.password}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton color={'primary'} onClick={togglePasswordVisibility} edge="end">
								{showPassword ? <VisibilityOff /> : <Visibility />}
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
					{loading ? <CircularProgress size={24} /> : 'Войти'}
				</Button>
			</Stack>

			<Typography variant="body2">
				Забыли пароль? Не проблема!{' '}
				<Link component="button" onClick={() => onChangeMode('reset')}>
					Восстановить
				</Link>
			</Typography>
		</Box>
	);
};
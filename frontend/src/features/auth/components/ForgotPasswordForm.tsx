import React, {useState} from 'react';
import {Box, Button, CircularProgress, Stack, TextField, Typography} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useSelector} from 'react-redux';
import {RootState} from '@app/providers/StoreProvider/config/store.ts';
import {useAppDispatch} from '@shared/lib/hooks';
import {forgotPassword} from '@features/auth/model/services/forgotPassword.ts';
import Alert from '@mui/material/Alert';
import {ResetPasswordForm} from '@features/auth/components/ResetPasswordForm.tsx';
import {resetPassword} from '@features/auth/model/services/resetPassword.ts';

interface ForgotPasswordFormProps {
	onChangeMode: (mode: 'login' | 'register' | 'reset') => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onChangeMode }) => {
	const [email, setEmail] = useState('');
	const [isResetPassword, setIsResetPassword] = useState(false)
	const { loading, error } = useSelector((state: RootState) => state.auth.forgotPassword);
	const dispatch = useAppDispatch();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await handlePasswordForgot(email);
	};

	const handlePasswordForgot = async (email:string) => {
		try {
			const response = await dispatch(forgotPassword({email: email})).unwrap();
			setIsResetPassword(true);
			console.log('Успешно!', response);
		} catch (err) {
			console.error('Ошибка!', err);
		}
	};

	const handleResetPassword = (email: string, code: string, password: string, confirm: string) => {
		dispatch(resetPassword({email, code, password, confirm}))
	}

	if (isResetPassword) {
		return <ResetPasswordForm email={email} onSubmit={handleResetPassword} onChangeMode={onChangeMode} />;
	}

	return (
		<Box component="form" onSubmit={handleSubmit} sx={{
			display: 'flex',
			flexDirection: 'column',
			gap: 2,
			textAlign: 'center',
			width: '100%'
		}}>
			<Typography variant={'h4'} sx={{ fontWeight: 'bold' }}>Восстановление пароля</Typography>
			{error?.detail && (
				<Alert severity="error">{error.detail}</Alert>
			)}
			<TextField
				label="Введите ваш Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				fullWidth
				size={'small'}
				error={!!error?.email}
				helperText={error?.email}
			/>
			<Stack direction="row" spacing={2}>
				<Button
				        variant="contained"
				        color="primary"
				        fullWidth
				        disableElevation
				        endIcon={<ArrowBackIcon />}
				        onClick={() => onChangeMode('login')}
				>
					Назад
				</Button>
				<Button type="submit" variant="contained" color="secondary" fullWidth disableElevation>
					{loading ? <CircularProgress size={24} /> : 'Восстановить'}
				</Button>
			</Stack>
		</Box>
	);
};

import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, IconButton, InputAdornment, TextField, Typography} from '@mui/material';
import {useSelector} from 'react-redux';
import {RootState} from '@app/providers/StoreProvider/config/store.ts';
import Alert from '@mui/material/Alert';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ResetPasswordFormProps {
	email: string;
	onSubmit: (email : string, code : string, password: string, confirm: string) => void;
	onChangeMode: (mode: 'login' | 'register' | 'reset') => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSubmit, email, onChangeMode }) => {
	const { t } = useTranslation();
	const [code, setCode] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [confirm, setConfirm] = useState('');
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { detail, loading, error } = useSelector((state: RootState) => state.auth.resetPassword);
	const [isResetedPassword, setIsResetedPassword] = useState(false);

	useEffect(() => {
		if (detail && !isResetedPassword) {
			setIsResetedPassword(true);
		}
	}, [detail]);
	useEffect(() => {
		if (isResetedPassword) {
			onChangeMode('login');
		}
	}, [isResetedPassword]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(email, code, password, confirm);
	};

	return (
		<Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Typography variant="h5">{t("Восстановление пароля")}</Typography>
			{error?.detail && (
				<Alert severity="error">{error.detail}</Alert>
			)}
			<TextField
				label={t("Код из email")}
				value={code}
				onChange={(e) => setCode(e.target.value)}
				fullWidth
				size="small"
				error={!!error?.code}
				helperText={error?.code}
			/>
			<TextField
				label={t("Пароль")}
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
				label={t("Подтверждение пароля")}
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
			<Button type="submit" variant="contained" fullWidth>
				{loading ? <CircularProgress size={24} /> : t('Подтвердить')}
			</Button>
		</Box>
	);
};

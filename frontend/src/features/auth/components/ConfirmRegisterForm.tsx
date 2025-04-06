import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, TextField, Typography} from '@mui/material';
import {useSelector} from 'react-redux';
import {RootState} from '@app/providers/StoreProvider/config/store.ts';
import Alert from '@mui/material/Alert';
import {useTranslation} from 'react-i18next';

interface EmailVerificationFormProps {
	email: string;
	onSubmit: (email : string, code : string) => void;
	onChangeMode: (mode: 'login' | 'register' | 'reset') => void;
}

export const ConfirmRegisterForm: React.FC<EmailVerificationFormProps> = ({ onSubmit, email, onChangeMode }) => {
	const { t } = useTranslation();
	const [code, setCode] = useState('');

	const { user, loading, error } = useSelector((state: RootState) => state.auth.confirm);
	const [isRegistered, setIsRegistered] = useState(false);

	useEffect(() => {
		if (user && !isRegistered) {
			setIsRegistered(true);
		}
	}, [user]);
	useEffect(() => {
		if (isRegistered) {
			onChangeMode('login');
		}
	}, [isRegistered]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(email, code);
	};

	return (
		<Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Typography variant="h5">{`${t('Код подтверждения отправлен на')} ${email}`}</Typography>
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
			<Button type="submit" variant="contained" fullWidth>
				{loading ? <CircularProgress size={24} /> : t('Подтвердить')}
			</Button>
		</Box>
	);
};

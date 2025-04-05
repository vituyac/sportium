import React, {useEffect, useState} from 'react';
import {Box, Paper} from '@mui/material';
import {LoginForm} from '../components/LoginForm';
import {RegistrationForm} from '../components/RegistrationForm';
import {ForgotPasswordForm} from '../components/ForgotPasswordForm.tsx';
import AuthSwitcher from './AuthSwitcher';
import {useLocation, useNavigate} from 'react-router';
import {LogoLink} from '@shared/ui/LogoLink/LogoLink.tsx';

export type AuthMode = 'login' | 'register' | 'reset';

export const AuthPanel: React.FC = () => {

	const [mode, setMode] = useState<AuthMode>('login');

	const handleModeChange = (newMode: AuthMode) => {
		setMode(newMode);
	};

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		navigate(`/auth/${mode}`, { replace: true });
	}, [mode, navigate]);

	useEffect(() => {
		const pathMode = location.pathname.split('/').pop();
		if (pathMode === 'login' || pathMode === 'register' || pathMode === 'reset') {
			setMode(pathMode);
		}
	}, [location.pathname]);

	const renderForm = () => {
		switch (mode) {
			case 'login':
				return <LoginForm onChangeMode={setMode} />;
			case 'register':
				return <RegistrationForm onChangeMode={setMode} />;
			case 'reset':
				return <ForgotPasswordForm onChangeMode={setMode} />;
			default:
				return null;
		}
	};

	return (
		<Paper sx={(theme) => ({
			  width: {
					xs: '95vw',
					md: '80vw',
					lg: '60vw'
			  },
        height: {
					xs: '95vh',
	        md: '90vh',
	        lg: '70vh'
        },
        display: 'flex',
				flexDirection: {
					xs: 'column',
					sm: 'row',
				},
        alignItems: 'center',
        justifyContent: 'center',
        position:'relative',
			  borderRadius: 3,
			  overflow: 'hidden',
			  background: `${theme.palette.background.default}`,
		})}
		elevation={16}
		>
			<Box
				sx={{
					width: {
						xs: '100%',
						sm: '50%'
					},
					height: {
						xs: '90%',
						sm: '100%'
					},
					backgroundColor: 'background.default',
					position: {
						xs: 'relative',
						sm: 'absolute'
					},
					left: {
						sm: mode === 'login' ? 0 : mode === 'register' ? '50%' : 0,
					},
					transition: {
						sm: 'left 0.5s'
					},
					padding: {
						xs: 2,
						sm: 4,
						md: 6,
            lg: 8
					},
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Box  sx={{
					position: 'absolute',
					left: {
						sm: mode !== 'register' ? '16px' : 'none'
					},
					right:  {
						sm: mode !== 'register' ? 'none' : '16px',
					},
					top: '16px',
				}}
				>
					<LogoLink/>
				</Box>
				{renderForm()}
			</Box>
			<AuthSwitcher mode={mode} onModeChange={handleModeChange} />
		</Paper>
	);
};

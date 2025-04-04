import {Box} from '@mui/material';
import {AuthPanel} from '@features/auth';
import dribbbleImage from '@shared/assets/images/dribbble.png';
import {useThemeContext} from '@shared/lib/theme/useThemeContext.ts';
import ellipse1 from '@shared/assets/images/ellipse-1.png';
import ellipse2 from '@shared/assets/images/ellipse-2.png';
import ellipse4 from '@shared/assets/images/ellipse-4.png';

const AuthPage = () => {
	const { mode } = useThemeContext();

	return (
		<Box display="flex"
		     justifyContent="center"
		     alignItems="center"
		     minHeight="100vh"
		>
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundImage: `url(${dribbbleImage})`,
					backgroundRepeat: 'repeat',
					backgroundSize: mode === 'dark' ? '512px 512px' : '124px 124px',
					opacity: mode === 'dark' ? 1 : 0.6,
					zIndex: 0,
				}}
			/>
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundSize: '100% auto',
					backgroundImage: `url(${ellipse1})`,
					backgroundRepeat: 'no-repeat',
					zIndex: 0,
				}}
			/>
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundSize: '100% auto',
					backgroundImage: `url(${ellipse2})`,
					backgroundRepeat: 'no-repeat',
					zIndex: 0,
				}}
			/>
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundSize: '100% auto',
					backgroundImage: `url(${ellipse4})`,
					backgroundRepeat: 'no-repeat',
					zIndex: 0,
				}}
			/>
			<AuthPanel />
		</Box>
	);
};

export default AuthPage;

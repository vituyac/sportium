// shared/ui/LoadingPage/LoadingPage.tsx
import { CircularProgress } from '@mui/material';

export const LoadingPage = () => {
	return (
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			height: '100vh',
		}}>
			<CircularProgress color={'secondary'} size="3rem" />
		</div>
	);
};

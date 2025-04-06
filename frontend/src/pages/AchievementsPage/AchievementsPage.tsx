import {useThemeContext} from '@shared/lib/theme/useThemeContext.ts';
import {Box} from '@mui/material';
import dribbbleImage from '@shared/assets/images/dribbble.png';
import {Header} from '@widgets/Header/ui/Header.tsx';
import {Footer} from '@widgets/Footer';
import {useRef} from 'react';
import {AchievementList} from '@pages/AchievementsPage/ui/AchievementList.tsx';

export const AchievementsPage = () => {
	const { mode } = useThemeContext();

	const blocksRef = useRef<HTMLDivElement>(null);
	const footerRef = useRef<HTMLDivElement>(null);

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			position: 'relative',
			gap: 4
		}}>
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
					opacity: mode === 'dark' ? 1 : 0.2,
					zIndex: 0,
				}}
			/>
			<Header scrollToFooter={() => {
				footerRef.current?.scrollIntoView({behavior: 'smooth'});
			}}/>
			<AchievementList/>
			<footer ref={footerRef}>
				<Footer/>
			</footer>
		</Box>
	);
};

import {Box} from '@mui/material';
import {Header} from '@widgets/Header/ui/Header.tsx';
import {Hero} from '@pages/HomePage/ui/Hero.tsx';
import {BlocksView} from '@pages/HomePage/ui/BlocksView.tsx';
import {Footer} from '@widgets/Footer';
import dribbbleImage from '@shared/assets/images/dribbble.png';
import {useThemeContext} from '@shared/lib/theme/useThemeContext.ts';
import {useRef} from 'react';

export const HomePage = () => {
	const { mode } = useThemeContext();

	const blocksRef = useRef<HTMLDivElement>(null);
	const footerRef = useRef<HTMLDivElement>(null);

	const handleScrollDown = () => {
		if (blocksRef.current) {
			blocksRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

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
			<Hero onScrollDown={handleScrollDown}/>
			<div ref={blocksRef}>
				<BlocksView/>
			</div>
			<footer ref={footerRef}>
				<Footer/>
			</footer>
		</Box>
	);
};

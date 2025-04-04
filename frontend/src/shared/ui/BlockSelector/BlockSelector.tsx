import {Grid} from '@mui/material';
import {FC} from 'react';
import {BlockSelectorProps} from './types';

export const BlockSelector: FC<BlockSelectorProps> = ({ blocks }) => {
	return (
		<Grid container spacing={4}>
			{blocks.map((block, index) => (
				<Grid key={index} size={{xs: 6, sm: 4}} sx={{
					transition: 'transform 0.2s ease-in-out',
					'&:hover': {
						transform: 'translateY(-4px)',
					},
					'&:active': {
						transform: 'translateY(-2px)',
					},
				}}>
					{block}
				</Grid>
				))}
		</Grid>
	);
};

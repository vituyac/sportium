import { FC } from 'react';
import { Box, Grid, Typography } from '@mui/material';

interface BlockViewProps {
	title: string;
	text: string;
	image: string;
	reverse?: boolean;
	icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const BlockView: FC<BlockViewProps> = ({ title, text, image, reverse, icon : Icon }) => {
	return (
		<Grid container spacing={4} alignItems="center">
			<Grid size={{xs: 12, sm: 6}} order={{ xs: 1, sm: reverse ? 2 : 1 }}>
				<Box
					component="img"
					src={image}
					alt={title}
					sx={{
						width: '100%',
						height: 'auto',
						borderRadius: 2,
						objectFit: 'cover',
					}}
				/>
			</Grid>
			<Grid size={{xs: 12, sm: 6}} order={{ xs: 2, sm: reverse ? 1 : 2 }}>
				<Box sx={{display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2}}>
					{Icon && <Icon width={24} height={24} />}
					<Typography variant="h6">{title}</Typography>
				</Box>
				<Typography variant={'body1'}>{text}</Typography>
			</Grid>
		</Grid>
	);
};

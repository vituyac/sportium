import React from 'react';
import {Stack, SvgIconTypeMap, Typography, useTheme} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

type SocialMediaBlockProps = {
	icon: React.FC<React.SVGProps<SVGSVGElement>> | OverridableComponent<SvgIconTypeMap<{}, 'svg'>>,
	title: string,
	value: string | null,
};

export const SocialMediaBlock: React.FC<SocialMediaBlockProps> = ({ icon: Icon, value }) => {
	const theme = useTheme();

	return (
		<Stack direction={'row'} sx={{
			alignItems: 'center',
			border: '1px solid',
			borderColor: theme.palette.primary.main,
			borderRadius: 1,
			p: 1
		}} spacing={1}>
			<Icon fill={ theme.palette.primary.main } style={{width: '24px', height: '24px'}}/>
			<Stack>
				<Typography variant={'body2'}>
					{value? value : 'Не указано'}
				</Typography>
			</Stack>
		</Stack>
	);
};

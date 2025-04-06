import React from 'react';
import { Box, SxProps, Theme, useTheme } from '@mui/material';

type BlockViewProps = {
	children: React.ReactNode;
	sx?: SxProps<Theme>;
	p?: number;
};

export const BlockView: React.FC<BlockViewProps> = ({ children, p = 2, sx }) => {
	const theme = useTheme();

	const defaultStyles: SxProps<Theme> = {
		border: '1px solid',
		borderColor: theme.palette.primary.main,
		borderRadius: 2,
		p,
	};

	return (
		<Box sx={[defaultStyles, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
			{children}
		</Box>
	);
};

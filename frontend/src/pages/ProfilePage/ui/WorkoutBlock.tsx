import React from 'react';
import {Box, Checkbox, FormControlLabel, Typography, useTheme} from '@mui/material';

type WorkoutBlockProps = {
	title: string;
	checked: boolean;
	onChange?: (checked: boolean) => void;
};

export const WorkoutBlock: React.FC<WorkoutBlockProps> = ({ title, checked, onChange }) => {
	const theme = useTheme();

	return (
		<FormControlLabel
			control={
				<Checkbox
					checked={checked}
					onChange={(e) => onChange(e.target.checked)}
					color="primary"
					sx={{
						color: theme.palette.primary.main,
						'&.Mui-checked': {
							color: theme.palette.primary.main,
						},
					}}
				/>
			}
			label={
				<Box
					sx={{
						backgroundColor: '#E8F5E9',
						borderLeft: '3px solid',
						borderColor: theme.palette.secondary.main,
						p: 1,
						borderRadius: 1,
					}}
				>
					<Typography color="primary.dark">{title}</Typography>
				</Box>
			}
		/>
	);
};
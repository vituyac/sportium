import React from 'react';
import {Link, ListItem, useTheme} from '@mui/material';
import {useThemeContext} from '@shared/lib/theme/useThemeContext.ts';
import {Link as RouterLink} from 'react-router';


type ProfileSidebarItemProps = {
	label: string,
	href: string,
	icon:  React.FC<React.SVGProps<SVGSVGElement>>,
	isActive?: boolean,
};

export const ProfileSidebarItem: React.FC<ProfileSidebarItemProps> = ({ icon: Icon, href, isActive, label }) => {
	const theme = useTheme();
	const mode = useThemeContext()

	return (
		<ListItem sx={{gap: 2}}>
			<Icon
				style={
					mode.mode === 'light'
						? {
							color: theme.palette.primary.main,
							fill: isActive ? theme.palette.secondary.main : '',
						}
						: {
							color: isActive ? theme.palette.secondary.main : theme.palette.primary.main,
							fill: 'transparent'
						}
				}
			/>

			<Link
				key={label}
				underline="hover"
				component={RouterLink}
				to={href}
				sx={{
					textDecoration: isActive ? 'underline' : 'none',
				}}
			>
				{label}
			</Link>
		</ListItem>
	)
}
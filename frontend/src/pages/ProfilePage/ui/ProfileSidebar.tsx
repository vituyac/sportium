import {Drawer, List, ListItem, ListItemText, Toolbar} from '@mui/material';

const drawerWidth = 240;

export const ProfileSidebar = () => {
	return (
		<Drawer
			variant="permanent"
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: (theme) => ({
					width: drawerWidth,
					boxSizing: 'border-box',
					backgroundColor: theme.palette.background.default,
				}),
			}}
		>
			<Toolbar /> {/* Если используешь AppBar — нужен отступ */}
			<List>
				<ListItem>
					<ListItemText primary="Пункт 1" />
				</ListItem>
			</List>
		</Drawer>
	)
}
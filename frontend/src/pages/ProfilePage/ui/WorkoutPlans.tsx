import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Stack,
	TextField,
	Typography,
	useTheme,
	Alert,
} from '@mui/material';
import {useSelector} from 'react-redux';
import {useEffect, useState} from 'react';

import {getUserAuthData} from '@entities/User/model/selectors.ts';
import {chatSocket} from '@pages/ProfilePage/api/websocket.ts';
import {fetchPlans} from '@pages/ProfilePage/api/fetchPlans.ts';
import {PlansResponse} from '@pages/ProfilePage/model/types.ts';
import WeeklyPlanGrid from '@pages/ProfilePage/ui/WeeklyPlanGrid.tsx';

export const WorkoutPlans = () => {
	const authData = useSelector(getUserAuthData);
	const theme = useTheme();

	const [plans, setPlans] = useState<PlansResponse | null>(null);
	const [detail, setDetail] = useState('');
	const [selectedWeek, setSelectedWeek] = useState<'this' | 'next'>('this');
	const [isSending, setIsSending] = useState(false);
	const [wsConnected, setWsConnected] = useState(false);

	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [editMessage, setEditMessage] = useState('');

	useEffect(() => {
		chatSocket.connect();

		chatSocket.onConnect(() => {
			setWsConnected(true);
		});

		chatSocket.onDisconnect(() => {
			setWsConnected(false);
		});

		chatSocket.onMessage((msg) => {
			console.log('[WS Message]', msg);
			if (msg?.status === 'ok' || msg?.type === 'plan_updated') {
				loadPlans(selectedWeek);
			}
		});

		return () => {
			chatSocket.disconnect();
		};
	}, []);


	const loadPlans = async (week: 'this' | 'next') => {
		try {
			const data = await fetchPlans(week);

			if ('detail' in data) {
				setDetail(data.detail);
				setPlans(null);
			} else {
				setPlans(data);
				setDetail('');
			}

			console.log('Fetched plans:', data);
		} catch (error) {
			console.error('Error fetching plans:', error);
		}
	};

	useEffect(() => {
		loadPlans(selectedWeek);
	}, [selectedWeek]);

	const sendPlanAction = (action: 'createTodayPlan' | 'createFuturePlan' | 'editPlan', message?: string) => {
		setIsSending(true);
		chatSocket.sendMessage({
			act: action,
			week: selectedWeek,
			...(message ? { message } : {}),
		});
		setTimeout(() => setIsSending(false), 3000);
	};

	const handleEditClick = () => {
		setEditDialogOpen(true);
	};

	const handleEditConfirm = () => {
		if (editMessage.trim()) {
			sendPlanAction('editPlan', editMessage.trim());
		}
		setEditDialogOpen(false);
		setEditMessage('');
	};

	return (
		<Grid container sx={{p: 2}} spacing={2}>
			<Stack spacing={2}>
				<Stack direction="row" spacing={2} justifyContent="center">
					<Button
						variant={selectedWeek === 'this' ? 'contained' : 'outlined'}
						onClick={() => setSelectedWeek('this')}
					>
						Текущая неделя
					</Button>
					<Button
						variant={selectedWeek === 'next' ? 'contained' : 'outlined'}
						onClick={() => setSelectedWeek('next')}
					>
						Следующая неделя
					</Button>
				</Stack>

				<Typography variant="body2" align="center">
					WebSocket: {wsConnected ? '🔌 Подключен' : '❌ Отключен'} | Статус: {isSending ? '⏳ Отправка...' : 'Готов'}
				</Typography>

				{plans && 'weekly_plan' in plans ? (
					<>
						<WeeklyPlanGrid weekly_plan={plans.weekly_plan} />
						<Stack direction="row" spacing={2} justifyContent="center" mt={2}>
							<Button onClick={handleEditClick} variant="outlined" color="warning">
								Редактировать план
							</Button>
						</Stack>
					</>
				) : detail ? (
					<Stack spacing={2}>
						<Alert severity="error">{detail}</Alert>
						<Button onClick={() => sendPlanAction('createTodayPlan')} variant="contained" color="primary">
							Создать план на сегодня
						</Button>
						<Button onClick={() => sendPlanAction('createFuturePlan')} variant="contained" color="secondary">
							Создать план на следующую неделю
						</Button>
					</Stack>
				) : (
					<Typography>Загрузка планов...</Typography>
				)}
			</Stack>

			{/* Диалог редактирования */}
			<Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>Редактировать план</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						fullWidth
						multiline
						minRows={3}
						label="Сообщение"
						value={editMessage}
						onChange={(e) => setEditMessage(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEditDialogOpen(false)}>Отмена</Button>
					<Button onClick={handleEditConfirm} variant="contained" disabled={!editMessage.trim()}>
						Отправить
					</Button>
				</DialogActions>
			</Dialog>
		</Grid>
	);
};

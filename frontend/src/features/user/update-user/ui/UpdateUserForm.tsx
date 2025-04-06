import React, {useEffect, useState} from 'react';
import {
	TextField,
	Button,
	Grid,
	Box,
	InputAdornment,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	SelectChangeEvent,
} from '@mui/material';
import { useAppDispatch } from '@shared/lib/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@app/providers/StoreProvider/config/store';
import { updateUserData } from '@features/user/update-user/updateUser';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmailIcon from '@mui/icons-material/Email';
import {AvatarUploader} from '@features/user/update-user/ui/AvatarUploader.tsx';
import { uploadUserAvatar } from '@features/user/update-user/uploadUserAvatar';


export const UpdateUserForm = ({ onSuccess }: { onSuccess?: () => void }) => {
	const dispatch = useAppDispatch();
	const { authData: user } = useSelector((state: RootState) => state.user);

	const [form, setForm] = useState({
		first_name: user?.first_name || '',
		last_name: user?.last_name || '',
		middle_name: user?.middle_name || '',
		date_of_birth: user?.date_of_birth || '',
		height: user?.height || '',
		weight: user?.weight || '',
		email: user?.email || '',
		training_goal: user?.training_goal || '',
		gender: user?.gender || '',
	});

	const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.image);

	const handleAvatarUpload = async (file: File) => {
		try {
			const result = await dispatch(uploadUserAvatar(file)).unwrap();
			setAvatarUrl(result.avatar_url);
		} catch (error) {
			console.error('Ошибка при загрузке аватара:', error);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSelectChange = (e: SelectChangeEvent<string>) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async () => {
		await dispatch(updateUserData({
			...form,
			height: Number(form.height) || 0,
			weight: Number(form.weight) || 0,
		}));
		onSuccess?.();
	};

	useEffect(() => {
		setAvatarUrl(user?.image);
	}, [user]);

	return (
		<Box component="form" noValidate autoComplete="off">
			<Box mb={3} display="flex" justifyContent="center">
				<AvatarUploader currentAvatar={avatarUrl} onUpload={handleAvatarUpload} />
			</Box>
			<Grid container spacing={2}>
				<Grid size={4}>
					<TextField
						name="first_name"
						label="Имя"
						fullWidth
						value={form.first_name}
						onChange={handleInputChange}
					/>
				</Grid>
				<Grid size={4}>
					<TextField
						name="middle_name"
						label="Отчество"
						fullWidth
						value={form.middle_name}
						onChange={handleInputChange}
					/>
				</Grid>
				<Grid size={4}>
					<TextField
						name="last_name"
						label="Фамилия"
						fullWidth
						value={form.last_name}
						onChange={handleInputChange}
					/>
				</Grid>

				<Grid size={4}>
					<TextField
						name="date_of_birth"
						label="Дата рождения"
						type="date"
						fullWidth
						value={form.date_of_birth}
						onChange={handleInputChange}
						InputLabelProps={{ shrink: true }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<CalendarTodayIcon fontSize="small" />
								</InputAdornment>
							),
						}}
					/>
				</Grid>

				<Grid size={4}>
					<TextField
						name="weight"
						label="Вес (кг)"
						type="number"
						fullWidth
						value={form.weight}
						onChange={handleInputChange}
					/>
				</Grid>

				<Grid size={4}>
					<TextField
						name="height"
						label="Рост (см)"
						type="number"
						fullWidth
						value={form.height}
						onChange={handleInputChange}
					/>
				</Grid>

				<Grid size={6}>
					<TextField
						name="email"
						label="Почта"
						fullWidth
						value={form.email}
						onChange={handleInputChange}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<EmailIcon />
								</InputAdornment>
							),
						}}
					/>
				</Grid>

				<Grid size={6}>
					<FormControl fullWidth>
						<InputLabel id="gender-label">Пол</InputLabel>
						<Select
							labelId="gender-label"
							id="gender"
							name="gender"
							value={form.gender}
							label="Пол"
							onChange={handleSelectChange}
						>
							<MenuItem value="">Не указано</MenuItem>
							<MenuItem value="male">Мужской</MenuItem>
							<MenuItem value="female">Женский</MenuItem>
						</Select>
					</FormControl>
				</Grid>

				<Grid size={12}>
					<TextField
						name="training_goal"
						label="Цель тренировок"
						multiline
						rows={3}
						fullWidth
						value={form.training_goal}
						onChange={handleInputChange}
						inputProps={{ maxLength: 200 }}
						helperText={`${form.training_goal.length}/100`}
					/>
				</Grid>
			</Grid>

			<Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
				<Button variant="outlined" onClick={onSuccess}>
					Отмена
				</Button>
				<Button variant="contained" color="success" onClick={handleSubmit}>
					Сохранить и обновить план
				</Button>
			</Box>
		</Box>
	);
};

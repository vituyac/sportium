// features/feedback-form/ui/FeedbackForm.tsx

import {TextField, Button, Box, Typography, Stack} from '@mui/material';
import { useFeedbackForm } from "../model/useFeedbackForm";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

export const FeedbackForm = () => {
	const {
		name,
		email,
		message,
		handleChange,
		handleSubmit,
		charsLeft,
	} = useFeedbackForm();

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 2,
				margin: "0 auto",
				p: 2,
			}}
		>
			<Typography variant="body2" align="center">
				Возникли вопросы или появились предложения?
			</Typography>

			<Stack direction={'row'} spacing={2}>
				<TextField
					size={'small'}
					name="name"
					label="Имя"
					variant="outlined"
					value={name}
					onChange={handleChange}
				/>
				<TextField
					size={'small'}
					name="email"
					label="Почта"
					variant="outlined"
					value={email}
					onChange={handleChange}
				/>
			</Stack>
			<TextField
				size={'small'}
				name="message"
				label="Сообщение"
				variant="outlined"
				multiline
				rows={4}
				value={message}
				onChange={handleChange}
				inputProps={{ maxLength: 100 }}
				helperText={`${charsLeft}/100`}
			/>
			<Button size={'medium'} type="submit" variant="outlined" endIcon={<ArrowCircleRightIcon/>}>
				Отправить
			</Button>
		</Box>
	);
};

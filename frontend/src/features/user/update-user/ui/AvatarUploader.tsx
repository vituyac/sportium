import React, { useRef, useState } from 'react';
import { Box, Avatar, IconButton, CircularProgress } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export const AvatarUploader = ({ currentAvatar, onUpload }: {
	currentAvatar?: string;
	onUpload: (file: File) => Promise<void>;
}) => {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [loading, setLoading] = useState(false);

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setLoading(true);
			await onUpload(file);
			setLoading(false);
		}
	};

	return (
		<Box position="relative" display="inline-block">
			<Avatar
				src={currentAvatar}
				sx={{ width: 100, height: 100 }}
			/>
			<IconButton
				sx={{
					position: 'absolute',
					bottom: 0,
					right: 0,
					backgroundColor: 'white',
					'&:hover': { backgroundColor: 'lightgray' },
				}}
				onClick={() => inputRef.current?.click()}
			>
				<PhotoCamera />
			</IconButton>
			<input
				type="file"
				accept="image/*"
				style={{ display: 'none' }}
				ref={inputRef}
				onChange={handleChange}
			/>
			{loading && <CircularProgress size={24} sx={{ position: 'absolute', top: 0, right: 0 }} />}
		</Box>
	);
};

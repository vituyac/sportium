// features/feedback-form/model/useFeedbackForm.ts

import { useState } from "react";

export const useFeedbackForm = () => {
	const [form, setForm] = useState({
		name: "",
		email: "",
		message: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Submitted:", form);
		// здесь можно добавить отправку на API
	};

	const charsLeft = 100 - form.message.length;

	return {
		...form,
		handleChange,
		handleSubmit,
		charsLeft,
	};
};

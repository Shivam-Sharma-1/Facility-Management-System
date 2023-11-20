import {
	Button,
	Fade,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";

import "dayjs/locale/en-gb";

import ErrorComponent from "../Error";

const AddFacilityModal: FC<AddFacilityModalProps> = ({
	isOpen,
	setIsOpen,
	setOpenSnackbar,
	buildings,
}): JSX.Element => {
	const [formData, setFormData] = useState<AddFacilityDataProps>({
		name: "",
		description: "",
		building: "",
		icon: "",
		FMId: "",
	});
	const [error, setError] = useState<ErrorMessage>({
		error: {
			status: null,
			message: "",
		},
	});
	const [errorMessage, setErrorMessage] = useState<string>("");

	const mutation = useMutation({
		mutationFn: (data: AdminFacilitiesSubmitData) =>
			axios.post(
				`${import.meta.env.VITE_APP_SERVER_URL}/admin/facility/add`,
				data,
				{
					withCredentials: true,
				}
			),
		onSuccess: () => {
			setIsOpen(false);
			setOpenSnackbar(true);
		},
		onError: (error) => {
			setError(error.response!.data as ErrorMessage);
			console.log(error);
		},
	});

	const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		const submitData: AdminFacilitiesSubmitData = {
			name: formData.name,
			description: formData.description,
			building: formData.building!,
			icon: formData.icon,
			slug: `${formData.name
				.toLowerCase()
				.replace(/\s/g, "-")}${new Date().getTime()}`,
			facilityManagerId: parseInt(formData.FMId! as string),
		};
		mutation.mutate(submitData);
	};

	const handleCancel = (): void => {
		setIsOpen(false);
		setFormData({
			name: "",
			description: "",
			building: "",
			icon: "",
			FMId: "",
		});
	};

	useEffect(() => {
		if (error.error.status === 404) {
			setErrorMessage("User with this ID is not available");
			setTimeout(() => {
				setErrorMessage("");
			}, 4000);
		}
	}, [error]);

	if (error.error.status) {
		if (!errorMessage && error.error.status !== 404) {
			return (
				<ErrorComponent
					status={error.error.status!}
					message={error.error.message}
				/>
			);
		}
	}

	return (
		<Modal
			open={isOpen}
			onClose={() => {
				setIsOpen(false);
			}}
		>
			<Fade in={isOpen}>
				<div className="bg-bgPrimary w-full max-w-[500px] px-10 py-10 absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] rounded-md flex flex-col gap-6 shadow-cardHover">
					<Typography
						id="modal-modal-title"
						variant="h4"
						component="h2"
					>
						Create new facility
					</Typography>
					<form
						autoComplete="off"
						className="flex flex-col gap-4"
						onSubmit={handleSubmit}
					>
						<FormControl className="flex gap-4" size="small">
							<TextField
								id="name"
								label="Name"
								variant="outlined"
								className="w-full"
								value={formData.name}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
								required
								size="small"
							/>
							<TextField
								id="description"
								label="Description"
								variant="outlined"
								className="w-full"
								value={formData.description}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setFormData({
										...formData,
										description: e.target.value,
									})
								}
								required
								multiline
								size="small"
							/>
							<FormControl size="small" fullWidth>
								<InputLabel>Select Building</InputLabel>
								<Select
									label="Select a month"
									size="small"
									value={formData.building}
									onChange={(
										e: SelectChangeEvent<string | null>
									) => {
										setFormData({
											...formData,
											building: e.target.value,
										});
									}}
									required
								>
									{buildings.map((building) => (
										<MenuItem
											key={building.name}
											value={building.name}
										>
											{building.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<TextField
								id="icon"
								label="Icon"
								variant="outlined"
								className="w-full"
								value={formData.icon}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setFormData({
										...formData,
										icon: e.target.value,
									})
								}
								required
								size="small"
							/>
							<TextField
								id="FMId"
								label="Facility Manager Id"
								variant="outlined"
								className="w-full"
								value={formData.FMId}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setFormData({
										...formData,
										FMId: e.target.value,
									})
								}
								required
								size="small"
							/>
						</FormControl>
						{errorMessage && (
							<FormHelperText error={true}>
								{errorMessage}
							</FormHelperText>
						)}
						<div className="w-full flex items-center justify-between mt-2">
							<Button
								type="submit"
								variant="contained"
								color="success"
								sx={{ minWidth: "47%" }}
								size="large"
							>
								Add
							</Button>
							<Button
								variant="contained"
								color="error"
								sx={{ minWidth: "47%" }}
								size="large"
								onClick={handleCancel}
							>
								Cancel
							</Button>
						</div>
					</form>
				</div>
			</Fade>
		</Modal>
	);
};

export default AddFacilityModal;

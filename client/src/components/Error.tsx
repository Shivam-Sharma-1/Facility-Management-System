import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { Typography } from "@mui/material";
import { FC } from "react";

import { useAuth } from "../hooks/useAuth";

const ErrorComponent: FC<ErrorProps> = ({ status, message }): JSX.Element => {
	const auth = useAuth();

	if (status === 401) {
		auth?.logout();
	}

	return (
		<div className="w-full h-full bg-bgPrimary min-h-[100dvh] overflow-hidden absolute left-0 top-0 z-20">
			<div className="w-full h-full min-h-[100dvh] flex-col flex items-center gap-6 pt-20">
				<ReportProblemOutlinedIcon
					color="error"
					sx={{ width: "200px", height: "200px" }}
				/>
				<Typography variant="h4" component="h2">
					Oops! Something went wrong
				</Typography>
				<div className="w-full flex flex-col justify-center items-center gap-3">
					<Typography variant="h5" component="h2">
						Error Code: {status}
					</Typography>
					<Typography variant="h5" component="h2">
						Error Message: {message}
					</Typography>
				</div>
			</div>
		</div>
	);
};

export default ErrorComponent;

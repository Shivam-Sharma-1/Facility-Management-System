import { FC } from "react";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { Typography } from "@mui/material";

const ErrorComponent: FC<ErrorProps> = ({ status, message }): JSX.Element => {
  return (
    <div className="w-full">
      <div className="w-full h-full min-h-screen flex-col flex items-center gap-6 mt-20">
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

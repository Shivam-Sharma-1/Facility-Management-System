import { FC } from "react";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const PageNotFound: FC = (): JSX.Element => {
  return (
    <div className="w-full">
      <div className="w-full h-full min-h-screen flex-col flex items-center gap-6 mt-20">
        <ReportProblemOutlinedIcon
          color="error"
          sx={{ width: "200px", height: "200px" }}
        />
        <Typography variant="h4" component="h2">
          Oops! This page does not exist
        </Typography>
        <div className="w-full flex flex-col justify-center items-center gap-3">
          <Typography variant="h5" component="h2">
            Error Code: 404
          </Typography>
          <Typography variant="h5" component="h2">
            Error Message: Page does not exist
          </Typography>
          <Link to="/" className="text-blue-500 mt-10">
            <Typography variant="h5" component="h2">
              Go back to dashboard
            </Typography>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;

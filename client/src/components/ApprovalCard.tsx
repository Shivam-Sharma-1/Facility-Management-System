import { Button, Typography } from "@mui/material";
import { FC } from "react";
import isoToTime from "../utils/isoToTime";
import isoToDate from "../utils/isoToDate";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const ApprovalCard: FC<ApprovalProps> = ({
  title,
  purpose,
  slug,
  date,
  start,
  end,
  facility,
  requestedBy,
  approvedAtAdmin,
  approvedAtFM,
  approvedAtGD,
}): JSX.Element => {
  const handleClick = useMutation({
    mutationFn: (data: ApprovalType) =>
      axios.post(
        `http://localhost:3000/employee/approvals/${
          approvedAtGD ? "fm" : "gd"
        }`,
        data,
        {
          withCredentials: true,
        }
      ),
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full flex justify-between items-center px-10 py-5">
      <div className="flex flex-col justify-center">
        <Typography
          variant="h4"
          component="p"
          sx={{ marginBottom: ".3em", fontWeight: 600 }}
        >
          {facility} - {title}
        </Typography>
        <Typography variant="h5" component="p">
          <span className="font-bold tracking-wide">Purpose: </span> {purpose}
        </Typography>
        <Typography variant="h5" component="p">
          <span className="font-bold tracking-wide">Date:</span>{" "}
          {isoToDate(date)}
        </Typography>
        <Typography variant="h5" component="p">
          <span className="font-bold tracking-wide">Time:</span>{" "}
          {isoToTime(start)} - {isoToTime(end)}
        </Typography>
        <Typography variant="h5" component="p">
          <span className="font-bold tracking-wide">Requested By: </span>{" "}
          {requestedBy}
        </Typography>
        {approvedAtGD && (
          <Typography variant="h5" component="p">
            Approved by GD
          </Typography>
        )}
        {approvedAtFM && (
          <Typography variant="h5" component="p">
            Approved by FM
          </Typography>
        )}
        {approvedAtAdmin && (
          <Typography variant="h5" component="p">
            Approved by Admin
          </Typography>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="contained"
          startIcon={<TaskAltIcon />}
          color="success"
          size="large"
          sx={{ minWidth: "40%" }}
          onClick={() => handleClick.mutate({ slug: slug, approved: true })}
        >
          Accept
        </Button>
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          color="error"
          size="large"
          sx={{ minWidth: "40%" }}
          onClick={() => handleClick.mutate({ slug: slug, approved: false })}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

export default ApprovalCard;

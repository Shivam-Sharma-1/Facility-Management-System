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
        <Typography variant="h4" component="h2">
          {title}
        </Typography>
        <Typography variant="body1">{purpose}</Typography>
        <Typography variant="body1">{isoToDate(date)}</Typography>
        <Typography variant="body1">
          {isoToTime(start)} - {isoToTime(end)}
        </Typography>
        <Typography variant="body1">Requested By - {requestedBy}</Typography>
        {approvedAtGD && (
          <Typography variant="body1">Approved by GD</Typography>
        )}
        {approvedAtFM && (
          <Typography variant="body1">Approved by FM</Typography>
        )}
        {approvedAtAdmin && (
          <Typography variant="body1">Approved by Admin</Typography>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="contained"
          startIcon={<TaskAltIcon />}
          color="success"
          sx={{ minWidth: "40%" }}
          onClick={() => handleClick.mutate({ slug: slug, approved: true })}
        >
          Accept
        </Button>
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          color="error"
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

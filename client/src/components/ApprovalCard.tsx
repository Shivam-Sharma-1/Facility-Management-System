import { Alert, Button, Snackbar, Typography } from "@mui/material";
import { FC, useState } from "react";
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
  approvedByGD,
}): JSX.Element => {
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  const handleClick = useMutation({
    mutationFn: (data: ApprovalType) =>
      axios.post(
        `http://localhost:3000/employee/approvals/${
          approvedByGD ? "fm" : "gd"
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
    <div className="justify-between items-center px-10 py-8 w-[60%] h-full flex mt-10 rounded-md bg-bgPrimary shadow-cardHover border-0 border-l-[10px] border-primary border-solid">
      <div className="flex flex-col justify-center">
        <Typography
          variant="h5"
          component="p"
          sx={{ marginBottom: ".3em", fontWeight: 600 }}
        >
          {facility} | {title}
        </Typography>
        <Typography variant="h6" component="p">
          <span className="font-bold tracking-wide">Purpose: </span> {purpose}
        </Typography>
        <Typography variant="h6" component="p">
          <span className="font-bold tracking-wide">Date:</span>{" "}
          {isoToDate(date)}
        </Typography>
        <Typography variant="h6" component="p">
          <span className="font-bold tracking-wide">Time:</span>{" "}
          {isoToTime(start)} - {isoToTime(end)}
        </Typography>
        <Typography variant="h6" component="p">
          <span className="font-bold tracking-wide">Requested By: </span>{" "}
          {requestedBy}
        </Typography>
        {approvedByGD && (
          <Typography variant="h6" component="p">
            <span className="font-bold tracking-wide">Approved By GD: </span>{" "}
            {approvedByGD}
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
          onClick={() => {
            handleClick.mutate({ slug: slug, approved: true });
            setOpenSnackbar(true);
            setIsAccepted(true);
          }}
        >
          Accept
        </Button>
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          color="error"
          size="large"
          sx={{ minWidth: "40%" }}
          onClick={() => {
            handleClick.mutate({ slug: slug, approved: false });
            setOpenSnackbar(true);
            setIsAccepted(false);
          }}
        >
          Reject
        </Button>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={"success"}
          sx={{ width: "100%" }}
        >
          {isAccepted
            ? "Booking approved successfully!"
            : "Booking request rejected!"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ApprovalCard;

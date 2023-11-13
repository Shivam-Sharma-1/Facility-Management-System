import { FC, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Slide, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DeleteIcon from "@mui/icons-material/Delete";

import isoToDate from "../../utils/isoToDate";
import isoToTime from "../../utils/isoToTime";
import ErrorComponent from "../Error";

const CancellationCard: FC<ApprovalProps> = ({
  title,
  purpose,
  slug,
  date,
  createdAt,
  cancelledAt,
  start,
  end,
  facility,
  requestedBy,
  approvedByGD,
  approvedAtGD,
}): JSX.Element => {
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [error, setError] = useState<ErrorMessage>({
    error: {
      status: null,
      message: "",
    },
  });

  const handleClick = useMutation({
    mutationFn: (data: ApprovalType) =>
      axios.post(
        `http://192.168.1.6:3000/bookings/cancel/${approvedAtGD ? "fm" : "gd"}`,
        data,
        {
          withCredentials: true,
        }
      ),
    onSuccess: () => {
      setOpenSnackbar(true);
    },
    onError: (error) => {
      setError(error.response!.data as ErrorMessage);
      console.log(error);
    },
  });

  const handleSubmit = (): void => {
    setSnackbarMessage("Cancellation request accepted!");
    handleClick.mutate({ slug: slug, approved: true });
  };

  const handleReject = (): void => {
    setSnackbarMessage("Cancellation request rejected!");
    handleClick.mutate({
      slug: slug,
      approved: false,
    });
    setOpenSnackbar(true);
  };

  if (error.error.status) {
    return (
      <ErrorComponent
        status={error.error.status!}
        message={error.error.message}
      />
    );
  }

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <div className="justify-between items-center px-10 py-8 w-[60%] h-full flex mt-10 rounded-md bg-bgPrimary shadow-cardHover border-0 border-l-[10px] border-primary border-solid">
        <div className="flex flex-col justify-center w-full">
          <Typography
            variant="h6"
            component="p"
            sx={{ marginBottom: ".3em", fontWeight: 600 }}
          >
            {facility} | {title}
          </Typography>
          <Typography variant="body1" component="p">
            <span className="font-bold tracking-wide">Purpose: </span> {purpose}
          </Typography>
          <Typography variant="body1" component="p">
            <span className="font-bold tracking-wide">Date:</span>{" "}
            {isoToDate(date)}
          </Typography>
          <Typography variant="body1" component="p">
            <span className="font-bold tracking-wide">Time:</span>{" "}
            {isoToTime(start)} - {isoToTime(end)}
          </Typography>
          <Typography variant="body1" component="p">
            <span className="font-bold tracking-wide">Requested By: </span>{" "}
            {requestedBy} at <br />
            &nbsp;&nbsp;&nbsp;
            {isoToDate(createdAt) + ", " + isoToTime(createdAt)}
          </Typography>
          <Typography variant="body1" component="p">
            <span className="font-bold tracking-wide">
              Cancellation Requested At:{" "}
            </span>{" "}
            <br />
            &nbsp;&nbsp;&nbsp;
            {isoToDate(cancelledAt!) + ", " + isoToTime(cancelledAt!)}
          </Typography>
          {approvedByGD && (
            <Typography variant="body1" component="p">
              <span className="font-bold tracking-wide">Approved By GD: </span>{" "}
              {approvedByGD} at <br />
              &nbsp;&nbsp;&nbsp;
              {isoToDate(approvedAtGD!) + ", " + isoToTime(approvedAtGD!)}
            </Typography>
          )}
        </div>
        <div className="w-[40%] flex flex-col gap-4 items-center">
          <div className="w-full flex items-center gap-4 justify-center">
            <Button
              variant="contained"
              startIcon={<TaskAltIcon />}
              color="success"
              size="large"
              sx={{ minWidth: "48%" }}
              onClick={() => handleSubmit()}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              color="error"
              size="large"
              sx={{ minWidth: "48%" }}
              onClick={() => handleReject()}
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
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </Slide>
  );
};

export default CancellationCard;

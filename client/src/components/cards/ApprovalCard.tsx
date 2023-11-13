import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  Slide,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DeleteIcon from "@mui/icons-material/Delete";

import isoToDate from "../../utils/isoToDate";
import isoToTime from "../../utils/isoToTime";
import ErrorComponent from "../Error";

const ApprovalCard: FC<ApprovalProps> = ({
  title,
  purpose,
  slug,
  date,
  createdAt,
  start,
  end,
  facility,
  requestedBy,
  approvedByGD,
  approvedAtGD,
}): JSX.Element => {
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [isCancel, setIsCancel] = useState<boolean>(false);
  const [remarkValue, setRemarkValue] = useState<string>("");
  const [error, setError] = useState<ErrorMessage>({
    error: {
      status: null,
      message: "",
    },
  });

  const handleClick = useMutation({
    mutationFn: (data: ApprovalType) =>
      axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/employee/approvals/${
          approvedByGD ? "fm" : "gd"
        }`,
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleClick.mutate({ slug: slug, approved: true });
    setIsAccepted(true);
  };

  const handleReject = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleClick.mutate({
      slug: slug,
      approved: false,
      remark: remarkValue,
    });
    setOpenSnackbar(true);
    setIsAccepted(false);
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
          <form
            autoComplete="off"
            className="w-full"
            onSubmit={(e) => (isCancel ? handleReject(e) : handleSubmit(e))}
          >
            <FormControl className="w-full flex flex-col gap-4">
              {isCancel && (
                <div className="w-full flex flex-col gap-2">
                  <FormLabel htmlFor="remark">State the reason:</FormLabel>
                  <TextField
                    id="remark"
                    label="Remark"
                    variant="outlined"
                    className="w-full"
                    value={remarkValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setRemarkValue(e.target.value)
                    }
                    required
                    size="small"
                    multiline
                  />
                </div>
              )}
              <div className="w-full flex items-center gap-4 justify-center">
                <Button
                  variant="contained"
                  startIcon={<TaskAltIcon />}
                  color="success"
                  type="submit"
                  size="large"
                  sx={{ minWidth: "48%" }}
                >
                  {isCancel ? "Ok" : "Accept"}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  color="error"
                  size="large"
                  sx={{ minWidth: "48%" }}
                  onClick={() => {
                    setIsCancel((state) => !state);
                  }}
                >
                  {isCancel ? "Cancel" : "Reject"}
                </Button>
              </div>
            </FormControl>
          </form>
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
    </Slide>
  );
};

export default ApprovalCard;

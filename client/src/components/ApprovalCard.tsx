import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DeleteIcon from "@mui/icons-material/Delete";

import isoToDate from "../utils/isoToDate";
import isoToTime from "../utils/isoToTime";

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
  const [isCancel, setIsCancel] = useState<boolean>(false);
  const [remarkValue, setRemarkValue] = useState<string>("");

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleClick.mutate({ slug: slug, approved: true });
    setOpenSnackbar(true);
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
  );
};

export default ApprovalCard;

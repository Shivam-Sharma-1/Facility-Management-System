import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import axios from "axios";
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
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useMutation } from "@tanstack/react-query";

import isoToDate from "../../utils/isoToDate";
import isoToTime from "../../utils/isoToTime";
import { useAuth } from "../../hooks/useAuth";
import ErrorComponent from "../Error";

const MyBookingCard: FC<MyBookingCardProps> = ({
  title,
  remark,
  purpose,
  slug,
  status,
  cancelStatus,
  cancellationRequestedAt,
  cancellationRemark,
  cancellationUpdateAtGD,
  cancellationUpdateAtFM,
  date,
  start,
  end,
  createdAt,
  facility,
  approvedByGD,
  approvedByFM,
  approvedAtGD,
  approvedAtFM,
  approvedAtAdmin,
}): JSX.Element => {
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [cancelStatusMessage, setCancelStatusMessage] = useState<string>("");
  const [remarkValue, setRemarkValue] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage>({
    error: {
      status: null,
      message: "",
    },
  });

  const auth = useAuth();

  const mutation = useMutation({
    mutationFn: (data: { slug: string; remark: string; employeeId: number }) =>
      axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/bookings/cancel`,
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

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  const handleClick = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    mutation.mutate({
      slug: slug!,
      remark: remarkValue,
      employeeId: auth!.user!.employeeId,
    });
  };

  useEffect(() => {
    switch (status) {
      case "PENDING":
        setStatusMessage("Pending Approval");
        break;
      case "APPROVED_BY_GD":
        setStatusMessage("Approved by GD");
        break;
      case "APPROVED_BY_FM":
        setStatusMessage("Approved by FM");
        break;
      case "APPROVED_BY_ADMIN":
        setStatusMessage("Approved by Admin");
        break;
      case "REJECTED_BY_GD":
        setStatusMessage("Rejected by GD");
        break;
      case "REJECTED_BY_FM":
        setStatusMessage("Rejected by FM");
        break;
      case "REJECTED_BY_ADMIN":
        setStatusMessage("Rejected by Admin");
        break;
      case "CANCELLED":
        setStatusMessage("Cancelled");
        break;
      default:
        setStatusMessage("Rejected");
        break;
    }

    switch (cancelStatus) {
      case "PENDING":
        setCancelStatusMessage("Pending Approval");
        break;
      case "APPROVED_BY_GD":
        setCancelStatusMessage("Approved by GD");
        break;
      case "APPROVED_BY_FM":
        setCancelStatusMessage("Approved by FM");
        break;
      case "APPROVED_BY_ADMIN":
        setCancelStatusMessage("Approved by Admin");
        break;
      case "REJECTED_BY_GD":
        setCancelStatusMessage("Rejected by GD");
        break;
      case "REJECTED_BY_FM":
        setCancelStatusMessage("Rejected by FM");
        break;
      case "REJECTED_BY_ADMIN":
        setCancelStatusMessage("Rejected by Admin");
        break;
      case "NOT_REQUESTED":
        setCancelStatusMessage("Not requested");
        break;
      case "CANCELLED_BY_USER":
        setCancelStatusMessage("Cancelled by user");
        break;
      default:
        setCancelStatusMessage("Rejected");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelStatus, status]);

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
      <div
        className={`justify-between items-center px-10 py-8 xl:w-[70%] w-full h-full flex mt-6 rounded-md shadow-cardHover border-0 border-l-[10px] border-solid ${
          status === "PENDING" ||
          (status === "APPROVED_BY_GD" && !cancelStatus?.startsWith("REJECTED"))
            ? "bg-blue-100 border-blue-600"
            : (status.startsWith("APPROVED") &&
                !status.endsWith("GD") &&
                cancelStatus === "NOT_REQUESTED") ||
              cancelStatus!.startsWith("REJECTED")
            ? "bg-green-100 border-green-600"
            : status.startsWith("REJECTED") || status!.startsWith("CANCELLED")
            ? "bg-red-100 border-red-600"
            : "bg-yellow-100 border-yellow-600"
        }`}
      >
        <div className="flex flex-col justify-center">
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
            <span className="font-bold tracking-wide">Requested At:</span>{" "}
            {isoToDate(createdAt!)}, {isoToTime(createdAt!)}
          </Typography>

          <Typography variant="body1" component="p">
            <span className="font-bold tracking-wide">Approval Status:</span>{" "}
            {statusMessage}
          </Typography>

          {status.startsWith("REJECTED") && remark && (
            <Typography variant="body1" component="p">
              <span className="font-bold tracking-wide">Rejection Remark:</span>{" "}
              {remark}
            </Typography>
          )}

          {approvedByGD && (
            <Typography variant="body1" component="p">
              <span className="font-bold tracking-wide">
                {status === "REJECTED_BY_GD" ? "Rejected" : "Approved"} By GD:{" "}
              </span>{" "}
              {approvedByGD} at{" "}
              {isoToDate(approvedAtGD!) + ", " + isoToTime(approvedAtGD!)}
            </Typography>
          )}

          {approvedByFM && (
            <Typography variant="body1" component="p">
              <span className="font-bold tracking-wide">
                {status === "REJECTED_BY_FM" ? "Rejected" : "Approved"} By FM:{" "}
              </span>{" "}
              {approvedByFM} at{" "}
              {isoToDate(approvedAtFM!) + ", " + isoToTime(approvedAtFM!)}
            </Typography>
          )}

          {approvedAtAdmin && (
            <Typography variant="body1" component="p">
              <span className="font-bold tracking-wide">
                {status === "REJECTED_BY_ADMIN" ? "Rejected" : "Approved"} By
                Admin:{" "}
              </span>{" "}
              at{" "}
              {isoToDate(approvedAtAdmin!) + ", " + isoToTime(approvedAtAdmin!)}
            </Typography>
          )}
          {cancellationRequestedAt && (
            <Typography variant="body1" component="p">
              <span className="font-bold tracking-wide">
                Cancellation Requested At:{" "}
              </span>{" "}
              {isoToDate(cancellationRequestedAt!) +
                ", " +
                isoToTime(cancellationRequestedAt!)}
            </Typography>
          )}
          {cancelStatus !== "NOT_REQUESTED" && (
            <Typography variant="body1" component="p">
              <span className="font-bold tracking-wide">
                Cancellation Status:
              </span>{" "}
              {cancelStatusMessage}
            </Typography>
          )}
          {cancellationRemark && (
            <Typography variant="body1" component="p">
              <span className="font-bold tracking-wide">
                Cancellation Remark:
              </span>{" "}
              {cancellationRemark}
            </Typography>
          )}

          {cancellationUpdateAtGD && (
            <Typography variant="body1" component="p">
              <span className="font-bold tracking-wide">
                Cancellation{" "}
                {cancelStatus === "REJECTED_BY_GD" ? "Rejected" : "Approved"} By
                GD:{" "}
              </span>{" "}
              {approvedByGD} at{" "}
              {isoToDate(cancellationUpdateAtGD!) +
                ", " +
                isoToTime(cancellationUpdateAtGD!)}
            </Typography>
          )}
          {cancellationUpdateAtFM && (
            <Typography variant="body1" component="p">
              <span className="font-bold tracking-wide">
                Cancellation{" "}
                {cancelStatus === "REJECTED_BY_FM" ? "Rejected" : "Approved"} By
                FM:{" "}
              </span>{" "}
              {approvedByFM} at{" "}
              {isoToDate(cancellationUpdateAtFM!) +
                ", " +
                isoToTime(cancellationUpdateAtFM!)}
            </Typography>
          )}
        </div>
        <div className="flex flex-col">
          {!status.startsWith("REJECTED") &&
            cancelStatus === "NOT_REQUESTED" && (
              <form
                autoComplete="off"
                className="w-full"
                onSubmit={(e) => handleClick(e)}
              >
                <FormControl className="w-full flex flex-col gap-4">
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

                  <div className="w-full flex items-center gap-4 justify-center">
                    <Button
                      variant="contained"
                      startIcon={<CancelOutlinedIcon />}
                      color="error"
                      size="large"
                      sx={{ minWidth: "100%" }}
                      type="submit"
                    >
                      Cancel
                    </Button>
                  </div>
                </FormControl>
              </form>
            )}
        </div>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Cancellation requested successfully!
          </Alert>
        </Snackbar>
      </div>
    </Slide>
  );
};

export default MyBookingCard;

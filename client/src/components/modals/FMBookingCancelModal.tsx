import { ChangeEvent, FC, FormEvent, useState } from "react";
import {
  Button,
  Fade,
  FormControl,
  FormLabel,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import ErrorComponent from "../Error";
import { useAuth } from "../../hooks/useAuth";

const FMBookingCancelModal: FC<AdminBookingsModalProps> = ({
  isOpen,
  setIsOpen,
  setOpenSnackbar,
  slug,
}): JSX.Element => {
  const [remarkValue, setRemarkValue] = useState<string>("");
  const [error, setError] = useState<ErrorMessage>({
    error: {
      status: null,
      message: "",
    },
  });

  const auth = useAuth();

  const mutation = useMutation({
    mutationFn: (data: ApprovalType) =>
      axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/bookings/cancel/facility`,
        data,
        {
          withCredentials: true,
        }
      ),
    onSuccess: () => {
      setIsOpen(false);
      setOpenSnackbar(true);
    },
    onError: (error) => {
      setError(error.response!.data as ErrorMessage);
      console.log(error);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    mutation.mutate({
      slug: slug,
      employeeId: auth?.user?.employeeId,
      remark: remarkValue,
    });
  };

  const handleCancel = (): void => {
    setIsOpen(false);
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
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <Fade in={isOpen}>
        <div className="bg-bgPrimary w-full max-w-[500px] px-10 py-10 absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] rounded-md flex flex-col gap-6 shadow-cardHover items-center justify-center">
          <ReportProblemOutlinedIcon
            color="error"
            sx={{ width: "100px", height: "100px" }}
          />
          <Typography variant="h4" component="h2">
            Are you sure?
          </Typography>
          <div className="w-full flex flex-col items-center justify-center">
            <Typography variant="h6" component="h2">
              Do you really want to cancel this booking?
            </Typography>
            <Typography variant="h6" component="h2">
              This process cannot be undone!
            </Typography>
            <Typography
              variant="h6"
              component="h2"
              className="text-red-700 text-center"
            >
              Please inform the user about cancellation/rejection of this
              booking!
            </Typography>
          </div>
          <form
            autoComplete="off"
            className="w-full"
            onSubmit={(e) => handleSubmit(e)}
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

              <div className="w-full flex gap-4 justify-center">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ paddingX: "2em", height: "45px" }}
                  size="large"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ paddingX: "2em", height: "45px" }}
                  size="large"
                  type="submit"
                >
                  Reject
                </Button>
              </div>
            </FormControl>
          </form>
        </div>
      </Fade>
    </Modal>
  );
};

export default FMBookingCancelModal;

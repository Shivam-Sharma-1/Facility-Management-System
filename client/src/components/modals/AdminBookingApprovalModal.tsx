import { Button, Fade, Modal, Typography } from "@mui/material";
import { FC } from "react";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const AdminBookingApprovalModal: FC<AdminBookingsModalProps> = ({
  isOpen,
  setIsOpen,
  setOpenSnackbar,
  slug,
}): JSX.Element => {
  const mutation = useMutation({
    mutationFn: (data: ApprovalType) =>
      axios.post(`http://localhost:3000/admin/approval`, data, {
        withCredentials: true,
      }),
    onSuccess: () => {
      setIsOpen(false);
      setOpenSnackbar(true);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (): void => {
    mutation.mutate({ slug: slug, approved: true });
  };

  const handleCancel = (): void => {
    setIsOpen(false);
  };

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
              Do you really want to approve this booking?
            </Typography>
            <Typography variant="h6" component="h2">
              This process cannot be undone!
            </Typography>
          </div>
          <div className="w-full flex gap-4 justify-center">
            <Button
              variant="contained"
              color="success"
              sx={{ paddingX: "2em", height: "45px" }}
              size="large"
              onClick={handleSubmit}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ paddingX: "2em", height: "45px" }}
              size="large"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default AdminBookingApprovalModal;

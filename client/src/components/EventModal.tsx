import { Modal, Typography } from "@mui/material";
import { FC } from "react";

const EventModal: FC<EventModalProps> = ({
  isOpen,
  setIsOpen,
  eventInfo,
}): JSX.Element => {
  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="bg-bgPrimary w-full max-w-[500px] text-black px-16 py-10 absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] rounded-md">
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          className="mb-1"
        >
          Event details
        </Typography>
        <p>Title: {eventInfo.title}</p>
        <p>Purpose: {eventInfo.purpose}</p>
        <p>Date: {eventInfo.date}</p>
        <p>
          Time: {eventInfo.start} - {eventInfo.end}
        </p>
        <p>Request By: {eventInfo.requestBy}</p>
      </div>
    </Modal>
  );
};

export default EventModal;

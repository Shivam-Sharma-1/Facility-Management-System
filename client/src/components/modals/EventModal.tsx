import { FC } from "react";
import { Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EventModal: FC<EventModalProps> = ({
  isOpen,
  setIsOpen,
  eventInfo,
}): JSX.Element => {
  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      sx={{ border: "none" }}
    >
      <div className="bg-bgPrimary w-full max-w-[500px] flex flex-col gap-6 absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] rounded-md shadow-cardHover border-none">
        <div className="w-full flex items-center justify-between bg-primary px-10 py-8 rounded-md rounded-b-none border-none">
          <Typography
            id="modal-modal-title"
            variant="h4"
            component="h2"
            className="mb-1 text-white"
            style={{ fontWeight: "bold" }}
          >
            Booking details
          </Typography>
          <CloseIcon
            className="cursor-pointer"
            sx={{ width: "35px", height: "35px", color: "white" }}
            onClick={() => setIsOpen(false)}
          />
        </div>
        <div className="flex flex-col gap-1 px-10 pb-10">
          <Typography variant="h6" component="p">
            <span className="font-bold tracking-wide">Title:</span>{" "}
            {eventInfo.title}
          </Typography>
          <Typography variant="h6" component="p">
            <span className="font-bold tracking-wide">Purpose:</span>{" "}
            {eventInfo.purpose}
          </Typography>
          <Typography variant="h6" component="p">
            <span className="font-bold tracking-wide">Date:</span>{" "}
            {eventInfo.date}
          </Typography>
          <Typography variant="h6" component="p">
            <span className="font-bold tracking-wide">Time:</span>{" "}
            {eventInfo.start} - {eventInfo.end}
          </Typography>
          {eventInfo.status === "PENDING" && (
            <Typography variant="h6" component="p">
              <span className="font-bold tracking-wide">Status:</span> Pending
            </Typography>
          )}

          <Typography variant="h6" component="p">
            <span className="font-bold tracking-wide">Requested by:</span>{" "}
            {eventInfo.requestBy}
          </Typography>
          {eventInfo.statusUpdateByGD && (
            <Typography variant="h6" component="p">
              <span className="font-bold tracking-wide">Approved by GD:</span>{" "}
              {eventInfo.statusUpdateByGD}
            </Typography>
          )}
          {eventInfo.statusUpdateByFM && (
            <Typography variant="h6" component="p">
              <span className="font-bold tracking-wide">Approved by FM:</span>{" "}
              {eventInfo.statusUpdateByFM}
            </Typography>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EventModal;

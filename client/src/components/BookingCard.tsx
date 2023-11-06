import { Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import isoToDate from "../utils/isoToDate";
import isoToTime from "../utils/isoToTime";

const BookingCard: FC<MyBookingCardProps> = ({
  title,
  remark,
  purpose,
  status,
  date,
  start,
  end,
  facility,
  approvedByGD,
  approvedByFM,
}): JSX.Element => {
  const [statusMessage, setStatusMessage] = useState<string>("");

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
      default:
        setStatusMessage("Rejected");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`justify-between items-center px-10 py-8 w-[60%] h-full flex mt-8 rounded-md bg-bgPrimary shadow-cardHover border-0 border-l-[10px] border-solid ${
        status === "PENDING" || status === "APPROVED_BY_GD"
          ? "bg-blue-100 border-blue-600"
          : status === "APPROVED_BY_FM" || status === "APPROVED_BY_ADMIN"
          ? "bg-green-100 border-green-600"
          : "bg-red-100 border-red-600"
      }`}
    >
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
          <span className="font-bold tracking-wide">Status:</span>{" "}
          {statusMessage}
        </Typography>
        {status.startsWith("REJECTED") && remark && (
          <Typography variant="h6" component="p">
            <span className="font-bold tracking-wide">Remark:</span> {remark}
          </Typography>
        )}
        {approvedByGD && (
          <Typography variant="h6" component="p">
            <span className="font-bold tracking-wide">
              {status === "REJECTED_BY_GD" ? "Rejected" : "Approved"} By GD:{" "}
            </span>{" "}
            {approvedByGD}
          </Typography>
        )}
        {approvedByFM && (
          <Typography variant="h6" component="p">
            <span className="font-bold tracking-wide">
              {status === "REJECTED_BY_FM" ? "Rejected" : "Approved"} By FM:{" "}
            </span>{" "}
            {approvedByFM}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default BookingCard;

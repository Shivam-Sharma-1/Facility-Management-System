import { FC } from "react";
import Bookings from "../components/Bookings";

const BookingsPage: FC<ApprovalStatusProps> = ({ GD, FM }): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <Bookings GD={GD} FM={FM} />
    </div>
  );
};

export default BookingsPage;

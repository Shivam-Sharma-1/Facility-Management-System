import { FC } from "react";
import FMBookings from "../components/FMBookings";

const FMBookingsPage: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <FMBookings />
    </div>
  );
};

export default FMBookingsPage;

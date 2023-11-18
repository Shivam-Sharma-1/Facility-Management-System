import { FC } from "react";
import GDBookings from "../components/GDBookings";

const GDBookingsPage: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <GDBookings />
    </div>
  );
};

export default GDBookingsPage;

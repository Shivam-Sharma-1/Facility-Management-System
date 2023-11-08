import { FC } from "react";
import MyBookings from "../components/MyBookings";

const MyBookingsPage: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <MyBookings />
    </div>
  );
};

export default MyBookingsPage;

import { FC } from "react";
import MyBookings from "../components/MyBookings";
import Navigation from "../components/Navigation";

const MyBookingsPage: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <Navigation />
      <MyBookings />
    </div>
  );
};

export default MyBookingsPage;

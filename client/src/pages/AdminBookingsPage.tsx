import { FC } from "react";
import AdminBookings from "../components/AdminBookings";
import Navigation from "../components/Navigation";

const AdminBookingsPage: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <Navigation />
      <AdminBookings />
    </div>
  );
};

export default AdminBookingsPage;

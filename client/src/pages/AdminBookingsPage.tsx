import { FC } from "react";
import AdminBookings from "../components/AdminBookings";

const AdminBookingsPage: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <AdminBookings />
    </div>
  );
};

export default AdminBookingsPage;

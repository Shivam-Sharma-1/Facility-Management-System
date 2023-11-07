import { FC } from "react";
import Navigation from "../components/Navigation";
import AdminFacilities from "../components/AdminFacilities";

const AdminFacilitiesPage: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <Navigation />
      <AdminFacilities />
    </div>
  );
};

export default AdminFacilitiesPage;

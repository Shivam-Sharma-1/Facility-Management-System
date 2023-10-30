import { FC } from "react";
import Navigation from "../components/Navigation";
import Facilities from "../components/Facilities";

const DashboardPage: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <Navigation />
      <Facilities />
    </div>
  );
};

export default DashboardPage;

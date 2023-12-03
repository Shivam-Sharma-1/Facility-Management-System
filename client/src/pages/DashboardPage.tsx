import { FC } from "react";
import Facilities from "../components/Facilities";

const DashboardPage: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <Facilities />
    </div>
  );
};

export default DashboardPage;

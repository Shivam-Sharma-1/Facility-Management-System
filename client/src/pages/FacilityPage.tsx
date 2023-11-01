import { FC } from "react";
import Navigation from "../components/Navigation";
import Calendar from "../components/Calender";

const FacilityPage: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <Navigation />
      <Calendar />
    </div>
  );
};

export default FacilityPage;

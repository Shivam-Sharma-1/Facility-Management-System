import { FC } from "react";
import Calendar from "../components/Calender";

const FacilityPage: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <Calendar />
    </div>
  );
};

export default FacilityPage;

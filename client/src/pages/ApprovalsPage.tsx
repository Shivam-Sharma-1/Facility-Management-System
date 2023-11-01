import { FC } from "react";
import ApprovalStatus from "../components/ApprovalStatus";
import Navigation from "../components/Navigation";

const ApprovalsPage: FC<ApprovalStatusProps> = ({ GD, FM }): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <Navigation />
      <ApprovalStatus GD={GD} FM={FM} />
    </div>
  );
};

export default ApprovalsPage;

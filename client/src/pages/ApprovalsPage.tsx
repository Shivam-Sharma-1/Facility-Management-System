import { FC } from "react";
import ApprovalStatus from "../components/ApprovalStatus";

const ApprovalsPage: FC<ApprovalStatusProps> = ({ GD, FM }): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <ApprovalStatus GD={GD} FM={FM} />
    </div>
  );
};

export default ApprovalsPage;

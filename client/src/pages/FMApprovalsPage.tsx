import { FC } from "react";
import FMApprovalStatus from "../components/FMApprovalStatus";

const FMApprovalsPage: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <FMApprovalStatus />
    </div>
  );
};

export default FMApprovalsPage;

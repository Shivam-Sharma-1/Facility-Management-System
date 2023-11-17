import { FC } from "react";
import GDApprovalStatus from "../components/GDApprovalStatus";

const GDApprovalsPage: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <GDApprovalStatus />
    </div>
  );
};

export default GDApprovalsPage;

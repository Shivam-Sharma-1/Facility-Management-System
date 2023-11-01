import ApprovalStatus from "../components/ApprovalStatus";
import Navigation from "../components/Navigation";

const ApprovalsPage = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <Navigation />
      <ApprovalStatus />
    </div>
  );
};

export default ApprovalsPage;

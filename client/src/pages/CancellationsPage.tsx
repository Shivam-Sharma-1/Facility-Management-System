import { FC } from "react";
import CancellationStatus from "../components/CancellationStatus";

const CancellationsPage: FC<ApprovalStatusProps> = ({
  GD,
  FM,
}): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <CancellationStatus GD={GD} FM={FM} />
    </div>
  );
};

export default CancellationsPage;

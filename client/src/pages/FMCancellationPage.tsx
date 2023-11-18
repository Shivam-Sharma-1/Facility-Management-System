import { FC } from "react";
import FMCancellationStatus from "../components/FMCancellationStatus";

const FMCancellationsPage: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <FMCancellationStatus />
    </div>
  );
};

export default FMCancellationsPage;

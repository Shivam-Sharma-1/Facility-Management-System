import { FC } from "react";
import GDCancellationStatus from "../components/GDCancellationStatus";

const GDCancellationsPage: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <GDCancellationStatus />
    </div>
  );
};

export default GDCancellationsPage;

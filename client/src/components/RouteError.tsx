import { FC } from "react";
import { useRouteError } from "react-router-dom";
import ErrorComponent from "./Error";

const RouteError: FC = (): JSX.Element => {
  const error = useRouteError() as RouteError;

  return <ErrorComponent status={error.status} message={error.message} />;
};

export default RouteError;

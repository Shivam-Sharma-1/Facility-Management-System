import { Navigate } from "react-router-dom";
import { FC } from "react";

import { useAuth } from "../hooks/useAuth";
import ErrorComponent from "./Error";

export const RequireAuth: FC<RequireAuthProps> = ({
  children,
  GD,
  FM,
  Admin,
  noAdmin,
}): JSX.Element => {
  const auth = useAuth();

  if (!auth!.user) {
    return <Navigate to="/auth/login" />;
  }

  try {
    if (GD && auth?.user!.role !== "GROUP_DIRECTOR") {
      return <Navigate to="/" />;
    }

    if (FM && auth?.user!.role !== "FACILITY_MANAGER") {
      return <Navigate to="/" />;
    }

    if (Admin && auth?.user!.role !== "ADMIN") {
      return <Navigate to="/" />;
    }

    if (noAdmin && auth?.user!.role === "ADMIN") {
      return <Navigate to="/admin/facilities" />;
    }
  } catch (err) {
    return (
      <ErrorComponent status={401} message="Please log in and try again" />
    );
  }

  return children;
};

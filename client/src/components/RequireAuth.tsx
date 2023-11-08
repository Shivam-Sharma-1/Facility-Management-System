import { Navigate, useLocation } from "react-router-dom";
import { FC } from "react";

import { useAuth } from "../hooks/useAuth";

export const RequireAuth: FC<RequireAuthProps> = ({
  children,
  GD,
  FM,
  Admin,
  noAdmin,
}): JSX.Element => {
  const location = useLocation();
  const auth = useAuth();

  if (!auth!.user) {
    return <Navigate to="/auth/login" state={{ path: location.pathname }} />;
  }

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

  return children;
};

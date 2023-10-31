import { Navigate, useLocation } from "react-router-dom";
import { FC } from "react";

import { useAuth } from "./hooks/useAuth";

export const RequireAuth: FC<AuthProviderProps> = ({ children }) => {
  const location = useLocation();
  const auth = useAuth();

  if (!auth?.user) {
    return <Navigate to="/auth/login" state={{ path: location.pathname }} />;
  }

  return children;
};

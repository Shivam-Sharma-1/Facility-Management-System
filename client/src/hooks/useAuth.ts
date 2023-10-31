import { useContext } from "react";
import { AuthContext } from "../utils/auth";

export const useAuth = (): AuthContextType | null => useContext(AuthContext);

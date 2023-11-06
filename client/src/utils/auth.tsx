import { createContext, useState, FC } from "react";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("token-info") || "null")
  );

  const login = (newUser: User): void => {
    setUser(newUser);
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("token-info");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

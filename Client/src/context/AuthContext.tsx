import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ResponseTokenDto } from "../dtos/authDtos";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (data: ResponseTokenDto) => void;
  logout: () => void;
  isLoading: boolean;
  refreshAccessState: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const isRefreshTokenValid = (refreshTokenExpiresAt: string | null) => {
  if (!refreshTokenExpiresAt) return false;
  return Date.now() < Number(refreshTokenExpiresAt);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAccessState = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const refreshTokenExpiresAt = localStorage.getItem("refreshTokenExpiresAt");

    const refreshValid = isRefreshTokenValid(refreshTokenExpiresAt);

    if (accessToken) {
      setIsLoggedIn(true);
    } else if (refreshToken && refreshValid) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    refreshAccessState();
  }, []);

  const login = (data: ResponseTokenDto) => {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("refreshTokenExpiresAt", data.refreshTokenExpiresAt);

    setIsLoggedIn(true);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshTokenExpiresAt");

    setIsLoggedIn(false);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, isLoading, refreshAccessState }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "./authContext";

const AUTH_STORAGE_KEY = "auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

      if (!savedAuth) {
        return;
      }

      const parsedAuth = JSON.parse(savedAuth);

      if (parsedAuth?.token) {
        setToken(parsedAuth.token);
        setUser(parsedAuth.user ?? null);
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: newToken, user: newUser })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser);

    setToken((currentToken) => {
      if (currentToken) {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ token: currentToken, user: nextUser })
        );
      }

      return currentToken;
    });
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [token, user, isLoading, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

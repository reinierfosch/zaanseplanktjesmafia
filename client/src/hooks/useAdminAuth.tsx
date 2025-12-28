import { useState, useEffect, createContext, useContext, ReactNode } from "react";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  sessionId: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedSessionId = localStorage.getItem("adminSessionId");
      if (!storedSessionId) {
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/admin/me", {
        headers: {
          Authorization: `Bearer ${storedSessionId}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setSessionId(storedSessionId);
      } else {
        localStorage.removeItem("adminSessionId");
        setIsAuthenticated(false);
        setSessionId(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      localStorage.removeItem("adminSessionId");
      setIsAuthenticated(false);
      setSessionId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (password: string) => {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("adminSessionId", data.sessionId);
    setSessionId(data.sessionId);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      if (sessionId) {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionId}`,
          },
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("adminSessionId");
      setSessionId(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        sessionId,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}


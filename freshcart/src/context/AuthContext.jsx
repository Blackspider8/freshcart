import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      try {
        const decoded = jwtDecode(stored);
        setUser(decoded);
        setToken(stored);
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const loginUser = (tkn) => {
    localStorage.setItem('token', tkn);
    const decoded = jwtDecode(tkn);
    setToken(tkn);
    setUser(decoded);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

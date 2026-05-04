import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { const token = localStorage.getItem('sisdip_token'); if (!token) return setLoading(false); api.get('/auth/me').then(({ data }) => setUser(data)).catch(() => localStorage.removeItem('sisdip_token')).finally(() => setLoading(false)); }, []);
  async function login(email, password) { const { data } = await api.post('/auth/login', { email, password }); localStorage.setItem('sisdip_token', data.token); setUser(data.user); }
  function logout() { localStorage.removeItem('sisdip_token'); setUser(null); }
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }

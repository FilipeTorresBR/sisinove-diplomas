import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch {
      setError("Usuário ou senha inválidos.");
    }
  }
  return (
    <div className="login-wrap">
      <img
        style={{ width: 350, marginBottom: 15 }}
        src="/src/assets/sisinove-logo-transparente.png"
      ></img>
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 style={{ marginTop: 0 }}>Sisinove Diplomas</h1>
        <p className="muted">Sistema de Registro de Diplomas</p>
        <input
          placeholder="E-mail"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ width: "100%", marginBottom: 12 }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ width: "100%", marginBottom: 12 }}
        />
        {error && (
          <div style={{ color: "#c0392b", marginBottom: 10 }}>{error}</div>
        )}
        <button style={{ width: "100%" }}>Entrar</button>
      </form>
    </div>
  );
}

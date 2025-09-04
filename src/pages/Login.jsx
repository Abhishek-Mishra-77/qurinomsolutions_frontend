import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { setToken, setUser } from "../auth/auth";
import { Card } from "react-bootstrap";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);
      if (data?.token && data?.user) {
        setToken(data.token);
        setUser(data.user);

        alert(`Welcome back, ${data.user.name}!`);
        navigate("/");
      } else {
        alert("Invalid response from server.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)",
      }}
    >
      <Card
        className="p-4 shadow-lg border-0"
        style={{ width: "25rem", borderRadius: "1rem" }}
      >
        <h3 className="mb-4 text-center fw-bold text-primary">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Login
          </button>
        </form>
        <div className="d-flex justify-content-between mt-3">
          <span
            className="text-primary text-decoration-underline"
            style={{ cursor: "pointer" }}
            onClick={() => alert("Redirect to forgot password")}
          >
            Forgot Password?
          </span>
          <span
            className="text-primary fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Create Account
          </span>
        </div>
      </Card>
    </div>
  );
}

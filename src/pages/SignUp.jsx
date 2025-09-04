import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";
import { Container, Card } from "react-bootstrap";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", form);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      }}
    >
      <Card
        className="p-4 shadow-lg border-0"
        style={{ width: "25rem", borderRadius: "1rem" }}
      >
        <h3 className="mb-4 text-center fw-bold text-primary">Create Account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>
          <div className="mb-3">
            <Input
              label="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-3">
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
            />
          </div>
          <Button type="submit" className="w-100 btn btn-primary fw-semibold">
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-center text-muted">
          Already have an account?{" "}
          <span
            className="text-decoration-underline text-primary fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </Card>
    </div>
  );
}

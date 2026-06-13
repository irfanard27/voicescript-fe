import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await register({
        name,
        email,
        password,
        role,
        location: location || undefined,
      });
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white px-8 py-10 rounded-xl border border-gray-200 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label className="mb-1.5"> Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input"
            placeholder="Name"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1.5"> Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
            placeholder="Email"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1.5"> Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
            placeholder="Password"
          />
        </div>

        <div className="border-b border-gray-200 my-8" />

        <div className="mb-4">
          <label className="mb-1.5"> Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="input"
          >
            <option value="">Select</option>
            <option value="admin">Admin</option>
            <option value="reporter">Reporter</option>
            <option value="editor">Editor</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="mb-1.5"> Location (optional)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input"
            placeholder="Location"
          />
        </div>
        <button type="submit" className="w-full button-primary">
          Register
        </button>
        <p className="mt-4 text-center text-gray-600">
          Already registered?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

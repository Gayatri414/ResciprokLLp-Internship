import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill required fields");
      return;
    }
    if (role === "company" && !companyName) {
      toast.error("Company name is required");
      return;
    }
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        ...(role === "company" && { companyName, description, website }),
      });
      toast.success("Account created successfully");
      navigate(role === "company" ? "/dashboard/company" : "/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="card-glass w-full max-w-md p-8 animate-slide-up border border-white/10">
        <h1 className="font-display text-2xl font-bold text-white">Create account</h1>
        <p className="mt-1 text-slate-400">Join JobSphere as a candidate or company</p>

        <div className="mt-6 flex rounded-xl border border-white/10 p-1 bg-white/5">
          <button type="button" onClick={() => setRole("user")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${role === "user" ? "bg-primary-500/30 text-white shadow-glow-sm" : "text-slate-400 hover:text-white"}`}>
            Job Seeker
          </button>
          <button type="button" onClick={() => setRole("company")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${role === "company" ? "bg-primary-500/30 text-white shadow-glow-sm" : "text-slate-400 hover:text-white"}`}>
            Company
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={role === "company" ? "Your name" : "Full name"} required />
          </div>
          {role === "company" && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Company name</label>
                <input type="text" className="input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Inc." required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description (optional)</label>
                <textarea className="input min-h-[80px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does your company do?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Website (optional)</label>
                <input type="url" className="input" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" minLength={6} required />
          </div>
          <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-slate-400 text-sm">
          Already have an account? <Link to="/login" className="text-primary-400 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

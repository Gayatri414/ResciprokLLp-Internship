import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { jobAPI } from "../api/services";

export default function PostJob() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [loading, setLoading] = useState(!!editId);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editId) return;
    const fetch = async () => {
      try {
        const { data } = await jobAPI.getJobById(editId);
        setTitle(data.job.title);
        setDescription(data.job.description);
        setLocation(data.job.location);
        setSalary(data.job.salary || "");
        setSkillsRequired((data.job.skillsRequired || []).join(", "));
      } catch (err) {
        toast.error("Job not found");
        navigate("/dashboard/company");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [editId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skills = skillsRequired ? skillsRequired.split(",").map((s) => s.trim()).filter(Boolean) : [];
    setSaving(true);
    try {
      if (editId) {
        await jobAPI.updateJob(editId, { title, description, location, salary: salary || "Not disclosed", skillsRequired: skills });
        toast.success("Job updated");
      } else {
        await jobAPI.createJob({ title, description, location, salary: salary || "Not disclosed", skillsRequired: skills });
        toast.success("Job posted");
      }
      navigate("/dashboard/company");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save job");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-2xl font-bold text-white">{editId ? "Edit job" : "Post a job"}</h1>
      <p className="mt-1 text-slate-400">Fill in the details below</p>

      <form onSubmit={handleSubmit} className="card-glass p-6 mt-8 space-y-4 border border-white/10">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Job title</label>
          <input type="text" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior React Developer" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea className="input min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the role and requirements..." required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
          <input type="text" className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Remote, New York" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Salary (optional)</label>
          <input type="text" className="input" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. $80k - $120k or Not disclosed" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Skills required (comma separated)</label>
          <input type="text" className="input" value={skillsRequired} onChange={(e) => setSkillsRequired(e.target.value)} placeholder="React, Node.js, MongoDB" />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving..." : editId ? "Update job" : "Post job"}</button>
          <button type="button" className="btn-secondary" onClick={() => navigate("/dashboard/company")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { companyAPI } from "../api/services";
import { jobAPI } from "../api/services";

export default function CompanyDashboard() {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [companyRes, jobsRes] = await Promise.all([companyAPI.getMe(), jobAPI.getMyCompanyJobs()]);
        setCompany(companyRes.data.company);
        setJobs(jobsRes.data.jobs || []);
        setCompanyName(companyRes.data.company?.companyName || "");
        setDescription(companyRes.data.company?.description || "");
        setWebsite(companyRes.data.company?.website || "");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await companyAPI.updateMe({ companyName, description, website });
      setCompany(data.company);
      setEditMode(false);
      toast.success("Company profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("logo", file);
    try {
      const { data } = await companyAPI.uploadLogo(formData);
      setCompany(data.company);
      toast.success("Logo updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  const handleDeleteJob = async (id) => {
    if (!confirm("Delete this job? Applications will be removed.")) return;
    try {
      await jobAPI.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success("Job deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="skeleton h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-2xl font-bold text-slate-900">Company Dashboard</h1>
      <p className="mt-1 text-slate-600">Manage your company and job postings</p>

      <div className="card p-6 mt-8">
        <div className="flex flex-wrap items-start gap-6">
          <div className="relative">
            {company?.logo ? (
              <img src={company.logo} alt="Logo" className="w-24 h-24 rounded-xl object-cover border border-slate-200" />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 text-2xl font-display">{companyName?.charAt(0) || "C"}</div>
            )}
            <label className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-1.5 cursor-pointer hover:bg-primary-700 text-xs">+
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
          </div>
          <div className="flex-1 min-w-0">
            {editMode ? (
              <form onSubmit={handleSave} className="space-y-3">
                <input type="text" className="input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" required />
                <textarea className="input min-h-[80px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                <input type="url" className="input" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website" />
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                  <button type="button" className="btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="font-semibold text-white">{company?.companyName}</h2>
                <p className="text-slate-400 text-sm mt-1">{company?.description || "No description."}</p>
                {company?.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary-400 text-sm hover:underline block mt-1">Website</a>}
                <button type="button" className="btn-ghost text-sm mt-3" onClick={() => setEditMode(true)}>Edit company profile</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-white">Your Jobs</h2>
        <Link to="/dashboard/company/post-job" className="btn-primary text-sm">Post a job</Link>
      </div>
      {jobs.length === 0 ? (
        <p className="mt-4 text-slate-400">No jobs posted. <Link to="/dashboard/company/post-job" className="text-primary-400 hover:underline">Post your first job</Link></p>
      ) : (
        <ul className="mt-4 space-y-3">
          {jobs.map((job) => (
            <li key={job._id} className="card-glass p-4 flex border border-white/10 flex-wrap items-center justify-between gap-2">
              <div>
<span className="font-medium text-white">{job.title}</span>
              <span className="text-slate-400 text-sm ml-2">{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/dashboard/company/jobs/${job._id}/applications`} className="btn-ghost text-sm">View applicants</Link>
                <Link to={`/dashboard/company/post-job?edit=${job._id}`} className="btn-ghost text-sm">Edit</Link>
                <button type="button" className="text-red-400 text-sm hover:underline" onClick={() => handleDeleteJob(job._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

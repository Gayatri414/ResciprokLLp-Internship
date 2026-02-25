import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { jobAPI } from "../api/services";
import { applicationAPI } from "../api/services";
import { useAuth } from "../context/AuthContext";

export default function JobDetails() {
  const { id } = useParams();
  const { user, isAuthenticated, isUser } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await jobAPI.getJobById(id);
        setJob(data.job);
      } catch (err) {
        toast.error(err.response?.data?.message || "Job not found");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated || !isUser) {
      toast.error("Please log in as a job seeker to apply");
      return;
    }
    setApplying(true);
    try {
      await applicationAPI.apply(id);
      setApplied(true);
      toast.success("Application submitted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="skeleton h-8 w-2/3 mb-4" />
        <div className="skeleton h-4 w-full mb-2" />
        <div className="skeleton h-4 w-full mb-2" />
        <div className="skeleton h-32 w-full mt-6" />
      </div>
    );
  }

  if (!job) return null;

  const company = job.company;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/jobs" className="text-primary-400 hover:underline text-sm font-medium mb-6 inline-block">← Back to jobs</Link>
      <div className="card-glass p-8 border border-white/10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{job.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-slate-400">
              {company?.companyName && <span>{company.companyName}</span>}
              <span>{job.location}</span>
              <span>{job.salary}</span>
            </div>
            {job.skillsRequired?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skillsRequired.map((s) => (
                  <span key={s} className="px-2 py-1 bg-white/10 rounded text-sm text-slate-300">{s}</span>
                ))}
              </div>
            )}
          </div>
          {isUser && (
            <button type="button" className="btn-primary" disabled={applied || applying} onClick={handleApply}>
              {applied ? "Applied" : applying ? "Applying..." : "Apply now"}
            </button>
          )}
        </div>
        <div className="mt-8 pt-6 border-t border-white/10">
          <h2 className="font-semibold text-white mb-2">Description</h2>
          <div className="text-slate-400 whitespace-pre-wrap">{job.description}</div>
        </div>
        {company && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h2 className="font-semibold text-white mb-2">Company</h2>
            <p className="text-slate-400">{company.description || "No description."}</p>
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline mt-2 inline-block">Visit website</a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

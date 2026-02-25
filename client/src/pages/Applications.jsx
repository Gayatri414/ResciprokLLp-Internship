import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { applicationAPI } from "../api/services";
import { jobAPI } from "../api/services";

export default function Applications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { isCompany } = useAuth();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (isCompany && jobId) {
          const [appRes, jobRes] = await Promise.all([applicationAPI.getByJob(jobId), jobAPI.getJobById(jobId)]);
          setApplications(appRes.data.applications || []);
          setJob(jobRes.data.job);
        } else {
          const { data } = await applicationAPI.getMyApplications();
          setApplications(data.applications || []);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [isCompany, jobId]);

  const handleStatus = async (appId, status) => {
    try {
      await applicationAPI.updateStatus(appId, status);
      setApplications((prev) => prev.map((a) => (a._id === appId ? { ...a, status } : a)));
      toast.success(`Application ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleWithdraw = async (id) => {
    if (!confirm("Withdraw this application?")) return;
    try {
      await applicationAPI.withdraw(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
      toast.success("Withdrawn");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="skeleton h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {isCompany && jobId && (
        <>
          <Link to="/dashboard/company" className="text-primary-400 hover:underline text-sm mb-4 inline-block">← Back to dashboard</Link>
          {job && <h1 className="font-display text-2xl font-bold text-white">Applicants for {job.title}</h1>}
        </>
      )}
      {!isCompany && <h1 className="font-display text-2xl font-bold text-white">My Applications</h1>}
      <p className="mt-1 text-slate-400">{applications.length} application(s)</p>

      {applications.length === 0 ? (
        <div className="card-glass p-8 mt-6 text-center text-slate-400 border border-white/10">
          {isCompany ? "No applications yet for this job." : "You haven't applied to any jobs yet. Browse jobs to apply."}
          {!isCompany && <Link to="/jobs" className="block mt-2 text-primary-400 hover:underline">Browse jobs</Link>}
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {applications.map((app) => (
            <li key={app._id} className="card-glass p-6 border border-white/10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-white">{app.user?.name || "Applicant"}</h3>
                  <p className="text-slate-400 text-sm">{app.user?.email}</p>
                  {app.job && !isCompany && (
                    <p className="mt-1 text-slate-500 text-sm">Applied to: {app.job.title}</p>
                  )}
                  {app.user?.skills?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {app.user.skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-white/10 rounded text-sm text-slate-300">{s}</span>
                      ))}
                    </div>
                  )}
                  {app.user?.resume && (
                    <a href={app.user.resume} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-primary-400 text-sm hover:underline">View resume</a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${app.status === "accepted" ? "bg-green-500/20 text-green-400" : app.status === "rejected" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>{app.status}</span>
                  {isCompany && app.status === "pending" && (
                    <>
                      <button type="button" className="btn-primary text-sm" onClick={() => handleStatus(app._id, "accepted")}>Accept</button>
                      <button type="button" className="btn-secondary text-sm" onClick={() => handleStatus(app._id, "rejected")}>Reject</button>
                    </>
                  )}
                  {!isCompany && app.status === "pending" && (
                    <button type="button" className="text-red-400 text-sm hover:underline" onClick={() => handleWithdraw(app._id)}>Withdraw</button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

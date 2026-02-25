import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../api/services";
import { applicationAPI } from "../api/services";

export default function UserDashboard() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [profileRes, appRes] = await Promise.all([userAPI.getProfile(), applicationAPI.getMyApplications()]);
        setProfile(profileRes.data.user);
        setApplications(appRes.data.applications || []);
        setName(profileRes.data.user?.name || "");
        setSkills((profileRes.data.user?.skills || []).join(", "));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skillsArr = skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : [];
      const { data } = await userAPI.updateProfile({ name, skills: skillsArr });
      setProfile(data.user);
      updateUser(data.user);
      setEditMode(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const { data } = await userAPI.uploadAvatar(formData);
      setProfile(data.user);
      updateUser(data.user);
      toast.success("Avatar updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const { data } = await userAPI.uploadResume(formData);
      setProfile(data.user);
      updateUser(data.user);
      toast.success("Resume uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  const handleWithdraw = async (id) => {
    if (!confirm("Withdraw this application?")) return;
    try {
      await applicationAPI.withdraw(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
      toast.success("Application withdrawn");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
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

  const u = profile || user;
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-2xl font-bold text-white">My Dashboard</h1>
      <p className="mt-1 text-slate-400">Manage your profile and applications</p>

      <div className="card-glass p-6 mt-8 border border-white/10">
        <div className="flex flex-wrap items-start gap-6">
          <div className="relative">
            {u?.avatar ? (
              <img src={u.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-slate-200" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-2xl font-display">{u?.name?.charAt(0) || "?"}</div>
            )}
            <label className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-1.5 cursor-pointer hover:bg-primary-700">
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              <span className="text-xs">+</span>
            </label>
          </div>
          <div className="flex-1 min-w-0">
            {editMode ? (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                <input type="text" className="input" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Skills (comma separated)" />
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                  <button type="button" className="btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="font-semibold text-white">{u?.name}</h2>
                <p className="text-slate-400 text-sm">{u?.email}</p>
                {u?.skills?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {u.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-white/10 rounded text-sm text-slate-300">{s}</span>
                    ))}
                  </div>
                )}
                {u?.resume && (
                  <a href={u.resume} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-primary-400 text-sm hover:underline">View resume</a>
                )}
                <div className="mt-3 flex gap-2">
                  <button type="button" className="btn-ghost text-sm" onClick={() => setEditMode(true)}>Edit profile</button>
                  <label className="btn-ghost text-sm cursor-pointer">
                    Upload resume
                    <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold text-white">My Applications</h2>
        <Link to="/dashboard/applications" className="text-primary-400 text-sm hover:underline mt-1 inline-block">View all →</Link>
        {applications.length === 0 ? (
          <p className="mt-4 text-slate-400">No applications yet. <Link to="/jobs" className="text-primary-600 hover:underline">Browse jobs</Link></p>
        ) : (
          <ul className="mt-4 space-y-2">
            {applications.slice(0, 5).map((app) => (
              <li key={app._id} className="card-glass p-4 flex border border-white/10 flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-medium">{app.job?.title}</span>
                  <span className="text-slate-500 text-sm ml-2">{app.job?.company?.companyName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-sm ${app.status === "accepted" ? "bg-green-100 text-green-800" : app.status === "rejected" ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700"}`}>{app.status}</span>
                  <button type="button" className="text-red-400 text-sm hover:underline" onClick={() => handleWithdraw(app._id)}>Withdraw</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

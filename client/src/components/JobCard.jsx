import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  const company = job.company;
  return (
    <Link to={`/jobs/${job._id}`} className="card-glass p-5 block hover:border-primary-500/30 transition-all duration-200 group">
      <h3 className="font-display font-semibold text-white group-hover:text-primary-400 transition">{job.title}</h3>
      <p className="mt-1 text-slate-400 text-sm">{company?.companyName}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-slate-500 text-sm">
        <span>{job.location}</span>
        <span>{job.salary}</span>
      </div>
      {job.skillsRequired?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {job.skillsRequired.slice(0, 4).map((s) => (
            <span key={s} className="px-2 py-0.5 bg-white/10 rounded text-xs text-slate-400">{s}</span>
          ))}
        </div>
      )}
    </Link>
  );
}

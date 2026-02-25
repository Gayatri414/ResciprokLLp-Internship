import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { jobAPI } from "../api/services";
import JobCard from "../components/JobCard";
import JobCardSkeleton from "../components/JobCardSkeleton";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchJobs = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await jobAPI.getJobs({ search: search || undefined, location: location || undefined, skills: skills || undefined, page: p, limit: 12 });
      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-white">Browse Jobs</h1>
      <p className="mt-1 text-slate-400">Search by title, location, or skills</p>

      <form onSubmit={handleSearch} className="mt-8 flex flex-wrap gap-3">
        <input type="text" className="input flex-1 min-w-[200px]" placeholder="Job title or keyword" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input type="text" className="input flex-1 min-w-[180px]" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input type="text" className="input flex-1 min-w-[180px]" placeholder="Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      <div className="mt-10">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="card-glass p-12 text-center text-slate-400">No jobs found. Try different filters.</div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex justify-center gap-2 items-center flex-wrap">
                <button type="button" className="btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
                <span className="px-4 text-slate-400">Page {page} of {pagination.pages}</span>
                <button type="button" className="btn-secondary" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

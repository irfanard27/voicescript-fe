import { useState } from "react";
import { Link } from "react-router-dom";
import { useJobs } from "../api/hooks";
import StatusBadge from "../components/StatusBadge";
import type { JobStatus } from "../types";

const statuses: (JobStatus | "all")[] = [
  "all",
  "new",
  "assigned",
  "transcribed",
  "reviewed",
  "completed",
];

export default function DashboardPage() {
  const [filter, setFilter] = useState<string>("all");
  const {
    data: jobs,
    isLoading,
    error,
  } = useJobs(filter !== "all" ? filter : undefined);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Link to="/jobs/new" className="button-primary">
          + Create Job
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded cursor-pointer ${
              filter === s
                ? "bg-gray-900 text-white"
                : "border border-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">Error loading jobs</p>}

      {jobs && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-400">
                <th className="px-4 py-3 font-medium">Case</th>
                <th className="px-4 py-3 font-medium">Dur</th>
                <th className="px-4 py-3 font-medium">Loc</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Acts</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-t border-gray-200">
                  <td className="px-4 py-3">{job.caseName}</td>
                  <td className="px-4 py-3">{job.durationMinutes}min</td>
                  <td className="px-4 py-3 capitalize">{job.location}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={job.status as JobStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

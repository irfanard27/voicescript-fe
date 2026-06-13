import type { JobStatus } from "../types";

const colors: Record<JobStatus, string> = {
  new: "bg-gray-100 text-gray-800",
  assigned: "bg-blue-100 text-blue-800",
  transcribed: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
};

const labels: Record<JobStatus, string> = {
  new: "NEW",
  assigned: "ASGN",
  transcribed: "TRANSCRIBED",
  reviewed: "REVIEWED",
  completed: "COMPLETED",
};

export default function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}
    >
      ● {labels[status]}
    </span>
  );
}

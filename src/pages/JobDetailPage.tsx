import { useParams, Link } from "react-router-dom";
import {
  useJob,
  useAssignReporter,
  useAssignEditor,
  useUpdateStatus,
  useReporters,
  useEditors,
} from "../api/hooks";
import StatusBadge from "../components/StatusBadge";
import type { JobStatus } from "../types";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);
  const { data: job, isLoading, error } = useJob(jobId);
  const assignReporter = useAssignReporter();
  const assignEditor = useAssignEditor();
  const updateStatus = useUpdateStatus();
  const { data: reporters } = useReporters();
  const { data: editors } = useEditors();

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (error || !job) return <p className="text-red-600">Job not found</p>;

  const status = job.status as JobStatus;

  function handleAssignReporter(reporterId: number) {
    assignReporter.mutate({ id: jobId, reporterId: reporterId });
  }

  function handleAssignEditor(editorId: number) {
    assignEditor.mutate({ id: jobId, editorId });
  }

  function handleUpdateStatus(newStatus: string) {
    updateStatus.mutate({ id: jobId, status: newStatus });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Dashboard
      </Link>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{job.caseName}</h1>
          <hr className="mb-4" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Duration:</span>{" "}
              {job.durationMinutes} min
            </div>
            <div>
              <span className="text-gray-500">Location:</span>{" "}
              <span className="capitalize">{job.location}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Status:</span>{" "}
              <StatusBadge status={status} />
            </div>
          </div>
        </div>

        <hr />

        {status === "new" && (
          <div>
            <h2 className="font-semibold mb-2">Assign Reporter</h2>
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value)
                  handleAssignReporter(Number(e.target.value));
              }}
              className="w-full border rounded px-3 py-2"
            >
              <option value="" disabled>
                {assignReporter.isPending ? "Assigning..." : "Select reporter"}
              </option>
              {reporters?.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.email})
                </option>
              ))}
            </select>
            {job.reporter && (
              <p className="text-sm text-green-600 mt-1">
                ✓ Done — {job.reporter.name}
              </p>
            )}
          </div>
        )}

        {status === "transcribed" && (
          <div>
            <h2 className="font-semibold mb-2">Assign Editor</h2>
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) handleAssignEditor(Number(e.target.value));
              }}
              className="w-full border rounded px-3 py-2"
            >
              <option value="" disabled>
                {assignEditor.isPending ? "Assigning..." : "Select editor"}
              </option>
              {editors?.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.email})
                </option>
              ))}
            </select>
            {job.editor && (
              <p className="text-sm text-green-600 mt-1">
                ✓ Done — {job.editor.name}
              </p>
            )}
          </div>
        )}

        {(status === "assigned" || status === "reviewed") && (
          <div>
            <h2 className="font-semibold mb-2">Actions</h2>
            {status === "assigned" && (
              <button
                onClick={() => handleUpdateStatus("transcribed")}
                disabled={updateStatus.isPending}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
              >
                {updateStatus.isPending ? "Updating..." : "Mark Transcribed"}
              </button>
            )}
            {status === "reviewed" && (
              <button
                onClick={() => handleUpdateStatus("completed")}
                disabled={updateStatus.isPending}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {updateStatus.isPending ? "Updating..." : "Mark Completed"}
              </button>
            )}
          </div>
        )}

        <hr />

        <div>
          <h2 className="font-semibold mb-2">Payment</h2>
          {(() => {
            const reporterCost = job.durationMinutes * job.reporterRate;
            const editorCost = job.editorFee;
            const total = reporterCost + editorCost;
            return (
              <div className="text-sm space-y-1">
                <p>
                  Reporter: {job.durationMinutes} ×{" "}
                  {job.reporterRate.toLocaleString()} ={" "}
                  {reporterCost.toLocaleString()}
                </p>
                <p>Editor: {editorCost.toLocaleString()}</p>
                <p className="font-semibold">
                  Total: {total.toLocaleString()} IDR
                </p>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateJob } from "../api/hooks";

export default function CreateJobPage() {
  const [caseName, setCaseName] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState<"physical" | "remote">("physical");
  const [reporterRate, setReporterRate] = useState("2000");
  const [editorFee, setEditorFee] = useState("10000");
  const [error, setError] = useState("");
  const createJob = useCreateJob();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const job = await createJob.mutateAsync({
        caseName,
        durationMinutes: Number(duration),
        location,
        reporterRate: Number(reporterRate),
        editorFee: Number(editorFee),
      });
      navigate(`/jobs/${job.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create job");
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Job</h1>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="border border-gray-200 p-6 rounded-lg space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Case Name
          </label>
          <input
            type="text"
            value={caseName}
            onChange={(e) => setCaseName(e.target.value)}
            required
            className="input"
            placeholder="Input case name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (min)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            min={1}
            className="input"
            placeholder="Input duration in mins"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            value={location}
            onChange={(e) =>
              setLocation(e.target.value as "physical" | "remote")
            }
            className="input"
          >
            <option value="physical">Physical</option>
            <option value="remote">Remote</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reporter Rate (IDR/min)
          </label>
          <input
            type="number"
            value={reporterRate}
            onChange={(e) => setReporterRate(e.target.value)}
            required
            min={0}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Editor Fee (IDR)
          </label>
          <input
            type="number"
            value={editorFee}
            onChange={(e) => setEditorFee(e.target.value)}
            required
            min={0}
            className="input"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="button-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createJob.isPending}
            className="button-primary"
          >
            {createJob.isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

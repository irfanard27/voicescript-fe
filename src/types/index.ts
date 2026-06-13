export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: string;
  location?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type JobStatus = "new" | "assigned" | "transcribed" | "reviewed" | "completed";

export interface Job {
  id: number;
  caseName: string;
  durationMinutes: number;
  location: "physical" | "remote";
  status: JobStatus;
  reporterRate: number;
  editorFee: number;
  reporterId?: number | null;
  editorId?: number | null;
  reporter?: User | null;
  editor?: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobInput {
  caseName: string;
  durationMinutes: number;
  location: "physical" | "remote";
  reporterRate: number;
  editorFee: number;
}

export interface Payment {
  reporterCost: number;
  editorCost: number;
  total: number;
}

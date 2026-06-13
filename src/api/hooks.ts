import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import type {
  AuthResponse,
  CreateJobInput,
  Job,
  Payment,
  RegisterInput,
  User,
} from "../types";

export function useLogin() {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<AuthResponse>("/auth/login", data),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterInput) =>
      api.post<AuthResponse>("/auth/register", data),
  });
}

export function useMe(enabled: boolean) {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<User>("/auth/me"),
    retry: false,
    enabled,
  });
}

export function useJobs(status?: string) {
  const params = status ? `?status=${status}` : "";
  return useQuery({
    queryKey: ["jobs", status],
    queryFn: () => api.get<Job[]>(`/jobs${params}`),
  });
}

export function useJob(id: number) {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: () => api.get<Job>(`/jobs/${id}`),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobInput) => api.post<Job>("/jobs", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useAssignReporter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reporterId }: { id: number; reporterId: number }) =>
      api.post<Job>(`/jobs/${id}/assign-reporter`, { reporterId }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["jobs", id] });
    },
  });
}

export function useAssignEditor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, editorId }: { id: number; editorId: number }) =>
      api.post<Job>(`/jobs/${id}/assign-editor`, { editorId }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["jobs", id] });
    },
  });
}

export function useUpdateStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch<Job>(`/jobs/${id}/status`, { status }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["jobs", id] });
    },
  });
}

export function usePayment(id: number) {
  return useQuery({
    queryKey: ["jobs", id, "payment"],
    queryFn: () => api.get<Payment>(`/jobs/${id}/payment`),
    enabled: !!id,
  });
}

export function useReporters() {
  return useQuery({
    queryKey: ["reporters"],
    queryFn: () => api.get<User[]>("/reporters"),
  });
}

export function useEditors() {
  return useQuery({
    queryKey: ["editors"],
    queryFn: () => api.get<User[]>("/editors"),
  });
}

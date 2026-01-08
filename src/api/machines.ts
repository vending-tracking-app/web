import { api } from "../lib/api-client";

// Types
export interface Machine {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  location: string;
}

export interface CreateMachineInput {
  name: string;
  location: string;
}

export interface UpdateMachineInput {
  name?: string;
  location?: string;
}

// API functions
export const fetchMachines = () => api.get<Machine[]>("/machines");

export const fetchMachine = (id: string) => api.get<Machine>(`/machines/${id}`);

export const createMachine = (data: CreateMachineInput) =>
  api.post<Machine>("/machines", data);

export const updateMachine = ({
  id,
  data,
}: {
  id: string;
  data: UpdateMachineInput;
}) => api.patch<Machine>(`/machines/${id}`, data);

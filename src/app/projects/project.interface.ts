export interface Project {
  id?: number;
  name: string;
  description?: string;
  startDate: string;
  deadLine: string;
  status: 'New' | 'In Progress' | 'Completed' | 'On Hold';
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

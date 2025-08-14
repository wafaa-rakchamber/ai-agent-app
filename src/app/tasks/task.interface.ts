export interface Task {
  id?: number;
  title: string;
  description?: string;
  estimationHours: number;
  workingHours: number;
  status: 'New' | 'In Progress' | 'Testing' | 'Completed' | 'Blocked';
  storyId: number;
  assignedTo: number;
  createdAt?: string;
  updatedAt?: string;
  story?: Story;
  assignedUser?: User;
}

export interface Story {
  id: number;
  title: string;
  description?: string;
  iteration?: string;
  status: string;
  StoryPoint: number;
  projectId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface TaskStats {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
  blocked: number;
  totalEstimationHours: number;
  totalWorkingHours: number;
}

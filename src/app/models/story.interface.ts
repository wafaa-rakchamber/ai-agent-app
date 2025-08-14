export interface Story {
  id?: number;
  title: string;
  description: string;
  iteration: string;
  status: 'New' | 'inProgress' | 'Closed' | 'Canceled';
  StoryPoint: number;
  projectId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoryFormData {
  title: string;
  description: string;
  iteration: string;
  status: 'New' | 'inProgress' | 'Closed' | 'Canceled';
  StoryPoint: number;
  projectId: number;
}

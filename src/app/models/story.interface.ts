export interface Story {
  id?: string;
  title: string;
  description: string;
  iteration: string;
  status: 'New' | 'inProgress' | 'Closed' | 'Canceled';
  StoryPoint: number;
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoryFormData {
  title: string;
  description: string;
  iteration: string;
  status: 'New' | 'inProgress' | 'Closed' | 'Canceled';
  StoryPoint: number;
  projectId: string;
}

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Story } from '../models/story.interface';
import { Project } from './api-test.service';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  
  private mockProjects: Project[] = [
    { 
      id: 1, 
      name: 'Web Application', 
      description: 'Main web application project',
      startDate: '2024-01-01',
      deadLine: '2024-06-30',
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    { 
      id: 2, 
      name: 'Mobile App', 
      description: 'Mobile application development',
      startDate: '2024-02-01',
      deadLine: '2024-08-31',
      status: 'Active',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z'
    },
    { 
      id: 3, 
      name: 'API Backend', 
      description: 'Backend API services',
      startDate: '2024-01-15',
      deadLine: '2024-07-15',
      status: 'Active',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    { 
      id: 4, 
      name: 'Data Analytics', 
      description: 'Data analysis and reporting',
      startDate: '2024-03-01',
      deadLine: '2024-09-30',
      status: 'Planning',
      createdAt: '2024-03-01T00:00:00Z',
      updatedAt: '2024-03-01T00:00:00Z'
    }
  ];

  private mockStories: Story[] = [
    {
      id: 1,
      title: 'User Authentication',
      description: 'Implement user login and registration',
      iteration: 'Sprint 1',
      status: 'New',
      StoryPoint: 5,
      projectId: 1,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: 2,
      title: 'Dashboard Design',
      description: 'Create responsive dashboard layout',
      iteration: 'Sprint 1',
      status: 'inProgress',
      StoryPoint: 8,
      projectId: 1,
      createdAt: '2024-01-16T00:00:00Z',
      updatedAt: '2024-01-18T00:00:00Z'
    },
    {
      id: 3,
      title: 'API Integration',
      description: 'Connect frontend with backend APIs',
      iteration: 'Sprint 2',
      status: 'New',
      StoryPoint: 13,
      projectId: 3,
      createdAt: '2024-01-17T00:00:00Z',
      updatedAt: '2024-01-17T00:00:00Z'
    },
    {
      id: 4,
      title: 'Mobile UI Components',
      description: 'Design reusable mobile UI components',
      iteration: 'Sprint 1',
      status: 'Closed',
      StoryPoint: 3,
      projectId: 2,
      createdAt: '2024-01-12T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    }
  ];

  getProjects(): Observable<Project[]> {
    console.log('MockDataService: Getting projects');
    return of(this.mockProjects).pipe(delay(500)); // Simulate network delay
  }

  getStories(): Observable<Story[]> {
    console.log('MockDataService: Getting stories');
    return of(this.mockStories).pipe(delay(300));
  }

  createStory(story: Partial<Story>): Observable<Story> {
    const maxId = this.mockStories.length > 0 ? Math.max(...this.mockStories.map(s => s.id || 0)) : 0;
    const newStory: Story = {
      id: maxId + 1,
      title: story.title || '',
      description: story.description || '',
      iteration: story.iteration || '',
      status: story.status || 'New',
      StoryPoint: story.StoryPoint || 1,
      projectId: story.projectId || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.mockStories.push(newStory);
    console.log('MockDataService: Created story', newStory);
    return of(newStory).pipe(delay(400));
  }

  updateStory(id: number, story: Partial<Story>): Observable<Story> {
    const index = this.mockStories.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Story not found');
    }
    
    this.mockStories[index] = { 
      ...this.mockStories[index], 
      ...story, 
      updatedAt: new Date().toISOString() 
    };
    
    console.log('MockDataService: Updated story', this.mockStories[index]);
    return of(this.mockStories[index]).pipe(delay(400));
  }

  deleteStory(id: number): Observable<void> {
    const index = this.mockStories.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Story not found');
    }
    
    this.mockStories.splice(index, 1);
    console.log('MockDataService: Deleted story with id', id);
    return of(void 0).pipe(delay(300));
  }
}

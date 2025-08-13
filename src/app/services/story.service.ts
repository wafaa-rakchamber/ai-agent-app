import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story, StoryFormData } from '../models/story.interface';
import { Project } from './api-test.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = environment.apiUrl;

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('User is not authenticated. Please log in first.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Get all stories
   */
  getStories(): Observable<Story[]> {
    const currentUser = this.authService.getCurrentUser();
    console.log('Making GET request to:', `${this.baseUrl}/api/stories`, 'for user:', currentUser?.email);
    return this.http.get<Story[]>(`${this.baseUrl}/api/stories`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Get story by ID
   */
  getStoryById(id: number): Observable<Story> {
    const currentUser = this.authService.getCurrentUser();
    console.log('Making GET request to:', `${this.baseUrl}/api/stories/${id}`, 'for user:', currentUser?.email);
    return this.http.get<Story>(`${this.baseUrl}/api/stories/${id}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Create a new story
   */
  createStory(story: StoryFormData): Observable<Story> {
    const currentUser = this.authService.getCurrentUser();
    console.log('Making POST request to:', `${this.baseUrl}/api/stories`, 'for user:', currentUser?.email, 'with data:', story);
    return this.http.post<Story>(`${this.baseUrl}/api/stories`, story, {
      headers: this.getHeaders()
    });
  }

  /**
   * Update an existing story
   */
  updateStory(id: number, story: Partial<StoryFormData>): Observable<Story> {
    const currentUser = this.authService.getCurrentUser();
    console.log('Making PUT request to:', `${this.baseUrl}/api/stories/${id}`, 'for user:', currentUser?.email, 'with data:', story);
    return this.http.put<Story>(`${this.baseUrl}/api/stories/${id}`, story, {
      headers: this.getHeaders()
    });
  }

  /**
   * Delete a story
   */
  deleteStory(id: number): Observable<void> {
    const currentUser = this.authService.getCurrentUser();
    console.log('Making DELETE request to:', `${this.baseUrl}/api/stories/${id}`, 'for user:', currentUser?.email);
    return this.http.delete<void>(`${this.baseUrl}/api/stories/${id}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Get all projects for dropdown
   */
  getProjects(): Observable<Project[]> {
    const currentUser = this.authService.getCurrentUser();
    console.log('Making GET request to:', `${this.baseUrl}/api/projects`, 'for user:', currentUser?.email);
    return this.http.get<Project[]>(`${this.baseUrl}/api/projects`, {
      headers: this.getHeaders()
    });
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  deadLine: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  Stories?: Story[];
}

export interface Story {
  id: number;
  title: string;
  description: string;
  iteration: string;
  status: 'New' | 'inProgress' | 'Closed' | 'Canceled';
  StoryPoint: number;
  projectId: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiTestService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Test authenticated endpoint - Get user profile
   */
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}${environment.apiEndpoints.auth}/profile`);
  }

  /**
   * Test authenticated endpoint - Get projects
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}${environment.apiEndpoints.projects}`);
  }

  /**
   * Test health check endpoint (should work without auth)
   */
  healthCheck(): Observable<any> {
    return this.http.get(`${this.baseUrl}${environment.apiEndpoints.health}`);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiTestService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  /**
   * Test authenticated endpoint - Get user profile
   */
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/auth/profile`);
  }

  /**
   * Test authenticated endpoint - Get projects
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/api/projects`);
  }

  /**
   * Test health check endpoint (should work without auth)
   */
  healthCheck(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }
}

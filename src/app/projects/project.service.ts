import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ApiResponse } from './project.interface';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  // Use direct URL to bypass CORS issues - your backend should handle CORS
  private readonly apiUrl = 'http://localhost:3000/api/projects';

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

  getProjects(): Observable<ApiResponse<Project[]> | Project[]> {
    const currentUser = this.authService.getCurrentUser();
    console.log('Making GET request to:', this.apiUrl, 'for user:', currentUser?.email);
    return this.http.get<ApiResponse<Project[]> | Project[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  createProject(project: Omit<Project, 'id'>): Observable<ApiResponse<Project> | Project> {
    const currentUser = this.authService.getCurrentUser();
    console.log('Making POST request to:', this.apiUrl, 'for user:', currentUser?.email, 'with data:', project);
    return this.http.post<ApiResponse<Project> | Project>(this.apiUrl, project, {
      headers: this.getHeaders()
    });
  }

  updateProject(id: number, project: Partial<Project>): Observable<ApiResponse<Project> | Project> {
    const currentUser = this.authService.getCurrentUser();
    console.log('Making PUT request to:', `${this.apiUrl}/${id}`, 'for user:', currentUser?.email, 'with data:', project);
    return this.http.put<ApiResponse<Project> | Project>(`${this.apiUrl}/${id}`, project, {
      headers: this.getHeaders()
    });
  }

  deleteProject(id: number): Observable<ApiResponse<any> | any> {
    const currentUser = this.authService.getCurrentUser();
    console.log('Making DELETE request to:', `${this.apiUrl}/${id}`, 'for user:', currentUser?.email);
    return this.http.delete<ApiResponse<any> | any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}

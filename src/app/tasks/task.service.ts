import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Task, Story, User, ApiResponse, TaskStats } from './task.interface';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly apiUrl = environment.apiUrl;
  private readonly endpoints = environment.apiEndpoints;
  
  // Signals for reactive state management
  tasks = signal<Task[]>([]);
  stories = signal<Story[]>([]);
  users = signal<User[]>([]);
  selectedTask = signal<Task | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // Task CRUD Operations
  getAllTasks(): Observable<Task[]> {
    // debugger;
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<Task[]>(
      `${this.apiUrl}${this.endpoints.tasks}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        this.loading.set(false);
        if (response) {
          this.tasks.set(response);
          this.tasksSubject.next(response);
        } else {
          //this.error.set(response.message || 'Failed to load tasks');
        }
      })
    );
  }

  getTaskById(id: number): Observable<ApiResponse<Task>> {
    return this.http.get<ApiResponse<Task>>(
      `${this.apiUrl}${this.endpoints.tasks}/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.selectedTask.set(response.data);
        }
      })
    );
  }

  createTask(task: Omit<Task, 'id'>): Observable<ApiResponse<Task>> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<ApiResponse<Task>>(
      `${this.apiUrl}${this.endpoints.tasks}`,
      task,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        this.loading.set(false);
        if (response.success && response.data) {
          const currentTasks = this.tasks();
          this.tasks.set([...currentTasks, response.data]);
          this.tasksSubject.next([...currentTasks, response.data]);
        } else {
          this.error.set(response.message || 'Failed to create task');
        }
      })
    );
  }

  updateTask(id: number, task: Partial<Task>): Observable<ApiResponse<Task>> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<ApiResponse<Task>>(
      `${this.apiUrl}${this.endpoints.tasks}/${id}`,
      task,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        this.loading.set(false);
        if (response.success && response.data) {
          const currentTasks = this.tasks();
          const updatedTasks = currentTasks.map(t => t.id === id ? response.data : t);
          this.tasks.set(updatedTasks);
          this.tasksSubject.next(updatedTasks);
        } else {
          this.error.set(response.message || 'Failed to update task');
        }
      })
    );
  }

  deleteTask(id: number): Observable<ApiResponse<null>> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}${this.endpoints.tasks}/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        this.loading.set(false);
        if (response.success) {
          const currentTasks = this.tasks();
          const filteredTasks = currentTasks.filter(t => t.id !== id);
          this.tasks.set(filteredTasks);
          this.tasksSubject.next(filteredTasks);
        } else {
          this.error.set(response.message || 'Failed to delete task');
        }
      })
    );
  }

  // Story Operations
  getAllStories(): Observable<ApiResponse<Story[]>> {
    return this.http.get<ApiResponse<Story[]>>(
      `${this.apiUrl}${this.endpoints.stories}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.stories.set(response.data);
        }
      })
    );
  }

  // User Operations
  getAllUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(
      `${this.apiUrl}${this.endpoints.users}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.users.set(response.data);
        }
      })
    );
  }

  // Task Statistics
  getTaskStats(): TaskStats {
    const taskList = this.tasks();
    return {
      total: taskList.length,
      new: taskList.filter(t => t.status === 'New').length,
      inProgress: taskList.filter(t => t.status === 'In Progress').length,
      completed: taskList.filter(t => t.status === 'Completed').length,
      blocked: taskList.filter(t => t.status === 'Blocked').length,
      totalEstimationHours: taskList.reduce((sum, t) => sum + (t.estimationHours || 0), 0),
      totalWorkingHours: taskList.reduce((sum, t) => sum + (t.workingHours || 0), 0)
    };
  }

  // Filter and Search Methods
  getTasksByStatus(status: Task['status']): Task[] {
    return this.tasks().filter(task => task.status === status);
  }

  getTasksByStory(storyId: number): Task[] {
    return this.tasks().filter(task => task.storyId === storyId);
  }

  getTasksByAssignee(userId: number): Task[] {
    return this.tasks().filter(task => task.assignedTo === userId);
  }

  searchTasks(searchTerm: string): Task[] {
    const term = searchTerm.toLowerCase();
    return this.tasks().filter(task => 
      task.title.toLowerCase().includes(term) ||
      (task.description && task.description.toLowerCase().includes(term))
    );
  }

  // Utility Methods
  clearError(): void {
    this.error.set(null);
  }

  resetSelectedTask(): void {
    this.selectedTask.set(null);
  }
}

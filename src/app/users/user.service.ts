import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/users'; // Back to direct API
  private readonly authToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJtLm11cmhhZkByYWtjaGFtYmVyLmFlIiwibmFtZSI6Ik1vaGFtbWVkIE1vcmhhZiIsImlhdCI6MTc1NTA2MDcyOSwiZXhwIjoxNzU1MTQ3MTI5fQ.lzA8TJ4tfEGnABaKTnSu0mmfe6fbHVO8GyETCSCeqhg';

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Backend error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check if the backend is running and CORS is configured.';
      } else {
        errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('API Error:', error);
    console.error('Error Message:', errorMessage);
    return throwError(() => errorMessage);
  }

  getAllUsers(): Observable<User[]> {
    console.log('Fetching users from:', this.baseUrl);
    console.log('Using headers:', this.getHeaders());
    
    return this.http.get<User[]>(this.baseUrl, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Detailed error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error url:', error.url);
        return this.handleError(error);
      })
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  createUser(user: User): Observable<User> {
    const registerUrl = 'http://localhost:3000/api/auth/register';
    console.log('Creating user at:', registerUrl);
    console.log('Request payload:', { 
      name: user.name, 
      email: user.email, 
      password: user.password 
    });
    
    // For registration, we need name, email, and password
    const registerData = {
      name: user.name,
      email: user.email,
      password: user.password || 'defaultPassword123' // Fallback if password not provided
    };
    
    return this.http.post<RegisterResponse>(registerUrl, registerData, {
      headers: this.getHeaders()
    }).pipe(
      map((response: RegisterResponse) => {
        console.log('Registration response:', response);
        return response.user; // Extract the user object from the response
      }),
      catchError(this.handleError.bind(this))
    );
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    console.log('=== UPDATE USER DEBUG ===');
    console.log('User ID:', id);
    console.log('User data:', user);
    console.log('Update URL:', `${this.baseUrl}/${id}`);
    console.log('Headers:', this.getHeaders());
    console.log('Full request body:', JSON.stringify(user));
    
    // Ensure we only send name and email for updates
    const updateData = {
      name: user.name,
      email: user.email
    };
    
    console.log('Cleaned update data:', updateData);
    
    return this.http.put<User>(`${this.baseUrl}/${id}`, updateData, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => {
        console.error('=== UPDATE ERROR DETAILS ===');
        console.error('Error object:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error url:', error.url);
        console.error('Error response:', error.error);
        return this.handleError(error);
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }
}

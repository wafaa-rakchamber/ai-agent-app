import { Routes } from '@angular/router';
import { Hello } from './hello/hello';
import { TodoAppComponent } from './todo/todo-app.component';
import { LoginComponent } from './auth/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { ProjectsComponent } from './projects/projects.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'hello', component: Hello, canActivate: [AuthGuard] },
  { path: 'todo', component: TodoAppComponent, canActivate: [AuthGuard] },
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

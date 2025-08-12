import { Routes } from '@angular/router';
import { Hello } from './hello/hello';
import { TodoAppComponent } from './todo/todo-app.component';

export const routes: Routes = [
  { path: '', redirectTo: '/hello', pathMatch: 'full' },
  { path: 'hello', component: Hello },
  { path: 'todo', component: TodoAppComponent },
  { path: '**', redirectTo: '/hello' }
];

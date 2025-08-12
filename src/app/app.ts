import { Component, signal } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoAppComponent } from './todo/todo-app.component';
import { TodoListComponent } from './todo/todo-list.component';
import { TodoItemComponent } from './todo/todo-item.component';
import { AddTodoComponent } from './todo/add-todo.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TodoAppComponent, TodoListComponent, TodoItemComponent, AddTodoComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App {
  protected readonly title = signal('ai-agent-app');
}

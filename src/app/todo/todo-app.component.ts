import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTodoComponent } from './add-todo.component';
import { TodoListComponent } from './todo-list.component';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [CommonModule, AddTodoComponent, TodoListComponent],
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss']
})
export class TodoAppComponent {
  todos = [
    { id: 1, text: 'Learn Angular', completed: false },
    { id: 2, text: 'Build a todo app', completed: false }
  ];

  addTodo(text: string) {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false
    };
    this.todos = [...this.todos, newTodo];
  }

  toggleTodo(id: number) {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }

  deleteTodo(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
}

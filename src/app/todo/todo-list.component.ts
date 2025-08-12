import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from './todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {
  @Input() todos: any[] = [];
  @Input() onToggle?: (id: number) => void;
  @Input() onDelete?: (id: number) => void;
}

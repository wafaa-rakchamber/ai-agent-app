import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-todo',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent {
  newTodo: string = '';
  @Output() add = new EventEmitter<string>();

  addTodo() {
    if (this.newTodo.trim()) {
      this.add.emit(this.newTodo);
      this.newTodo = '';
    }
  }
}

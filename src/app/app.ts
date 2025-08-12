import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoAppComponent } from './todo/todo-app.component';
import { WafaaProject } from './wafaa-project/wafaa-project';

import { CounterComponent } from './counter/counter.component';

import { AamnaProject } from './aamna-project/aamna-project';

import { Counter1 } from './counter1/counter1';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TodoAppComponent, WafaaProject, Counter1,AamnaProject, CounterComponent],

  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ai-agent-app');
}

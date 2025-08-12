import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter1',
  imports: [],
  templateUrl: './counter1.html',
  styleUrl: './counter1.scss'
})
export class Counter1 {
  initialValue = 0;
  step = 1;
  count = signal(this.initialValue);
  history = signal<number[]>([this.initialValue]);

  increment = () => {
    this.count.update(c => c + this.step);
    this.history.update(h => [...h, this.count()]);
  };

  decrement = () => {
    this.count.update(c => c - this.step);
    this.history.update(h => [...h, this.count()]);
  };

  reset = () => {
    this.count.set(this.initialValue);
    this.history.update(h => [...h, this.count()]);
  };

  readonly historyString = computed(() => this.history().join(', '));
}

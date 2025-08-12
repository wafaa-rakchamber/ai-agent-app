import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  // Standalone by default in this repo; do not set `standalone: true`.
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent {
  // Inputs with defaults, using the input() function per project conventions
  readonly initialValue = input<number>(0);
  readonly step = input<number>(1);

  // Local state via signals
  readonly count = signal<number>(this.initialValue());
  readonly history = signal<number[]>([]);

  // Track count changes and append to history (including initial value)
  private readonly track = effect(() => {
    const c = this.count();
    this.history.update(prev => [...prev, c]);
  });

  increment() {
    const s = this.step();
    this.count.update(prev => prev + s);
  }

  decrement() {
    const s = this.step();
    this.count.update(prev => prev - s);
  }

  reset() {
    this.count.set(this.initialValue());
  }
}

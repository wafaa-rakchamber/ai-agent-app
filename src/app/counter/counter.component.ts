import { ChangeDetectionStrategy, Component, effect, input, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  // Standalone by default in this repo; do not set `standalone: true`.
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'counter-host'
  },
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent {
  // Inputs with defaults, using the input() function per project conventions
  readonly initialValue = input<number>(0);
  readonly step = input<number>(1);
  // Optional behavior: when true, reset will set count to 0 instead of initialValue
  readonly resetToZero = input<boolean>(false);

  // Local state via signals
  readonly count = signal<number>(this.initialValue());
  readonly history = signal<number[]>([]);
  // Derived state for styling the count
  readonly isPositive = computed(() => this.count() > 0);
  readonly isNegative = computed(() => this.count() < 0);
  readonly isNeutral = computed(() => this.count() === 0);

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
    // Clear history first so the effect records a single fresh entry
    this.history.set([]);
    this.count.set(this.initialValue());
  }
}

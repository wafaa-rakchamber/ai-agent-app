import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-aamna-project',
  templateUrl: './aamna-project.component.html',
  styleUrls: ['./aamna-project.component.scss']
})
export class AamnaProjectComponent {
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

  get countValue() {
    return this.count();
  }

  get historyValue() {
    return this.history();
  }
}

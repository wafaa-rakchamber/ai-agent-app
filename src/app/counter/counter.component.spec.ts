import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  let fixture: ComponentFixture<CounterComponent>;
  let component: CounterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;

    // Set inputs
    fixture.componentRef.setInput('initialValue', 0);
    fixture.componentRef.setInput('step', 2);

    fixture.detectChanges();
  });

  it('should reset count to initial value and clear history', () => {
    const host: HTMLElement = fixture.nativeElement as HTMLElement;

    // Increment twice -> count should become 9 (starting from 0 + inputs applied; but we rely only on reset behavior)
    host.querySelector('button.increment')!.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    host.querySelector('button.increment')!.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // Now reset
    host.querySelector('button.reset')!.dispatchEvent(new Event('click'));
    fixture.detectChanges();

  // Count text should show 0
    const countText = host.querySelector('.count')!.textContent || '';
    expect(countText).toContain('0');

    // History should be only the fresh entry equal to 0
    expect(component.history()).toEqual([0]);
  });

  it('should reset to zero when resetToZero is true', () => {
    const host: HTMLElement = fixture.nativeElement as HTMLElement;

    // Change inputs to demonstrate behavior: initialValue 10, step 3, resetToZero true
    fixture.componentRef.setInput('initialValue', 10);
    fixture.componentRef.setInput('step', 3);
    fixture.componentRef.setInput('resetToZero', true);
    fixture.detectChanges();

    // Increment once -> history gets updated
    host.querySelector('button.increment')!.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // Reset should go to 0 because resetToZero is true
    host.querySelector('button.reset')!.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const countText = host.querySelector('.count')!.textContent || '';
    expect(countText).toContain('0');
    expect(component.history()).toEqual([0]);
  });
});

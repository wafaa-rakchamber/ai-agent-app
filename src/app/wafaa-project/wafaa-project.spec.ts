import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WafaaProject } from './wafaa-project';

describe('WafaaProject', () => {
  let component: WafaaProject;
  let fixture: ComponentFixture<WafaaProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WafaaProject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WafaaProject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

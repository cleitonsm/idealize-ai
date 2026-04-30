import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageTimelineComponent } from './stage-timeline.component';

describe('StageTimelineComponent', () => {
  let fixture: ComponentFixture<StageTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StageTimelineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StageTimelineComponent);
    fixture.componentRef.setInput('currentStage', 'requirements');
    fixture.detectChanges();
  });

  it('renders every MVP stage with current, completed and pending states', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(fixture.nativeElement.querySelectorAll('[role="listitem"]').length).toBe(8);
    expect(text).toContain('Ideia inicial');
    expect(text).toContain('Requisitos');
    expect(text).toContain('Business case');
    expect(text).toContain('Concluída');
    expect(text).toContain('Etapa atual');
    expect(text).toContain('Pendente');
  });
});

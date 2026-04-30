import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramsPage } from './diagrams.page';

describe('DiagramsPage integration', () => {
  let fixture: ComponentFixture<DiagramsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagramsPage);
    fixture.detectChanges();
  });

  it('shows Mermaid actions and source mode for the demo diagram', () => {
    const host = fixture.nativeElement as HTMLElement;
    const sourceButton = Array.from(host.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Fonte'),
    ) as HTMLButtonElement;

    sourceButton.click();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    const textarea = host.querySelector('textarea') as HTMLTextAreaElement;
    expect(text).toContain('Diagramas Mermaid');
    expect(textarea.value).toContain('flowchart LR');
    expect(textarea.value).toContain('API FastAPI');
  });
});

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../core/config/environment';
import { DiagramsPage } from './diagrams.page';

describe('DiagramsPage integration', () => {
  let fixture: ComponentFixture<DiagramsPage>;
  let http: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/projects`;
  const project = {
    id: 'p1',
    name: 'Clinica Conecta',
    currentStage: 'modeling' as const,
    createdAt: '2026-04-01T12:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagramsPage);
    http = TestBed.inject(HttpTestingController);
    http.expectOne(baseUrl).flush([project]);
    http.expectOne(`${baseUrl}/p1`).flush(project);
    http.expectOne(`${baseUrl}/p1/artifacts`).flush([]);
    http.expectOne(`${baseUrl}/p1/history`).flush([]);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
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

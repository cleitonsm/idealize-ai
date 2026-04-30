import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContextService } from '../../core/services/project-context.service';
import { environment } from '../../core/config/environment';
import { ArtifactsPage } from './artifacts.page';

describe('ArtifactsPage integration', () => {
  let fixture: ComponentFixture<ArtifactsPage>;
  let service: ProjectContextService;
  let http: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/projects`;
  const project = {
    id: 'p1',
    name: 'Clinica Conecta',
    currentStage: 'initial_idea' as const,
    createdAt: '2026-04-01T12:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  };
  const artifacts = [
    {
      id: 'a1',
      projectId: 'p1',
      type: 'problem_solution' as const,
      title: 'Problema e solução',
      content: 'Conteúdo',
      stage: 'initial_idea' as const,
      status: 'generated' as const,
      createdAt: '2026-04-01T12:01:00.000Z',
      updatedAt: '2026-04-01T12:01:00.000Z',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtifactsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtifactsPage);
    service = TestBed.inject(ProjectContextService);
    http = TestBed.inject(HttpTestingController);
    flushInitialLoad();
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
  });

  it('renders artifact cards for the active project', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Artefatos do projeto');
    expect(text).toContain('Problema e solução');
  });

  it('renders an empty state when there is no active project', () => {
    service.selectProject('missing');
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Nenhum projeto ativo');
  });

  function flushInitialLoad(): void {
    http.expectOne(baseUrl).flush([project]);
    http.expectOne(`${baseUrl}/p1`).flush(project);
    http.expectOne(`${baseUrl}/p1/artifacts`).flush(artifacts);
    http.expectOne(`${baseUrl}/p1/history`).flush([]);
  }
});

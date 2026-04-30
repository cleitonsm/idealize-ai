import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContextService } from '../../core/services/project-context.service';
import { environment } from '../../core/config/environment';
import { ProjectsPage } from './projects.page';

describe('ProjectsPage integration', () => {
  let fixture: ComponentFixture<ProjectsPage>;
  let service: ProjectContextService;
  let http: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/projects`;
  const project = {
    id: 'p1',
    name: 'Clinica Conecta',
    description: 'Demo MVP',
    currentStage: 'initial_idea' as const,
    createdAt: '2026-04-01T12:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  };
  const artifact = {
    id: 'a1',
    projectId: 'p1',
    type: 'problem_solution' as const,
    title: 'Problema e solução',
    content: 'Conteúdo',
    stage: 'initial_idea' as const,
    status: 'generated' as const,
    createdAt: '2026-04-01T12:01:00.000Z',
    updatedAt: '2026-04-01T12:01:00.000Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsPage);
    service = TestBed.inject(ProjectContextService);
    http = TestBed.inject(HttpTestingController);
    flushInitialLoad();
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
  });

  it('lists API projects and artifacts for the active project', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Clinica Conecta');
    expect(text).toContain('Problema e solução');
  });

  it('creates a project from the form and makes it active', () => {
    const host = fixture.nativeElement as HTMLElement;
    const nameInput = host.querySelector('input') as HTMLInputElement;
    const description = host.querySelector('textarea') as HTMLTextAreaElement;

    nameInput.value = 'Clinica Conecta';
    nameInput.dispatchEvent(new Event('input'));
    description.value = 'Demo MVP';
    description.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const createButton = Array.from(host.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Criar projeto'),
    ) as HTMLButtonElement;
    createButton.click();
    const created = { ...project, id: 'p2', name: 'Clinica Conecta', description: 'Demo MVP' };
    http.expectOne(baseUrl).flush(created);
    fixture.detectChanges();

    expect(service.activeProject()?.name).toBe('Clinica Conecta');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Clinica Conecta');
  });

  function flushInitialLoad(): void {
    http.expectOne(baseUrl).flush([project]);
    http.expectOne(`${baseUrl}/p1`).flush(project);
    http.expectOne(`${baseUrl}/p1/artifacts`).flush([artifact]);
    http.expectOne(`${baseUrl}/p1/history`).flush([]);
  }
});

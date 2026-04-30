import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import type { Artifact, Message, Project } from '@idealize-ai/contracts';

import { environment } from '../config/environment';
import { ProjectContextService } from './project-context.service';

describe('ProjectContextService', () => {
  let service: ProjectContextService;
  let http: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/projects`;

  const projects: Project[] = [
    {
      id: 'p1',
      name: 'Clinica Conecta',
      description: 'Demo MVP',
      currentStage: 'initial_idea',
      createdAt: '2026-04-01T12:00:00.000Z',
      updatedAt: '2026-04-01T12:00:00.000Z',
    },
  ];
  const artifacts: Artifact[] = [
    {
      id: 'a1',
      projectId: 'p1',
      type: 'problem_solution',
      title: 'Problema e solução',
      content: 'Conteúdo',
      stage: 'initial_idea',
      status: 'generated',
      createdAt: '2026-04-01T12:01:00.000Z',
      updatedAt: '2026-04-01T12:01:00.000Z',
    },
  ];
  const history: Message[] = [
    {
      id: 'm1',
      projectId: 'p1',
      role: 'user',
      content: 'Ideia inicial',
      stage: 'initial_idea',
      createdAt: '2026-04-01T12:02:00.000Z',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProjectContextService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('loads projects and details from the API', () => {
    flushInitialLoad();

    expect(service.projects()).toEqual(projects);
    expect(service.activeProject()?.id).toBe('p1');
    expect(service.artifactsForActiveProject()).toEqual(artifacts);
    expect(service.history()).toEqual(history);
  });

  it('creates and selects a new project from trimmed input', () => {
    flushInitialLoad([]);
    const created = {
      ...projects[0],
      id: 'p2',
      name: 'Clinica Conecta',
      description: 'Demo MVP',
    };

    service.createProject('  Clinica Conecta  ', '  Demo MVP  ');
    const req = http.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Clinica Conecta', description: 'Demo MVP' });
    req.flush(created);

    expect(service.activeProjectId()).toBe('p2');
    expect(service.activeProject()).toEqual(created);
  });

  it('clears the active project when selecting an unknown id', () => {
    flushInitialLoad();
    service.selectProject('missing');

    expect(service.activeProjectId()).toBeNull();
    expect(service.activeProject()).toBeNull();
    expect(service.artifactsForActiveProject()).toEqual([]);
  });

  it('updates the active project stage and accepts new artifacts', () => {
    flushInitialLoad();
    service.setStageForActiveProject('requirements');
    const req = http.expectOne(`${baseUrl}/p1/advance`);
    expect(req.request.method).toBe('POST');
    req.flush({ ...projects[0], currentStage: 'requirements' });
    expect(service.activeProject()?.currentStage).toBe('requirements');

    const artifact: Artifact = {
      id: 'demo-artifact',
      projectId: 'p1',
      type: 'user_story',
      title: 'Historia de usuario',
      content: 'Como paciente, quero confirmar consulta.',
      stage: 'requirements',
      status: 'generated',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    service.addArtifact(artifact);

    expect(service.artifactsForActiveProject().some((a) => a.id === 'demo-artifact')).toBeTrue();
  });

  function flushInitialLoad(initialProjects = projects): void {
    http.expectOne(baseUrl).flush(initialProjects);
    if (initialProjects.length === 0) {
      return;
    }
    http.expectOne(`${baseUrl}/${initialProjects[0].id}`).flush(initialProjects[0]);
    http.expectOne(`${baseUrl}/${initialProjects[0].id}/artifacts`).flush(artifacts);
    http.expectOne(`${baseUrl}/${initialProjects[0].id}/history`).flush(history);
  }
});

import { TestBed } from '@angular/core/testing';

import { ProjectContextService } from './project-context.service';

describe('ProjectContextService', () => {
  let service: ProjectContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectContextService);
  });

  it('starts with demo projects and artifacts for the active project', () => {
    expect(service.projects().length).toBeGreaterThanOrEqual(2);
    expect(service.activeProject()?.id).toBe('demo-retail');
    expect(service.artifactsForActiveProject().every((a) => a.projectId === 'demo-retail')).toBeTrue();
  });

  it('creates and selects a new project from trimmed input', () => {
    const project = service.createProject('  Clinica Conecta  ', '  Demo MVP  ');

    expect(project.name).toBe('Clinica Conecta');
    expect(project.description).toBe('Demo MVP');
    expect(project.currentStage).toBe('initial_idea');
    expect(service.activeProjectId()).toBe(project.id);
    expect(service.activeProject()).toEqual(project);
  });

  it('clears the active project when selecting an unknown id', () => {
    service.selectProject('missing');

    expect(service.activeProjectId()).toBeNull();
    expect(service.activeProject()).toBeNull();
    expect(service.artifactsForActiveProject()).toEqual([]);
  });

  it('updates the active project stage and accepts new artifacts', () => {
    service.setStageForActiveProject('requirements');
    expect(service.activeProject()?.currentStage).toBe('requirements');

    service.addArtifact({
      id: 'demo-artifact',
      projectId: 'demo-retail',
      type: 'user_story',
      title: 'Historia de usuario',
      content: 'Como paciente, quero confirmar consulta.',
      stage: 'requirements',
      status: 'generated',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    expect(service.artifactsForActiveProject().some((a) => a.id === 'demo-artifact')).toBeTrue();
  });
});

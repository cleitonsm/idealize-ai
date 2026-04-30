import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContextService } from '../../core/services/project-context.service';
import { ProjectsPage } from './projects.page';

describe('ProjectsPage integration', () => {
  let fixture: ComponentFixture<ProjectsPage>;
  let service: ProjectContextService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsPage);
    service = TestBed.inject(ProjectContextService);
    fixture.detectChanges();
  });

  it('lists demo projects and artifacts for the active project', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Programa de fidelidade B2C');
    expect(text).toContain('Portal interno de demandas');
    expect(text).toContain('Problema e solução (rascunho)');
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
    fixture.detectChanges();

    expect(service.activeProject()?.name).toBe('Clinica Conecta');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Clinica Conecta');
  });
});

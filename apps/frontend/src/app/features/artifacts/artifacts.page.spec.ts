import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContextService } from '../../core/services/project-context.service';
import { ArtifactsPage } from './artifacts.page';

describe('ArtifactsPage integration', () => {
  let fixture: ComponentFixture<ArtifactsPage>;
  let service: ProjectContextService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtifactsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtifactsPage);
    service = TestBed.inject(ProjectContextService);
    fixture.detectChanges();
  });

  it('renders artifact cards for the active project', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Artefatos do projeto');
    expect(text).toContain('Problema e solução (rascunho)');
    expect(text).toContain('Proposta de valor');
  });

  it('renders an empty state when there is no active project', () => {
    service.selectProject('missing');
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Nenhum projeto ativo');
  });
});

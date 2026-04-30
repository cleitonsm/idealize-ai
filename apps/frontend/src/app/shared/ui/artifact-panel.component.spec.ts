import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { Artifact } from '@idealize-ai/contracts';

import { ArtifactPanelComponent } from './artifact-panel.component';

describe('ArtifactPanelComponent', () => {
  let fixture: ComponentFixture<ArtifactPanelComponent>;

  const artifact: Artifact = {
    id: 'a1',
    projectId: 'p1',
    type: 'problem_solution',
    title: 'Problema e solucao',
    content: 'Clientes faltam por esquecimento.',
    stage: 'interview',
    status: 'generated',
    sourceContext: 'Entrevista com recepcao.',
    createdAt: '2026-04-01T12:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtifactPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtifactPanelComponent);
    fixture.componentRef.setInput('artifact', artifact);
    fixture.detectChanges();
  });

  it('renders title, type, stage, status and source context', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Problema e solucao');
    expect(text).toContain('Problema / solução');
    expect(text).toContain('Entrevista');
    expect(text).toContain('Gerado');
    expect(text).toContain('Entrevista com recepcao.');
  });
});

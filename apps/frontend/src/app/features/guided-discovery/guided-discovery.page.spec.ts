import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContextService } from '../../core/services/project-context.service';
import { GuidedDiscoveryPage } from './guided-discovery.page';

describe('GuidedDiscoveryPage integration', () => {
  let fixture: ComponentFixture<GuidedDiscoveryPage>;
  let service: ProjectContextService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidedDiscoveryPage],
    }).compileComponents();

    fixture = TestBed.createComponent(GuidedDiscoveryPage);
    service = TestBed.inject(ProjectContextService);
    fixture.detectChanges();
  });

  it('renders the active project timeline and simulated conversation', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Progresso');
    expect(text).toContain('Etapa atual');
    expect(text).toContain('Vamos clarificar a ideia');
  });

  it('adds simulated chat messages and updates the project stage', () => {
    const host = fixture.nativeElement as HTMLElement;
    const composer = Array.from(host.querySelectorAll('textarea')).at(1) as HTMLTextAreaElement;

    composer.value = 'Pacientes faltam por esquecimento.';
    composer.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const sendButton = Array.from(host.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Enviar'),
    ) as HTMLButtonElement;
    sendButton.click();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Pacientes faltam por esquecimento.',
    );

    const requirementsButton = Array.from(host.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Requisitos'),
    ) as HTMLButtonElement;
    requirementsButton.click();
    fixture.detectChanges();

    expect(service.activeProject()?.currentStage).toBe('requirements');
  });
});

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContextService } from '../../core/services/project-context.service';
import { environment } from '../../core/config/environment';
import { GuidedDiscoveryPage } from './guided-discovery.page';

describe('GuidedDiscoveryPage integration', () => {
  let fixture: ComponentFixture<GuidedDiscoveryPage>;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidedDiscoveryPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(GuidedDiscoveryPage);
    service = TestBed.inject(ProjectContextService);
    http = TestBed.inject(HttpTestingController);
    flushInitialLoad();
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
  });

  it('renders the active project timeline and real history area', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Progresso');
    expect(text).toContain('Etapa atual');
    expect(text).toContain('Sem mensagens ainda');
  });

  it('adds chat messages and updates the project stage through the API', () => {
    const host = fixture.nativeElement as HTMLElement;
    const composer = Array.from(host.querySelectorAll('textarea')).at(1) as HTMLTextAreaElement;

    composer.value = 'Pacientes faltam por esquecimento.';
    composer.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const sendButton = Array.from(host.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Enviar'),
    ) as HTMLButtonElement;
    sendButton.click();
    http.expectOne(`${baseUrl}/p1/idea`).flush({
      project,
      message: {
        id: 'm1',
        projectId: 'p1',
        role: 'user',
        content: 'Pacientes faltam por esquecimento.',
        stage: 'initial_idea',
        createdAt: '2026-04-01T12:02:00.000Z',
      },
    });
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Pacientes faltam por esquecimento.',
    );

    const advanceButton = Array.from(host.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Avançar para Entrevista'),
    ) as HTMLButtonElement;
    advanceButton.click();
    http.expectOne(`${baseUrl}/p1/advance`).flush({ ...project, currentStage: 'interview' });
    fixture.detectChanges();

    expect(service.activeProject()?.currentStage).toBe('interview');
  });

  function flushInitialLoad(): void {
    http.expectOne(baseUrl).flush([project]);
    http.expectOne(`${baseUrl}/p1`).flush(project);
    http.expectOne(`${baseUrl}/p1/artifacts`).flush([]);
    http.expectOne(`${baseUrl}/p1/history`).flush([]);
  }
});

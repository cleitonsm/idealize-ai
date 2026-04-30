import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../core/config/environment';
import { ReviewPage } from './review.page';

describe('ReviewPage', () => {
  let fixture: ComponentFixture<ReviewPage>;
  let http: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/projects`;
  const project = {
    id: 'p1',
    name: 'Clinica Conecta',
    currentStage: 'review' as const,
    createdAt: '2026-04-01T12:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewPage);
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

  it('renders the human review area', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Revisão');
    expect(text).toContain('Consolidação e revisão humana dos artefatos');
  });
});

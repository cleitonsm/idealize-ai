import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPage } from './review.page';

describe('ReviewPage', () => {
  let fixture: ComponentFixture<ReviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewPage);
    fixture.detectChanges();
  });

  it('renders the human review area', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Revisão');
    expect(text).toContain('Consolidação e revisão humana dos artefatos');
  });
});

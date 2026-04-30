import {
  artifactStatusClasses,
  artifactStatusLabel,
  artifactTypeLabel,
  stageIndex,
  stageLabel,
  STAGE_ORDER,
} from './stage-labels';

describe('stage labels', () => {
  it('keeps the MVP stage order aligned with the guided discovery flow', () => {
    expect(STAGE_ORDER).toEqual([
      'initial_idea',
      'interview',
      'brainstorming',
      'requirements',
      'business_case',
      'stack_modeling',
      'modeling',
      'review',
    ]);
    expect(stageIndex('requirements')).toBe(3);
  });

  it('provides user-facing labels for stages, statuses and artifact types', () => {
    expect(stageLabel('business_case')).toBe('Business case');
    expect(artifactStatusLabel('needs_input')).toBe('Precisa de insumo');
    expect(artifactTypeLabel('diagram_mermaid')).toBe('Diagrama');
  });

  it('maps every artifact status to Tailwind classes used by cards', () => {
    expect(artifactStatusClasses('draft')).toContain('bg-slate-100');
    expect(artifactStatusClasses('in_progress')).toContain('bg-amber-50');
    expect(artifactStatusClasses('generated')).toContain('bg-primary-50');
    expect(artifactStatusClasses('reviewed')).toContain('bg-emerald-50');
    expect(artifactStatusClasses('needs_input')).toContain('bg-rose-50');
  });
});

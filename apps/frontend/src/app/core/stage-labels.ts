import type { ArtifactStatus, ArtifactType, Stage } from '@idealize-ai/contracts';

/** Canonical order for discovery timeline UI. */
export const STAGE_ORDER: Stage[] = [
  'initial_idea',
  'interview',
  'brainstorming',
  'requirements',
  'business_case',
  'stack_modeling',
  'modeling',
  'review',
];

export function stageLabel(stage: Stage): string {
  const labels: Record<Stage, string> = {
    initial_idea: 'Ideia inicial',
    interview: 'Entrevista',
    brainstorming: 'Brainstorming',
    requirements: 'Requisitos',
    business_case: 'Business case',
    stack_modeling: 'Stack e arquitetura',
    modeling: 'Modelagem',
    review: 'Revisão',
  };
  return labels[stage];
}

export function artifactStatusLabel(status: ArtifactStatus): string {
  const labels: Record<ArtifactStatus, string> = {
    draft: 'Rascunho',
    in_progress: 'Em progresso',
    generated: 'Gerado',
    reviewed: 'Revisado',
    needs_input: 'Precisa de insumo',
  };
  return labels[status];
}

export function artifactStatusClasses(status: ArtifactStatus): string {
  const map: Record<ArtifactStatus, string> = {
    draft: 'bg-slate-100 text-slate-700 ring-slate-200',
    in_progress: 'bg-amber-50 text-amber-900 ring-amber-200',
    generated: 'bg-primary-50 text-primary-900 ring-primary-200',
    reviewed: 'bg-emerald-50 text-emerald-900 ring-emerald-200',
    needs_input: 'bg-rose-50 text-rose-900 ring-rose-200',
  };
  return map[status];
}

export function artifactTypeLabel(type: ArtifactType): string {
  const labels: Record<ArtifactType, string> = {
    problem_solution: 'Problema / solução',
    value_proposition: 'Proposta de valor',
    epic: 'Épico',
    user_story: 'História de usuário',
    acceptance_criteria: 'Critérios de aceite',
    market_analysis: 'Mercado',
    business_model: 'Modelo de negócio',
    diagram_mermaid: 'Diagrama',
    other: 'Outro',
  };
  return labels[type];
}

export function stageIndex(stage: Stage): number {
  return STAGE_ORDER.indexOf(stage);
}

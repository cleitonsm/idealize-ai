/** Project lifecycle stage in the guided discovery flow. */
export type Stage =
  | 'initial_idea'
  | 'interview'
  | 'brainstorming'
  | 'requirements'
  | 'business_case'
  | 'stack_modeling'
  | 'modeling'
  | 'review';

/** Message role in chat and interview flows. */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Coarse state for UI and API: draft, in progress, generated, reviewed, needs input.
 * @see plan design TailwindCSS guidelines
 */
export type ArtifactStatus =
  | 'draft'
  | 'in_progress'
  | 'generated'
  | 'reviewed'
  | 'needs_input';

export type ArtifactType =
  | 'problem_solution'
  | 'value_proposition'
  | 'epic'
  | 'user_story'
  | 'acceptance_criteria'
  | 'market_analysis'
  | 'business_model'
  | 'diagram_mermaid'
  | 'other';

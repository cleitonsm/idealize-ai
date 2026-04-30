import { computed, Injectable, signal } from '@angular/core';

import type { Artifact, Project, Stage } from '@idealize-ai/contracts';

function iso(d: Date): string {
  return d.toISOString();
}

@Injectable({ providedIn: 'root' })
export class ProjectContextService {
  private readonly seed = new Date('2026-04-01T12:00:00.000Z');

  readonly projects = signal<Project[]>([
    {
      id: 'demo-retail',
      name: 'Programa de fidelidade B2C',
      description: 'App para pontos, níveis e parcerias locais.',
      currentStage: 'interview',
      createdAt: iso(this.seed),
      updatedAt: iso(this.seed),
    },
    {
      id: 'demo-internal',
      name: 'Portal interno de demandas',
      description: 'Centralizar solicitações de áreas e priorização.',
      currentStage: 'initial_idea',
      createdAt: iso(new Date(this.seed.getTime() - 86400000)),
      updatedAt: iso(new Date(this.seed.getTime() - 86400000)),
    },
  ]);

  /** Sample artifacts for demo project — replaced by API later. */
  readonly artifacts = signal<Artifact[]>([
    {
      id: 'a1',
      projectId: 'demo-retail',
      type: 'problem_solution',
      title: 'Problema e solução (rascunho)',
      content:
        '**Problema:** Clientes não retêm motivação para compras recorrentes.\n\n**Solução:** Programa de pontos com metas semanais.',
      stage: 'initial_idea',
      status: 'draft',
      createdAt: iso(this.seed),
      updatedAt: iso(this.seed),
    },
    {
      id: 'a2',
      projectId: 'demo-retail',
      type: 'value_proposition',
      title: 'Proposta de valor',
      content: 'Recompensas imediatas e parcerias próximas ao cliente.',
      stage: 'brainstorming',
      status: 'generated',
      sourceContext: 'Sumário da sessão de brainstorming (mock).',
      createdAt: iso(this.seed),
      updatedAt: iso(this.seed),
    },
    {
      id: 'a3',
      projectId: 'demo-internal',
      type: 'user_story',
      title: 'Abrir solicitação',
      content: 'Como colaborador, quero registrar uma demanda para acompanhamento.',
      stage: 'requirements',
      status: 'needs_input',
      createdAt: iso(this.seed),
      updatedAt: iso(this.seed),
    },
  ]);

  readonly activeProjectId = signal<string | null>('demo-retail');

  readonly activeProject = computed(() => {
    const id = this.activeProjectId();
    if (!id) {
      return null;
    }
    return this.projects().find((p) => p.id === id) ?? null;
  });

  readonly artifactsForActiveProject = computed(() => {
    const id = this.activeProjectId();
    if (!id) {
      return [];
    }
    return this.artifacts().filter((a) => a.projectId === id);
  });

  selectProject(id: string): void {
    const exists = this.projects().some((p) => p.id === id);
    this.activeProjectId.set(exists ? id : null);
  }

  createProject(name: string, description?: string): Project {
    const now = iso(new Date());
    const project: Project = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `proj-${Date.now()}`,
      name: name.trim(),
      description: description?.trim() || undefined,
      currentStage: 'initial_idea',
      createdAt: now,
      updatedAt: now,
    };
    this.projects.update((list) => [...list, project]);
    this.activeProjectId.set(project.id);
    return project;
  }

  setStageForActiveProject(stage: Stage): void {
    const id = this.activeProjectId();
    if (!id) {
      return;
    }
    const now = iso(new Date());
    this.projects.update((list) =>
      list.map((p) =>
        p.id === id ? { ...p, currentStage: stage, updatedAt: now } : p,
      ),
    );
  }

  addArtifact(artifact: Artifact): void {
    this.artifacts.update((list) => [...list, artifact]);
  }
}

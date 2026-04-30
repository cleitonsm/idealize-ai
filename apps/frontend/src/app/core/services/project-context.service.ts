import { computed, Injectable, inject, signal } from '@angular/core';

import type { Artifact, ArtifactType, Message, Project, Stage } from '@idealize-ai/contracts';
import { forkJoin } from 'rxjs';

import { ProjectApiService } from './project-api.service';

@Injectable({ providedIn: 'root' })
export class ProjectContextService {
  private readonly api = inject(ProjectApiService);

  readonly projects = signal<Project[]>([]);
  readonly artifacts = signal<Artifact[]>([]);
  readonly history = signal<Message[]>([]);
  readonly activeProjectId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

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

  constructor() {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.listProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        const currentId = this.activeProjectId();
        const nextActive = currentId && projects.some((p) => p.id === currentId)
          ? currentId
          : projects[0]?.id ?? null;
        this.activeProjectId.set(nextActive);
        if (nextActive) {
          this.loadProjectDetails(nextActive);
        } else {
          this.artifacts.set([]);
          this.history.set([]);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Não foi possível carregar os projetos.');
      },
      complete: () => this.loading.set(false),
    });
  }

  selectProject(id: string): void {
    const exists = this.projects().some((p) => p.id === id);
    this.activeProjectId.set(exists ? id : null);
    if (exists) {
      this.loadProjectDetails(id);
    } else {
      this.artifacts.set([]);
      this.history.set([]);
    }
  }

  createProject(name: string, description?: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.createProject(name.trim(), description?.trim() || undefined).subscribe({
      next: (project) => {
        this.upsertProject(project);
        this.activeProjectId.set(project.id);
        this.artifacts.set([]);
        this.history.set([]);
      },
      error: () => {
        this.error.set('Não foi possível criar o projeto.');
      },
      complete: () => this.loading.set(false),
    });
  }

  setStageForActiveProject(stage: Stage): void {
    this.advanceActiveProject(stage);
  }

  advanceActiveProject(targetStage?: Stage): void {
    const id = this.activeProjectId();
    if (!id) {
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.api.advanceProject(id, targetStage).subscribe({
      next: (project) => this.upsertProject(project),
      error: () => {
        this.error.set('Não foi possível avançar a etapa do projeto.');
      },
      complete: () => this.loading.set(false),
    });
  }

  registerIdea(content: string): void {
    const id = this.activeProjectId();
    if (!id) {
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.api.registerIdea(id, content.trim()).subscribe({
      next: ({ project, message }) => {
        this.upsertProject(project);
        this.history.update((items) => [...items, message].sort(byCreatedAt));
      },
      error: () => {
        this.error.set('Não foi possível registrar a mensagem.');
      },
      complete: () => this.loading.set(false),
    });
  }

  generateArtifact(type: ArtifactType, title?: string): void {
    const id = this.activeProjectId();
    if (!id) {
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.api.generateArtifact(id, type, title?.trim() || undefined).subscribe({
      next: (artifact) => {
        this.addArtifact(artifact);
        this.loadProject(id);
      },
      error: () => {
        this.error.set('Não foi possível gerar o artefato.');
      },
      complete: () => this.loading.set(false),
    });
  }

  addArtifact(artifact: Artifact): void {
    this.artifacts.update((list) =>
      [...list.filter((item) => item.id !== artifact.id), artifact].sort(byCreatedAt),
    );
  }

  private loadProjectDetails(projectId: string): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      project: this.api.getProject(projectId),
      artifacts: this.api.listArtifacts(projectId),
      history: this.api.listHistory(projectId),
    }).subscribe({
      next: ({ project, artifacts, history }) => {
        this.upsertProject(project);
        this.artifacts.set(artifacts);
        this.history.set(history);
      },
      error: () => {
        this.error.set('Não foi possível carregar os dados do projeto.');
      },
      complete: () => this.loading.set(false),
    });
  }

  private loadProject(projectId: string): void {
    this.api.getProject(projectId).subscribe({
      next: (project) => this.upsertProject(project),
    });
  }

  private upsertProject(project: Project): void {
    this.projects.update((list) => {
      const withoutCurrent = list.filter((item) => item.id !== project.id);
      return [project, ...withoutCurrent].sort(byUpdatedAtDesc);
    });
  }
}

function byCreatedAt(a: { createdAt: string }, b: { createdAt: string }): number {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

function byUpdatedAtDesc(a: Project, b: Project): number {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

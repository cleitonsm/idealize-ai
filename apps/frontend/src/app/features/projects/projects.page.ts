import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import type { Project } from '@idealize-ai/contracts';

import { ProjectContextService } from '../../core/services/project-context.service';
import { stageLabel } from '../../core/stage-labels';
import { ArtifactPanelComponent } from '../../shared/ui/artifact-panel.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { UiButtonComponent } from '../../shared/ui/ui-button.component';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { UiInputComponent } from '../../shared/ui/ui-input.component';
import { UiTextareaComponent } from '../../shared/ui/ui-textarea.component';

@Component({
  selector: 'app-projects-page',
  imports: [
    NgClass,
    UiCardComponent,
    UiButtonComponent,
    UiInputComponent,
    UiTextareaComponent,
    ArtifactPanelComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row">
      <div class="min-w-0 flex-1 space-y-4">
        <app-ui-card title="Novo projeto" subtitle="Cria um projeto e define-o como ativo no shell.">
          <div class="flex flex-col gap-4">
            <app-ui-input
              label="Nome"
              placeholder="Ex.: App de fidelidade"
              [value]="newName()"
              (valueChange)="newName.set($event)"
            />
            <app-ui-textarea
              label="Descrição (opcional)"
              placeholder="Contexto em uma frase…"
              [rows]="3"
              [value]="newDescription()"
              (valueChange)="newDescription.set($event)"
            />
            <app-ui-button type="button" (clicked)="create()" [disabled]="!canSubmit()">
              Criar projeto
            </app-ui-button>
          </div>
        </app-ui-card>

        <app-ui-card title="Seus projetos" subtitle="Selecione qual projeto está em foco.">
          <ul class="flex flex-col gap-3" role="list">
            @for (project of projects.projects(); track project.id) {
              <li>
                <button
                  type="button"
                  class="flex w-full flex-col gap-1 rounded-xl border px-4 py-3 text-left transition hover:border-primary-200 hover:bg-primary-50/40"
                  [ngClass]="{
                    'border-primary-300': projects.activeProjectId() === project.id,
                    'bg-primary-50/30': projects.activeProjectId() === project.id,
                  }"
                  (click)="select(project)"
                >
                  <span class="text-sm font-semibold text-slate-900">{{ project.name }}</span>
                  <span class="text-xs text-slate-500">
                    Etapa: {{ stageLabel(project.currentStage) }}
                  </span>
                  @if (project.description) {
                    <span class="line-clamp-2 text-sm text-slate-600">{{ project.description }}</span>
                  }
                </button>
              </li>
            }
          </ul>
        </app-ui-card>
      </div>
      <aside class="w-full shrink-0 space-y-3 lg:w-80">
        <app-ui-card title="Pré-visualização" subtitle="Artefatos do projeto ativo (mock).">
          @if (projects.artifactsForActiveProject().length === 0) {
            <app-empty-state
              title="Sem artefatos ainda"
              description="Gere documentos nas próximas etapas ou escolha outro projeto."
            />
          } @else {
            <div class="flex flex-col gap-3">
              @for (a of projects.artifactsForActiveProject(); track a.id) {
                <app-artifact-panel [artifact]="a" />
              }
            </div>
          }
        </app-ui-card>
      </aside>
    </div>
  `,
})
export class ProjectsPage {
  protected readonly projects = inject(ProjectContextService);

  protected readonly newName = signal('');
  protected readonly newDescription = signal('');

  protected stageLabel = stageLabel;

  protected canSubmit(): boolean {
    return this.newName().trim().length > 0;
  }

  protected create(): void {
    if (!this.canSubmit()) {
      return;
    }
    this.projects.createProject(this.newName(), this.newDescription());
    this.newName.set('');
    this.newDescription.set('');
  }

  protected select(project: Project): void {
    this.projects.selectProject(project.id);
  }
}

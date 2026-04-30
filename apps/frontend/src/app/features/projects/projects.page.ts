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
    <div class="mx-auto flex max-w-7xl flex-col gap-6">
      <div class="overflow-hidden rounded-3xl bg-slate-950 shadow-xl ring-1 ring-white/10">
        <div class="bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.35),transparent_35%)] px-6 py-8 sm:px-8">
          <p class="text-sm font-semibold uppercase tracking-wide text-primary-200">Projetos</p>
          <h2 class="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-white">
            Transforme ideias soltas em uma jornada de discovery revisável.
          </h2>
          <p class="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Crie o projeto, selecione o foco ativo e acompanhe os artefatos que serão refinados ao longo do MVP.
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-6 lg:flex-row">
      <div class="min-w-0 flex-1 space-y-6">
        <app-ui-card title="Novo projeto" subtitle="Cria um projeto na API e define-o como ativo no shell.">
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
            <app-ui-button type="button" (clicked)="create()" [disabled]="!canSubmit() || projects.loading()">
              Criar projeto
            </app-ui-button>
            @if (projects.error(); as error) {
              <p class="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-rose-100">{{ error }}</p>
            }
          </div>
        </app-ui-card>

        <app-ui-card title="Seus projetos" subtitle="Selecione qual projeto está em foco.">
          @if (projects.loading() && projects.projects().length === 0) {
            <p class="text-sm text-slate-500">Carregando projetos...</p>
          } @else if (projects.projects().length === 0) {
            <app-empty-state
              title="Nenhum projeto criado"
              description="Crie o primeiro projeto para iniciar o discovery."
            />
          } @else {
            <ul class="flex flex-col gap-3" role="list">
            @for (project of projects.projects(); track project.id) {
              <li>
                <button
                  type="button"
                  class="flex w-full flex-col gap-2 rounded-2xl bg-white px-4 py-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-primary-200"
                  [ngClass]="{
                    'ring-primary-300': projects.activeProjectId() === project.id,
                    'bg-primary-50/40': projects.activeProjectId() === project.id,
                  }"
                  (click)="select(project)"
                >
                  <span class="flex items-center justify-between gap-3">
                    <span class="text-sm font-semibold text-slate-950">{{ project.name }}</span>
                    <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {{ stageLabel(project.currentStage) }}
                    </span>
                  </span>
                  @if (project.description) {
                    <span class="line-clamp-2 text-sm leading-6 text-slate-600">{{ project.description }}</span>
                  }
                </button>
              </li>
            }
            </ul>
          }
        </app-ui-card>
      </div>
      <aside class="w-full shrink-0 space-y-4 lg:w-96">
        <app-ui-card title="Pré-visualização" subtitle="Artefatos do projeto ativo vindos da API.">
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
        <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p class="text-sm font-semibold text-slate-950">Resumo do projeto ativo</p>
          <dl class="mt-4 grid grid-cols-2 gap-4">
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">Projetos</dt>
              <dd class="mt-1 text-2xl font-semibold text-slate-950">{{ projects.projects().length }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">Artefatos</dt>
              <dd class="mt-1 text-2xl font-semibold text-slate-950">{{ projects.artifactsForActiveProject().length }}</dd>
            </div>
          </dl>
        </div>
      </aside>
      </div>
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

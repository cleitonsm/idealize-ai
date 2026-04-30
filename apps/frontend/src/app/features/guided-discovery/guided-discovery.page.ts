import { Component, computed, inject, signal } from '@angular/core';

import type { Stage } from '@idealize-ai/contracts';

import { STAGE_ORDER, stageLabel } from '../../core/stage-labels';
import { ProjectContextService } from '../../core/services/project-context.service';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { StageBadgeComponent } from '../../shared/ui/stage-badge.component';
import { StageTimelineComponent } from '../../shared/ui/stage-timeline.component';
import { UiButtonComponent } from '../../shared/ui/ui-button.component';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { UiTextareaComponent } from '../../shared/ui/ui-textarea.component';

@Component({
  selector: 'app-guided-discovery-page',
  imports: [
    UiCardComponent,
    UiTextareaComponent,
    UiButtonComponent,
    StageTimelineComponent,
    StageBadgeComponent,
    EmptyStateComponent,
  ],
  template: `
    @if (projects.activeProject(); as project) {
      <div class="mx-auto flex max-w-6xl flex-col gap-6">
        <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">Descoberta guiada</p>
              <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Capture contexto, avance etapas e preserve a trilha de decisão.
              </h2>
              <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                A experiência abaixo registra mensagens na API e usa o estágio persistido do projeto.
              </p>
            </div>
            <app-stage-badge [stage]="project.currentStage" />
          </div>
        </div>

        <app-ui-card
          title="Progresso"
          subtitle="Etapas previstas no MVP, sincronizadas com o backend."
        >
          <app-stage-timeline [currentStage]="project.currentStage" />
        </app-ui-card>

        <div class="grid gap-6 lg:grid-cols-5">
          <app-ui-card
            class="lg:col-span-2"
            title="Ideia inicial"
            subtitle="Capture o contexto em texto livre para alimentar o histórico do projeto."
          >
            <div class="flex flex-col gap-3">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Etapa</span>
                <app-stage-badge [stage]="project.currentStage" />
              </div>
              <app-ui-textarea
                label="Descrição da ideia"
                placeholder="Qual problema você quer resolver? Para quem?"
                [rows]="8"
                [value]="ideaDraft()"
                (valueChange)="ideaDraft.set($event)"
              />
              <app-ui-button variant="secondary" type="button" (clicked)="stashIdea()" [disabled]="projects.loading()">
                Registrar ideia
              </app-ui-button>
            </div>
          </app-ui-card>

          <app-ui-card
            class="lg:col-span-3"
            title="Conversa por etapa"
            subtitle="Histórico real registrado no backend."
          >
            <div class="flex max-h-[420px] flex-col gap-3 overflow-y-auto rounded-lg bg-slate-50/80 p-3 ring-1 ring-slate-100">
              @if (projects.history().length === 0) {
                <app-empty-state
                  title="Sem mensagens ainda"
                  description="Registre a ideia inicial ou envie uma mensagem para começar o histórico."
                />
              }
              @for (m of projects.history(); track m.id) {
                <div
                  class="flex flex-col gap-1 rounded-lg px-3 py-2 text-sm shadow-sm"
                  [class.ml-8]="m.role === 'assistant'"
                  [class.mr-8]="m.role === 'user'"
                  [class.bg-white]="m.role === 'assistant'"
                  [class.bg-primary-600]="m.role === 'user'"
                  [class.text-slate-800]="m.role === 'assistant'"
                  [class.text-white]="m.role === 'user'"
                >
                  <span class="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                    {{ m.role === 'user' ? 'Você' : 'Assistente' }} · {{ m.stage ? stageLabel(m.stage) : 'Sem etapa' }}
                  </span>
                  <p class="whitespace-pre-wrap">{{ m.content }}</p>
                </div>
              }
            </div>
            <div class="mt-4 flex flex-col gap-2">
              <app-ui-textarea
                label="Próxima mensagem"
                placeholder="Envie uma nova resposta para o histórico do projeto."
                [rows]="3"
                [value]="composer()"
                (valueChange)="composer.set($event)"
              />
              <div class="flex justify-end">
                <app-ui-button type="button" (clicked)="sendMessage()" [disabled]="projects.loading()">Enviar</app-ui-button>
              </div>
            </div>
          </app-ui-card>
        </div>

        <app-ui-card title="Avançar etapa" subtitle="Solicita ao backend a próxima etapa válida do projeto.">
          <div class="flex flex-wrap gap-2">
            @if (nextStage(); as stage) {
              <app-ui-button variant="ghost" type="button" (clicked)="goToNextStage()" [disabled]="projects.loading()">
                Avançar para {{ stageLabel(stage) }}
              </app-ui-button>
            } @else {
              <p class="text-sm text-slate-500">O projeto já está na etapa final.</p>
            }
          </div>
        </app-ui-card>
      </div>
    } @else {
      <app-empty-state
        title="Selecione um projeto"
        description="Abra a área de Projetos e escolha ou crie um projeto para seguir a descoberta guiada."
      />
    }
  `,
})
export class GuidedDiscoveryPage {
  protected readonly projects = inject(ProjectContextService);

  protected readonly stageLabel = stageLabel;

  protected readonly ideaDraft = signal('');
  protected readonly composer = signal('');

  protected readonly nextStage = computed<Stage | null>(() => {
    const current = this.projects.activeProject()?.currentStage;
    if (!current) {
      return null;
    }
    const nextIndex = STAGE_ORDER.indexOf(current) + 1;
    return STAGE_ORDER[nextIndex] ?? null;
  });

  protected stashIdea(): void {
    const text = this.ideaDraft().trim();
    if (!text) {
      return;
    }
    this.projects.registerIdea(text);
    this.ideaDraft.set('');
  }

  protected sendMessage(): void {
    const text = this.composer().trim();
    if (!text) {
      return;
    }
    this.projects.registerIdea(text);
    this.composer.set('');
  }

  protected goToNextStage(): void {
    this.projects.advanceActiveProject();
  }
}
